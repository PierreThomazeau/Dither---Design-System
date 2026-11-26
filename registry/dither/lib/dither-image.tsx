"use client";

import * as React from "react";

import { runDitherStep, stopDitherStep } from "@/registry/dither/lib/organic-dither";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * Dither images: a library of abstract compositions (soft, blurred
 * colour bands and glows, painted from the design tokens), or any image
 * you pass as `src`, rendered through the Dither grid.
 *
 *  - "dots":  one square dot per cell, coloured by the image, sized and
 *             thresholded (Bayer 4×4) by its brightness: dark areas thin
 *             out to nothing, bright colour packs dense.
 *  - "pixel": same threshold, but lit cells are filled whole and their
 *             colours posterised (6 levels, ordered dither): a crisp print.
 *
 * The source is painted at grid resolution (one sample per cell), so it
 * is cheap enough to drift slowly; rendering shares the dither rAF loop,
 * pauses off-screen and stays still under reduced motion.
 * ------------------------------------------------------------------ */

export type DitherImageMode = "dots" | "pixel";
export type DitherImageGround = "dark" | "light";

type Band = {
  /** CSS custom property of the colour. */
  color: string;
  /** Position across the composition, 0–1. */
  at: number;
  /** Thickness and blur, as a share of the diagonal. */
  width: number;
  blur: number;
  /** Wave amplitude (share of the diagonal) and frequency. */
  amp?: number;
  freq?: number;
  phase?: number;
  alpha?: number;
};

type Glow = { color: string; x: number; y: number; r: number; alpha?: number };

export type AbstractPreset = {
  label: string;
  /** Rotation of the bands, radians (0 = horizontal). */
  angle: number;
  bands: Band[];
  glows?: Glow[];
};

export const abstractPresets = {
  ember: {
    label: "Ember",
    angle: -0.52,
    bands: [
      { color: "--chart-4", at: 0.46, width: 0.16, blur: 0.09, amp: 0.025, freq: 1.2 },
      { color: "--destructive", at: 0.5, width: 0.05, blur: 0.04, amp: 0.02, freq: 1.4, alpha: 0.8 },
      { color: "--chart-1", at: 0.7, width: 0.24, blur: 0.1, amp: 0.035, freq: 1, phase: 1.3 },
      { color: "--chart-3", at: 0.8, width: 0.12, blur: 0.09, amp: 0.03, freq: 1.6, phase: 2.1, alpha: 0.85 },
    ],
    glows: [{ color: "--chart-3", x: 0.95, y: 0.7, r: 0.35, alpha: 0.7 }],
  },
  lagoon: {
    label: "Lagoon",
    angle: 0.32,
    bands: [
      { color: "--chart-5", at: 0.42, width: 0.2, blur: 0.1, amp: 0.04, freq: 1.1 },
      { color: "--chart-1", at: 0.58, width: 0.14, blur: 0.07, amp: 0.03, freq: 1.5, phase: 0.8 },
      { color: "--chart-2", at: 0.76, width: 0.22, blur: 0.11, amp: 0.03, freq: 0.9, phase: 2 },
    ],
  },
  dusk: {
    label: "Dusk",
    angle: -0.18,
    bands: [
      { color: "--chart-3", at: 0.5, width: 0.22, blur: 0.11, amp: 0.03, freq: 1 },
      { color: "--destructive", at: 0.64, width: 0.1, blur: 0.07, amp: 0.025, freq: 1.4, phase: 1.1 },
      { color: "--chart-4", at: 0.76, width: 0.16, blur: 0.09, amp: 0.03, freq: 1.1, phase: 2.4 },
    ],
  },
  aurora: {
    label: "Aurora",
    angle: 0.05,
    bands: [
      { color: "--positive", at: 0.34, width: 0.08, blur: 0.06, amp: 0.07, freq: 1.8, alpha: 0.9 },
      { color: "--chart-5", at: 0.42, width: 0.14, blur: 0.08, amp: 0.06, freq: 1.5, phase: 0.6 },
      { color: "--chart-3", at: 0.56, width: 0.12, blur: 0.09, amp: 0.07, freq: 1.3, phase: 1.9 },
    ],
  },
  prism: {
    label: "Prism",
    angle: -0.82,
    bands: [
      { color: "--chart-1", at: 0.36, width: 0.07, blur: 0.04, amp: 0.015, freq: 1.2 },
      { color: "--chart-5", at: 0.44, width: 0.07, blur: 0.04, amp: 0.015, freq: 1.2, phase: 0.4 },
      { color: "--positive", at: 0.52, width: 0.06, blur: 0.04, amp: 0.015, freq: 1.2, phase: 0.8 },
      { color: "--chart-4", at: 0.6, width: 0.07, blur: 0.04, amp: 0.015, freq: 1.2, phase: 1.2 },
      { color: "--destructive", at: 0.67, width: 0.06, blur: 0.04, amp: 0.015, freq: 1.2, phase: 1.6 },
      { color: "--chart-3", at: 0.75, width: 0.08, blur: 0.05, amp: 0.015, freq: 1.2, phase: 2 },
    ],
  },
  nebula: {
    label: "Nebula",
    angle: 0,
    bands: [{ color: "--chart-2", at: 0.62, width: 0.3, blur: 0.15, amp: 0.05, freq: 0.8, alpha: 0.7 }],
    glows: [
      { color: "--chart-3", x: 0.32, y: 0.42, r: 0.32 },
      { color: "--brand", x: 0.66, y: 0.58, r: 0.38 },
      { color: "--chart-1", x: 0.78, y: 0.28, r: 0.18, alpha: 0.8 },
    ],
  },
  tide: {
    label: "Tide",
    angle: 1.32,
    bands: [
      { color: "--chart-2", at: 0.38, width: 0.2, blur: 0.1, amp: 0.05, freq: 1.2 },
      { color: "--chart-1", at: 0.56, width: 0.16, blur: 0.08, amp: 0.05, freq: 1.4, phase: 1 },
      { color: "--chart-5", at: 0.72, width: 0.1, blur: 0.07, amp: 0.04, freq: 1.7, phase: 2.2, alpha: 0.85 },
    ],
  },
  flare: {
    label: "Flare",
    angle: -0.3,
    bands: [{ color: "--destructive", at: 0.72, width: 0.12, blur: 0.09, amp: 0.03, freq: 1.2, alpha: 0.75 }],
    glows: [
      { color: "--chart-4", x: 0.42, y: 0.62, r: 0.34 },
      { color: "--destructive", x: 0.52, y: 0.7, r: 0.2, alpha: 0.8 },
      { color: "--chart-3", x: 0.85, y: 0.25, r: 0.22, alpha: 0.6 },
    ],
  },
} satisfies Record<string, AbstractPreset>;

