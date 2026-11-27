/* ------------------------------------------------------------------ *
 * GPU renderer for the organic dither shapes.
 *
 * ONE WebGL2 context for the whole page (a hidden canvas): every
 * OrganicDither with a shape renders its frame there at CELL resolution
 * (one fragment per 4px cell: lit or not), then its 2D canvas scales it
 * up without smoothing and keeps only the 2px dots (a dot-grid pattern,
 * destination-in). The fragment
 * shader is an exact port of organic-field.ts (same integer hash, value
 * noise, fbm, shapes, Bayer 8×8 threshold, pointer wake), so the GPU
 * and CPU paths draw the same dots. Falls back to the CPU path when
 * WebGL2 is missing, the dot size varies, or the context is lost.
 * ------------------------------------------------------------------ */

import type { OrganicShape } from "@/registry/dither/lib/organic-field";

const SHAPES: Record<OrganicShape, number> = { cloud: 0, scatter: 1, halo: 2, flow: 3 };
const MAX_TRAIL = 28;

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uSize;
uniform float uDpr; // here: the number of cell rows
uniform float uVpY;
uniform float uCell;
uniform float uDot;
uniform int uShape;
uniform float uT;
uniform float uScale;
uniform int uSeed;
uniform vec4 uColor;
uniform vec3 uTrail[${MAX_TRAIL}];
uniform int uTrailN;
uniform float uR;
out vec4 outColor;