export type AbstractPresetName = keyof typeof abstractPresets;
export const abstractPresetNames = Object.keys(abstractPresets) as AbstractPresetName[];

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

type Palette = { ground: string; colors: Map<string, string> };

/** Reads the token colours from the element (so light / dark follow) and picks the ground. */
function readPalette(el: Element, preset: AbstractPreset | null, ground: DitherImageGround): Palette {
  const cs = getComputedStyle(el);
  const colors = new Map<string, string>();
  for (const b of [...(preset?.bands ?? []), ...(preset?.glows ?? [])]) {
    if (!colors.has(b.color)) colors.set(b.color, cs.getPropertyValue(b.color).trim() || "#888");
  }
  // The darkest / lightest neutral of the current theme, whichever mode the page is in.
  const bg = cs.getPropertyValue("--background").trim();
  const fg = cs.getPropertyValue("--foreground").trim();
  const lum = (c: string) => {
    const m = /^#([0-9a-f]{6})$/i.exec(c);
    if (!m) return 0.5;
    const n = parseInt(m[1], 16);
    return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11) / 255;
  };
  const [dark, light] = lum(bg) < lum(fg) ? [bg, fg] : [fg, bg];
  return { ground: (ground === "dark" ? dark : light) || (ground === "dark" ? "#0b0b0b" : "#fafafa"), colors };
}