const int B4[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
const int Q[4] = int[4](0, 2, 3, 1);

float hash(int x, int y, int seed) {
  uint h = uint(x) * 374761393u + uint(y) * 668265263u + uint(seed) * 2147483647u;
  h = (h ^ (h >> 13u)) * 1274126177u;
  h ^= h >> 16u;
  return float(h) / 4294967296.0;
}
float smooth3(float t) { return t * t * (3.0 - 2.0 * t); }
float band(float v, float lo, float hi) { return smooth3(clamp((v - lo) / (hi - lo), 0.0, 1.0)); }
float vnoise(float x, float y, int seed) {
  float fx = floor(x), fy = floor(y);
  int xi = int(fx), yi = int(fy);
  float tx = smooth3(x - fx), ty = smooth3(y - fy);
  float a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed), c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
float fbm(float x, float y, int seed) {
  float sum = 0.0, amp = 0.5, f = 1.0;
  for (int o = 0; o < 4; o++) { sum += amp * vnoise(x * f, y * f, seed + o * 17); f *= 2.03; amp *= 0.5; }
  return sum / 0.9375;
}
float bayer8(int col, int row) {
  int x = col & 7, y = row & 7;
  int q = (y >> 2) * 2 + (x >> 2);
  return (4.0 * float(B4[(y & 3) * 4 + (x & 3)]) + float(Q[q]) + 0.5) / 64.0;
}
float density(float u, float v, float aspect) {
  float nx = u * aspect * uScale, ny = v * uScale, drift = uT * 0.06;
  if (uShape == 0) {
    float wx = fbm(nx * 0.6 + drift, ny * 0.6, uSeed + 3) - 0.5;
    float wy = fbm(nx * 0.6, ny * 0.6 - drift, uSeed + 7) - 0.5;
    float n = fbm(nx + wx * 1.6 + drift * 0.5, ny + wy * 1.6, uSeed);
    return band(n, 0.4, 0.66);
  } else if (uShape == 1) {
    float n = fbm(nx * 1.4 + drift, ny * 1.4, uSeed);
    float edge = 0.34 + (n - 0.5) * 0.7;
    float fall = band(1.0 - (v - edge) * 2.2, 0.1, 0.9);
    float tail = band(n, 0.45, 0.8) * 0.32 * (1.0 - v * 0.6);
    return max(fall, tail);
  } else if (uShape == 2) {
    float dx = (u - 0.5) * 2.0, dy = (v - 0.5) * 2.0;
    float r = sqrt(dx * dx + dy * dy);
    float n = fbm(nx * 1.2 + drift, ny * 1.2 - drift, uSeed);
    return band(r + (n - 0.5) * 0.55, 0.78, 1.12);
  }
  float w = fbm(nx * 0.5 + drift, ny * 0.5, uSeed) * 6.0;
  float s = sin((nx * 0.9 + ny * 1.4) * 3.4 + w);
  float n = fbm(nx * 2.0, ny * 2.0, uSeed + 11);
  return band(0.5 + s * 0.6 + (n - 0.5) * 0.6, 0.35, 0.8);
}
void main() {
  // One fragment per cell; row 0 at the top.
  vec2 c = vec2(floor(gl_FragCoord.x), uDpr - 1.0 - floor(gl_FragCoord.y - uVpY));
  float x = c.x * uCell, y = c.y * uCell;
  float dens = density((x + uCell * 0.5) / uSize.x, (y + uCell * 0.5) / uSize.y, uSize.x / uSize.y);
  if (uTrailN > 0) {
    float infl = 0.0;
    for (int i = 0; i < ${MAX_TRAIL}; i++) {
      if (i >= uTrailN) break;
      vec2 d = vec2(x, y) - uTrail[i].xy;
      float d2 = dot(d, d);
      if (d2 < uR * uR * 2.6) infl = max(infl, uTrail[i].z * (1.0 - sqrt(d2) / (uR * 1.6)));
    }
    if (infl > 0.02) {
      float wobble = fbm(x * 0.02 + uT * 0.4, y * 0.02, uSeed + 31);
      float k = clamp(infl * (0.6 + wobble * 0.9), 0.0, 1.0);
      float grain = fbm(x * 0.05 - uT * 0.8, y * 0.05 + uT * 0.5, uSeed + 53) * 0.55;
      dens = dens * (1.0 - k) + grain * k * (1.0 - k * 0.6);
    }
  }
  if (dens <= bayer8(int(c.x), int(c.y))) discard;
  outColor = vec4(uColor.rgb * uColor.a, uColor.a);
}`;

type GL = {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  loc: Record<string, WebGLUniformLocation | null>;
};

let state: GL | null | false = null; // null = not tried, false = unavailable

function init(): GL | false {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
    if (!gl) return false;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const p = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(p);
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
    const names = ["uSize", "uDpr", "uVpY", "uCell", "uDot", "uShape", "uT", "uScale", "uSeed", "uColor", "uTrail", "uTrailN", "uR"];
    const loc = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)]));
    canvas.addEventListener("webglcontextlost", () => {
      state = false;
    });
    return { gl, canvas, loc };
  } catch {
    return false;
  }
}

/** Is the GPU path available (for diagnostics / the perf budget)? */
export function ditherGpuAvailable() {
  if (state === null) state = init();
  return state !== false;
}

const colorCtx = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;
const colorCache = new Map<string, [number, number, number, number]>();

function rgba(color: string): [number, number, number, number] {
  const hit = colorCache.get(color);
  if (hit) return hit;
  let out: [number, number, number, number] = [0.5, 0.5, 0.5, 1];
  if (colorCtx) {
    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = "#808080";
    colorCtx.fillStyle = color;
    colorCtx.fillRect(0, 0, 1, 1);
    const d = colorCtx.getImageData(0, 0, 1, 1).data;
    out = [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
  }
  if (colorCache.size > 64) colorCache.clear();
  colorCache.set(color, out);
  return out;
}

export interface GpuShapeFrame {
  shape: OrganicShape;
  /** CSS size of the target. */
  w: number;
  h: number;
  dpr: number;
  cell: number;
  dot: number;
  t: number;
  seed: number;
  scale: number;
  color: string;
  trail: { x: number; y: number; life: number }[];
  wakeRadius: number;
}

const trailBuf = new Float32Array(MAX_TRAIL * 3);

/**
 * Renders one frame on the shared GPU canvas and copies it into `ctx` (which must have the dpr transform).
 * Returns false when the GPU path is not available: draw on the CPU instead.
 */
const dotPatterns = new Map<string, CanvasPattern | null>();

/** A cell×cell tile with one dot, at device pixels, as a pattern in CSS px. */
function dotPattern(ctx: CanvasRenderingContext2D, cell: number, dot: number, dpr: number) {
  const key = `${cell}:${dot}:${dpr}`;
  if (dotPatterns.has(key)) return dotPatterns.get(key)!;
  const c = document.createElement("canvas");
  c.width = c.height = Math.round(cell * dpr);
  const g = c.getContext("2d")!;
  const o = ((cell - dot) / 2) * dpr;
  g.fillRect(o, o, dot * dpr, dot * dpr);
  const pat = ctx.createPattern(c, "repeat");
  pat?.setTransform(new DOMMatrix().scale(1 / dpr));
  dotPatterns.set(key, pat);
  return pat;
}

export function renderShapeGpu(ctx: CanvasRenderingContext2D, f: GpuShapeFrame): boolean {
  // Diagnostics / perf comparison: window.__ditherForceCpu = true draws everything on the CPU.
  if ((globalThis as { __ditherForceCpu?: boolean }).__ditherForceCpu) return false;
  if (state === null) state = init();
  if (!state) return false;
  const { gl, canvas, loc } = state;
  // Cell resolution.
  const W = Math.max(1, Math.ceil(f.w / f.cell));
  const H = Math.max(1, Math.ceil(f.h / f.cell));
  // Grow the shared canvas when a bigger target comes along (never shrink: no reallocation per frame).
  if (canvas.width < W || canvas.height < H) {
    canvas.width = Math.max(canvas.width, W);
    canvas.height = Math.max(canvas.height, H);
  }
  // Draw into the top-left W×H corner (GL y goes up, so offset the viewport from the bottom).
  const vpY = canvas.height - H;
  gl.viewport(0, vpY, W, H);
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(0, vpY, W, H);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(loc.uSize, f.w, f.h);
  gl.uniform1f(loc.uDpr, H);
  gl.uniform1f(loc.uVpY, vpY);
  gl.uniform1f(loc.uCell, f.cell);
  gl.uniform1f(loc.uDot, f.dot);
  gl.uniform1i(loc.uShape, SHAPES[f.shape]);
  gl.uniform1f(loc.uT, f.t);
  gl.uniform1f(loc.uScale, f.scale);
  gl.uniform1i(loc.uSeed, f.seed | 0);
  gl.uniform4fv(loc.uColor, rgba(f.color));
  const n = Math.min(MAX_TRAIL, f.trail.length);
  for (let i = 0; i < n; i++) {
    trailBuf[i * 3] = f.trail[i].x;
    trailBuf[i * 3 + 1] = f.trail[i].y;
    trailBuf[i * 3 + 2] = f.trail[i].life;
  }
  gl.uniform3fv(loc.uTrail, trailBuf);
  gl.uniform1i(loc.uTrailN, n);
  gl.uniform1f(loc.uR, f.wakeRadius);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  ctx.clearRect(0, 0, f.w, f.h);
  // Each cell becomes a cell×cell block (no smoothing), then only the dot inside each block is kept.
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, W, H, 0, 0, W * f.cell, H * f.cell);
  const pat = dotPattern(ctx, f.cell, f.dot, f.dpr);
  if (pat) {
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, f.w, f.h);
    ctx.globalCompositeOperation = "source-over";
  }
  return true;
}