/** Paints the abstract composition at grid resolution (gw × gh), time `t` in seconds. */
function paintPreset(ctx: CanvasRenderingContext2D, gw: number, gh: number, preset: AbstractPreset, pal: Palette, ground: DitherImageGround, t: number, seed: number) {
  const D = Math.hypot(gw, gh);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, 0, gw, gh);
  ctx.globalCompositeOperation = ground === "dark" ? "lighter" : "multiply";
  ctx.translate(gw / 2, gh / 2);
  ctx.rotate(preset.angle);
  ctx.lineCap = "round";
  for (const [i, b] of preset.bands.entries()) {
    const ph = (b.phase ?? 0) + seed * 1.7 + i * 0.3;
    ctx.globalAlpha = b.alpha ?? 1;
    ctx.strokeStyle = pal.colors.get(b.color)!;
    ctx.lineWidth = b.width * D;
    ctx.filter = `blur(${Math.max(1, b.blur * D)}px)`;
    ctx.beginPath();
    const y0 = (b.at - 0.5) * D;
    for (let x = -D * 0.75; x <= D * 0.75; x += Math.max(2, D / 120)) {
      const u = (x / D) * Math.PI * 2;
      const y = y0 + Math.sin(u * (b.freq ?? 1) + ph + t * 0.25) * (b.amp ?? 0) * D + Math.sin(u * (b.freq ?? 1) * 2.3 + ph * 1.6 - t * 0.17) * (b.amp ?? 0) * 0.4 * D;
      if (x === -D * 0.75) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = "none";
  for (const [i, g] of (preset.glows ?? []).entries()) {
    const x = (g.x + Math.sin(t * 0.13 + i * 2 + seed) * 0.03) * gw;
    const y = (g.y + Math.cos(t * 0.11 + i * 1.3 + seed) * 0.03) * gh;
    const r = g.r * D;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, pal.colors.get(g.color)!);
    grad.addColorStop(1, "transparent");
    ctx.globalAlpha = g.alpha ?? 1;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, gw, gh);
  }
  ctx.restore();
}

function parseColor(c: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (m) {
    const n = parseInt(m[1], 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  const r = /rgba?\(([^)]+)\)/.exec(c);
  if (r) {
    const [a, b, d] = r[1].split(/[\s,/]+/).map(Number);
    return [a, b, d];
  }
  return [11, 11, 11];
}

/**
 * Renders the grid samples (`src`, gw × gh RGBA) into `out` (w × h pixels, RGBA) as dots or pixels.
 * Writing pixels directly keeps tens of thousands of cells cheap.
 */
function rasterize(src: Uint8ClampedArray, gw: number, gh: number, out: ImageData, cell: number, mode: DitherImageMode, ground: DitherImageGround, groundRgb: [number, number, number], dot: [number, number]) {
  const { width: w, height: h, data } = out;
  const px = new Uint32Array(data.buffer);
  const pack = (r: number, g: number, b: number) => (255 << 24) | (b << 16) | (g << 8) | r;
  px.fill(pack(...groundRgb));
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const i = (gy * gw + gx) * 4;
      let r = src[i], g = src[i + 1], b = src[i + 2];
      const th = (BAYER[(gy & 3) * 4 + (gx & 3)] + 0.5) / 16;
      const v = ground === "dark" ? Math.max(r, g, b) / 255 : 1 - Math.min(r, g, b) / 255;
      if (v < 0.04 + th * 0.9) continue;
      // Dots grow with brightness; pixels fill the whole cell (blocks merge into a crisp print).
      const size = mode === "dots" ? Math.round(dot[0] + (dot[1] - dot[0]) * Math.min(1, v)) : cell;
      if (ground === "dark") {
        // Brighten so colour reads on the dark ground.
        const k = (255 * (0.62 + 0.38 * v)) / Math.max(1, r, g, b);
        r = Math.min(255, r * k);
        g = Math.min(255, g * k);
        b = Math.min(255, b * k);
      }
      if (mode === "pixel") {
        // Posterise to 6 levels per channel, ordered-dithered.
        const q = (c: number) => Math.min(255, Math.round(Math.floor((c / 255) * 5 + th) * 51));
        r = q(r);
        g = q(g);
        b = q(b);
      }
      const color = pack(r | 0, g | 0, b | 0);
      const ox = gx * cell + ((cell - size) >> 1);
      const oy = gy * cell + ((cell - size) >> 1);
      for (let y = oy; y < oy + size && y < h; y++) {
        const row = y * w;
        for (let x = ox; x < ox + size && x < w; x++) px[row + x] = color;
      }
    }
  }
}

/** Draws an image into the grid canvas with object-fit: cover. */
function paintImage(ctx: CanvasRenderingContext2D, gw: number, gh: number, img: HTMLImageElement, pal: Palette) {
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, 0, gw, gh);
  const s = Math.max(gw / img.naturalWidth, gh / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  ctx.drawImage(img, (gw - w) / 2, (gh - h) / 2, w, h);
}

export interface DitherImageOptions {
  preset?: AbstractPresetName;
  /** Your own image instead of a preset (same origin, or CORS-enabled). */
  src?: string;
  mode?: DitherImageMode;
  ground?: DitherImageGround;
  /** Grid cell in px. */
  cell?: number;
  /** Dot size range in px ("dots" mode). */
  dot?: [number, number];
  seed?: number;
}

/**
 * Renders a still to a new canvas (e.g. to download it). `el` gives the theme to read tokens from.
 * Returns a promise because `src` images have to load first.
 */
export async function renderDitherImage(el: Element, width: number, height: number, opts: DitherImageOptions & { time?: number } = {}) {
  const { preset = "ember", src, mode = "dots", ground = "dark", cell = 6, dot = [2, 4], seed = 0, time = 0 } = opts;
  const p = src ? null : abstractPresets[preset];
  const pal = readPalette(el, p, ground);
  const gw = Math.ceil(width / cell), gh = Math.ceil(height / cell);
  const grid = document.createElement("canvas");
  grid.width = gw;
  grid.height = gh;
  const g = grid.getContext("2d", { willReadFrequently: true })!;
  if (src) paintImage(g, gw, gh, await loadImage(src), pal);
  else paintPreset(g, gw, gh, p!, pal, ground, time, seed);
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const o = out.getContext("2d")!;
  const img = o.createImageData(width, height);
  rasterize(g.getImageData(0, 0, gw, gh).data, gw, gh, img, cell, mode, ground, parseColor(pal.ground), dot);
  o.putImageData(img, 0, 0);
  return out;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export interface DitherImageProps extends DitherImageOptions, Omit<React.ComponentProps<"div">, "children"> {
  /** Slow drift of the composition (presets only). Still under reduced motion. */
  animated?: boolean;
}

/** An abstract image (or your `src`) through the Dither grid. Fills its box; give it a size or an aspect ratio. */
function DitherImage({
  preset = "ember",
  src,
  mode = "dots",
  ground = "dark",
  cell = 6,
  dot = [2, 4],
  seed = 0,
  animated = true,
  className,
  style,
  ...props
}: DitherImageProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dotMin, dotMax] = dot;

  React.useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = src ? null : abstractPresets[preset];
    const grid = document.createElement("canvas");
    const g = grid.getContext("2d", { willReadFrequently: true })!;
    const ctx = canvas.getContext("2d")!;
    let pal = readPalette(host, p, ground);
    let img: HTMLImageElement | null = null;
    let out: ImageData | null = null;
    let gw = 0, gh = 0;
    let visible = false;
    let last = 0;
    const t0 = performance.now();

    const draw = (now: number) => {
      if (!out || (!p && !img)) return;
      if (img) paintImage(g, gw, gh, img, pal);
      else paintPreset(g, gw, gh, p!, pal, ground, animated && !reduced ? (now - t0) / 1000 : 0, seed);
      rasterize(g.getImageData(0, 0, gw, gh).data, gw, gh, out, cell, mode, ground, parseColor(pal.ground), [dotMin, dotMax]);
      ctx.putImageData(out, 0, 0);
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      canvas.width = w;
      canvas.height = h;
      gw = Math.ceil(w / cell);
      gh = Math.ceil(h / cell);
      grid.width = gw;
      grid.height = gh;
      out = ctx.createImageData(w, h);
      draw(performance.now());
    };

    // ~24 fps drift on the shared dither loop, only while visible.
    const step = (now: number) => {
      if (!visible) return false;
      if (now - last > 42) {
        last = now;
        draw(now);
      }
      return true;
    };
    const live = animated && !reduced && !src;

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && live) runDitherStep(step);
    });
    io.observe(host);
    // Theme switch: re-read the tokens.
    const mo = new MutationObserver(() => {
      pal = readPalette(host, p, ground);
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });

    if (src) {
      loadImage(src)
        .then((i) => {
          img = i;
          draw(performance.now());
        })
        .catch(() => {});
    }
    resize();

    return () => {
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      stopDitherStep(step);
    };
  }, [preset, src, mode, ground, cell, dotMin, dotMax, seed, animated]);

  const label = src ? "Dithered image" : `${abstractPresets[preset].label} abstract image`;
  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={label}
      data-slot="dither-image"
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full [image-rendering:pixelated]" />
    </div>
  );
}

export { DitherImage };
