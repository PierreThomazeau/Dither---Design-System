"use client";

import * as React from "react";
import type * as Three from "three";

import { cn } from "@/registry/dither/lib/utils";
import { Button } from "@/registry/dither/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/registry/dither/ui/popover";

/* ------------------------------------------------------------------ *
 * Companion: the 3D AI buddy of the chat.
 * A satin (matte) chrome "squircle" body (superellipsoid) tinted with
 * the page's background colour, with a square LED screen;
 * the face is drawn crisp, shrunk to 80×80 dots and dithered in 1 bit
 * (Bayer 4×4), so it speaks the same dither language as the rest of
 * the system. Every expression is a set of numbers that glide toward
 * the requested mood, so changes are always smooth.
 *
 * Driven by `status` (what the AI is doing) and optionally `mood`:
 *  - listening  → looks at what you type, tinted positive
 *  - thinking   → looks up, thought dots, tinted brand
 *  - long wait  → bored, then lazy (yawns), tinted destructive
 *  - responding → talks
 *  - done       → one multicolour band sweeps up the body + "Done"
 *  - error      → sad, tinted destructive
 * Tints are design tokens mixed into the background colour, read live
 * from CSS (so light / dark and theme changes follow).
 * three.js is loaded on demand and everything is disposed on unmount.
 * ------------------------------------------------------------------ */

export type CompanionMood =
  | "happy"
  | "proud"
  | "excited"
  | "impatient"
  | "sleepy"
  | "resting"
  | "bored"
  | "disdainful"
  | "lazy"
  | "thinking"
  | "sad";

export type CompanionStatus = "idle" | "listening" | "thinking" | "responding" | "done" | "error";

/** What the companion is showing right now: the status, plus the two "taking long" steps. */
export type CompanionPhase = CompanionStatus | "slow" | "stalled";

export type CompanionEvent = "bounce" | "spin" | "bravo" | "blink" | "yawn";

/** Body material. Default: clear glass. */
export type CompanionMaterial = "plastic" | "ceramic" | "frosted" | "clear" | "gel" | "chrome" | "brushed" | "gold" | "iridescent";

/** Body colour: the neutral background tint, or one of the chart colours. */
export type CompanionColor = "neutral" | "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";

export interface CompanionHandle {
  play: (event: CompanionEvent) => void;
}

export interface CompanionProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** What the AI is doing. Picks the mood, the chrome colour and the talking state. */
  status?: CompanionStatus;
  /** Forces an expression (otherwise derived from the status). */
  mood?: CompanionMood;
  /** Forces the mouth to talk (otherwise: while `status="responding"`). */
  talking?: boolean;
  /** Seconds of thinking before it gets bored and the chrome turns red. Lazy after 2.2×. */
  slowAfter?: number;
  /** Width and height in px. */
  size?: number;
  /** Eyes follow the pointer anywhere on the page. */
  followPointer?: boolean;
  onPhaseChange?: (phase: CompanionPhase) => void;
  /** Click (or Enter / Space): it spins and opens a picker for its colour and material. */
  customizable?: boolean;
  /** Body material (controlled). Default: the viewer's last choice, else "clear" (clear glass). */
  material?: CompanionMaterial;
  onMaterialChange?: (material: CompanionMaterial) => void;
  /** Body colour (controlled). Default: the viewer's last choice, else "neutral". */
  color?: CompanionColor;
  onColorChange?: (color: CompanionColor) => void;
  /** Imperative events: bounce, spin, bravo, blink, yawn. */
  controlRef?: React.Ref<CompanionHandle>;
}

/* ---------- Expressions: all numbers ---------- *
 * Drawn in a dry, sketchy style (thin vertical eye strokes, flat brow bars, small dash mouths), not a cute one.
 * Eyes: w width of arcs / closed lines · h stroke height · sep spacing · tilt slant · lid top cut · skew lid L/R ·
 *   smile ∩ arcs · arrow > < · closed line, ccurve its curve.
 * Brows: brow presence · browY raise · browTilt (+ inner end down: cross, − inner end up: worried) · browSkew one brow up.
 * Mouth: curve smile (+) / frown (−) · smirk one corner up · open D mouth · mw width.
 * blush cheeks (unused by default) · zz "zZ" · dots thought dots · lean forward (+) / back (−) · slump sag · breath speed. */
const KEYS = [
  "w", "h", "sep", "tilt", "lid", "skew", "smile", "arrow", "closed", "ccurve",
  "brow", "browY", "browTilt", "browSkew",
  "curve", "smirk", "open", "mw", "blush", "zz", "dots", "lean", "slump", "breath",
] as const;
type Key = (typeof KEYS)[number];
type Face = Record<Key, number>;

const BASE: Face = {
  w: 0.1, h: 0.11, sep: 0.17, tilt: 0, lid: 0, skew: 0, smile: 0, arrow: 0, closed: 0, ccurve: 0,
  brow: 0, browY: 0, browTilt: 0, browSkew: 0,
  curve: 0.008, smirk: 0, open: 0, mw: 0.05, blush: 0, zz: 0, dots: 0, lean: 0, slump: 0, breath: 1.6,
};
const face = (p: Partial<Face>): Face => ({ ...BASE, ...p });

type Gaze = "follow" | "drift" | { x: number; y: number; jitter: number };

const MOODS: Record<CompanionMood, { face: Face; gaze: Gaze }> = {
  /* Calm: two strokes and a short dash. */
  happy: { face: BASE, gaze: "follow" },
  /* Confident: ∩ eyes, wide open grin. */
  proud: { face: face({ w: 0.11, smile: 1, curve: 0.045, open: 0.1, mw: 0.13, lean: -0.06 }), gaze: "follow" },
  /* Excited: ∩ eyes, a wide U line. */
  excited: { face: face({ w: 0.11, smile: 1, curve: 0.06, mw: 0.15, lean: 0.04, breath: 2.6 }), gaze: "follow" },
  /* Irritated: brows pressed down on the strokes, small frown. */
  impatient: { face: face({ h: 0.1, lid: 0.25, brow: 1, browTilt: 0.2, curve: -0.018, mw: 0.06, breath: 2 }), gaze: "follow" },
  /* Tired: closed lines, drooping brows, zZ. */
  sleepy: { face: face({ closed: 1, brow: 1, browY: 0.015, browTilt: -0.1, curve: 0, open: 0.04, mw: 0.035, zz: 1, lean: 0.07, breath: 0.8 }), gaze: { x: 0, y: 0.3, jitter: 0 } },
  /* Pleased: closed ∩ arcs, faint smile. */
  resting: { face: face({ smile: 1, curve: 0.025, mw: 0.05, lean: 0.02, breath: 1 }), gaze: { x: 0, y: 0.2, jitter: 0 } },
  /* Bored: T T (flat brows sitting on cut strokes), flat dash, leaning back, eyes wandering off. */
  bored: { face: face({ lid: 0.42, brow: 1, curve: 0, mw: 0.045, lean: -0.07, slump: 0.02, breath: 0.7 }), gaze: "drift" },
  /* Snooty: one lid low, one brow up, smirk, head back, eyes to the side. */
  disdainful: { face: face({ lid: 0.3, skew: 0.22, brow: 1, browY: 0.02, browSkew: -0.045, browTilt: 0.05, curve: 0, smirk: 0.03, mw: 0.06, lean: -0.1, breath: 1.1 }), gaze: { x: 0.85, y: 0.15, jitter: 0.15 } },
  /* Lazy: lids almost shut under heavy brows, slumped, yawns now and then. */
  lazy: { face: face({ lid: 0.66, brow: 1, browTilt: -0.12, curve: -0.006, mw: 0.045, lean: 0.1, slump: 0.06, breath: 0.55 }), gaze: { x: -0.1, y: 0.4, jitter: 0.2 } },
  /* Curious: one brow up, tight mouth, thought dots. */
  thinking: { face: face({ h: 0.12, brow: 1, browY: 0.015, browSkew: 0.05, curve: -0.006, mw: 0.035, dots: 1, lean: -0.04, breath: 1.3 }), gaze: { x: -0.55, y: -0.9, jitter: 0.12 } },
  /* Concerned: short strokes, brows lifted at the inner end, small frown. */
  sad: { face: face({ h: 0.075, brow: 1, browY: 0.025, browTilt: -0.22, curve: -0.028, mw: 0.06, lean: 0.06, slump: 0.03, breath: 0.9 }), gaze: { x: 0, y: 0.5, jitter: 0.25 } },
};

/* Body colour per phase: the page background, with a share of a design token mixed in. */
const TINT: Record<CompanionPhase, [token: string | null, mix: number]> = {
  idle: [null, 0],
  listening: ["--positive", 0.28],
  thinking: ["--brand", 0.38],
  slow: ["--destructive", 0.42],
  stalled: ["--destructive", 0.68],
  responding: [null, 0],
  done: [null, 0],
  error: ["--destructive", 0.5],
};
const BODY_TOKEN = "--background-muted";

const PHASE_MOOD: Record<CompanionPhase, CompanionMood> = {
  idle: "happy",
  listening: "happy",
  thinking: "thinking",
  slow: "bored",
  stalled: "lazy",
  responding: "happy",
  done: "proud",
  error: "sad",
};

const PHASE_LABEL: Record<CompanionPhase, string> = {
  idle: "ready",
  listening: "listening",
  thinking: "thinking",
  slow: "still thinking",
  stalled: "taking a long time",
  responding: "answering",
  done: "done",
  error: "something went wrong",
};

/* ---------- Materials (three.js MeshPhysicalMaterial settings) ---------- */
type MaterialSpec = {
  label: string;
  params: Record<string, number | [number, number]>;
  /** Glows from inside: a lit core shows through the glass. */
  core?: boolean;
  /** Glass tinted deep in the mass (gel). */
  deep?: boolean;
  /** Keeps its own colour (gold). */
  fixed?: string;
  brushed?: boolean;
};

const MATERIALS: Record<CompanionMaterial, MaterialSpec> = {
  plastic: { label: "Soft plastic", params: { metalness: 0, roughness: 0.62, sheen: 0.35, sheenRoughness: 0.8, envMapIntensity: 0.3 } },
  ceramic: { label: "Ceramic", params: { metalness: 0, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.55 } },
  frosted: {
    label: "Frosted glass",
    params: { metalness: 0, roughness: 0.38, transmission: 1, thickness: 1.8, ior: 1.45, clearcoat: 0.4, clearcoatRoughness: 0.35, attenuationDistance: 2.2, envMapIntensity: 1 },
    core: true,
  },
  clear: {
    label: "Clear glass",
    params: { metalness: 0, roughness: 0.02, transmission: 1, thickness: 1.2, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0, attenuationDistance: 4, envMapIntensity: 1.2 },
    core: true,
  },
  gel: {
    label: "Gel",
    params: { metalness: 0, roughness: 0.14, transmission: 1, thickness: 2.4, ior: 1.33, clearcoat: 1, clearcoatRoughness: 0.08, attenuationDistance: 0.45, envMapIntensity: 0.9 },
    core: true,
    deep: true,
  },
  chrome: { label: "Satin chrome", params: { metalness: 1, roughness: 0.34, clearcoat: 0.3, clearcoatRoughness: 0.45, envMapIntensity: 1.1 } },
  brushed: { label: "Brushed metal", params: { metalness: 1, roughness: 0.3, envMapIntensity: 1.1 }, brushed: true },
  gold: { label: "Gold", params: { metalness: 1, roughness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.05, envMapIntensity: 1.2 }, fixed: "#F0C063" },
  iridescent: {
    label: "Iridescent",
    params: { metalness: 1, roughness: 0.06, clearcoat: 0.5, clearcoatRoughness: 0.03, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [0, 420], envMapIntensity: 1.2 },
  },
};

const COLORS: { id: CompanionColor; label: string }[] = [
  { id: "neutral", label: "Neutral" },
  { id: "chart-1", label: "Sky" },
  { id: "chart-2", label: "Indigo" },
  { id: "chart-3", label: "Violet" },
  { id: "chart-4", label: "Orange" },
  { id: "chart-5", label: "Teal" },
];

const STORAGE_KEY = "dither-companion-appearance";

function readStoredAppearance(): { material: CompanionMaterial; color: CompanionColor } {
  const fallback = { material: "clear" as CompanionMaterial, color: "neutral" as CompanionColor };
  if (typeof window === "undefined") return fallback;
  try {
    const v = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { material?: string; color?: string } | null;
    return {
      material: v?.material && v.material in MATERIALS ? (v.material as CompanionMaterial) : fallback.material,
      color: COLORS.some((c) => c.id === v?.color) ? (v!.color as CompanionColor) : fallback.color,
    };
  } catch {
    return fallback;
  }
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const DONE_HOLD = 2.4;
const SWEEP = 1.4;

type Live = {
  status: CompanionStatus;
  mood?: CompanionMood;
  talking?: boolean;
  slowAfter: number;
  followPointer: boolean;
  onPhaseChange?: (phase: CompanionPhase) => void;
  material: CompanionMaterial;
  color: CompanionColor;
};

/* ------------------------------------------------------------------ */

function mountCompanion(THREE: typeof Three, host: HTMLDivElement, live: { current: Live }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  /* ---------- Scene ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  const canvas = renderer.domElement;
  /* The canvas overflows the box (wider, and twice as tall upward) so bounces and spins are never clipped;
     the box itself is the body's footprint, feet on its bottom edge. */
  canvas.style.cssText =
    "position:absolute;left:-25%;bottom:0;width:150%;height:200%;display:block;pointer-events:none;opacity:0;transition:opacity 300ms cubic-bezier(0.22,1,0.36,1)";
  host.dataset.phase = "idle";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(29, 0.75, 0.1, 100);
  camera.position.set(0, 3.2, 9.6);
  camera.lookAt(0, 2.15, 0);

  /* Neutral studio for a satin (matte) chrome: grey waves, no colour, so the body only takes the background tint.
     Painted in an equirect canvas, seamless in x. */
  {
    const W = 1024, H = 512;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#ffffff");
    sky.addColorStop(0.38, "#e4e4e4");
    sky.addColorStop(0.5, "#5a5a5a");
    sky.addColorStop(0.6, "#9a9a9a");
    sky.addColorStop(1, "#d0d0d0");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    const bands: [string, number, number, number, number][] = [
      ["#2b2b2b", 34, 0.24, 2, 0.4], ["#ffffff", 40, 0.31, 3, 1.9], ["#6e6e6e", 36, 0.45, 2, 3.1],
      ["#ffffff", 18, 0.54, 4, 0.7], ["#3a3a3a", 34, 0.66, 1, 2.2], ["#f2f2f2", 30, 0.76, 3, 4.4], ["#ffffff", 14, 0.12, 2, 2.8],
    ];
    g.lineCap = "round";
    g.filter = "blur(10px)";
    for (const [col, w, yy, f, ph] of bands) {
      g.strokeStyle = col;
      g.lineWidth = w;
      g.beginPath();
      for (let x = -10; x <= W + 10; x += 4) {
        const t = (x / W) * Math.PI * 2;
        const y = yy * H + Math.sin(t * f + ph) * H * 0.07 + Math.sin(t * (f + 2) + ph * 1.7) * H * 0.03;
        if (x < 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = keep(pm.fromEquirectangular(tex)).texture;
    pm.dispose();
    tex.dispose();
  }
  /* Physical light units since r155: legacy intensities × π. */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d9d9, 0.55 * Math.PI));
  const key = new THREE.DirectionalLight(0xffffff, 0.9 * Math.PI);
  key.position.set(1.2, 7, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.radius = 6;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 20 });
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.35 * Math.PI);
  fill.position.set(-4, 2, 3);
  scene.add(fill);

  const floor = new THREE.Mesh(keep(new THREE.PlaneGeometry(30, 30)), keep(new THREE.ShadowMaterial({ opacity: 0.1 })));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------- Body: superellipsoid |x|⁴+|y|⁴+|z|⁴=1, exact normals: no edge anywhere in the reflections ---------- */
  const NP = 4;
  const bodyGeo = keep(new THREE.SphereGeometry(1, 128, 96));
  {
    const p = bodyGeo.attributes.position;
    const nr = bodyGeo.attributes.normal;
    const v = new THREE.Vector3();
    const q = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const s = Math.pow(Math.pow(Math.abs(v.x), NP) + Math.pow(Math.abs(v.y), NP) + Math.pow(Math.abs(v.z), NP), 1 / NP);
      v.divideScalar(s);
      p.setXYZ(i, v.x, v.y, v.z);
      q.set(
        Math.sign(v.x) * Math.pow(Math.abs(v.x), NP - 1),
        Math.sign(v.y) * Math.pow(Math.abs(v.y), NP - 1),
        Math.sign(v.z) * Math.pow(Math.abs(v.z), NP - 1),
      ).normalize();
      nr.setXYZ(i, q.x, q.y, q.z);
    }
  }
  bodyGeo.translate(0, 1, 0);
  /* Multicolour sweep: a rainbow band that travels up the body once when an answer is done. Added to every material. */
  const sweepU = { uSweep: { value: -10 }, uSweepAmt: { value: 0 }, uTime: { value: 0 } };
  const addSweep = (mat: Three.MeshPhysicalMaterial) => {
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, sweepU);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vBodyPos;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBodyPos = position;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vBodyPos;\nuniform float uSweep;\nuniform float uSweepAmt;\nuniform float uTime;")
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
        float band = smoothstep(0.85, 0.0, abs(vBodyPos.y - uSweep)) * uSweepAmt;
        float hue = fract(vBodyPos.y * 0.45 + vBodyPos.x * 0.25 - uTime * 0.6);
        vec3 rainbow = clamp(abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        diffuseColor.rgb = mix(diffuseColor.rgb, 0.25 + rainbow * 0.7, band * 0.9);`,
        );
    };
  };

  /* Fine horizontal strokes of brushed metal (bump + roughness), made once. */
  let brushTex: Three.CanvasTexture | null = null;
  const brushTexture = () => {
    if (brushTex) return brushTex;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#8a8a8a";
    g.fillRect(0, 0, 1024, 512);
    for (let y = 0; y < 512; y++) {
      const v = 100 + Math.random() * 90;
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(0, y, 1024, 1);
    }
    for (let k = 0; k < 900; k++) {
      const v = 70 + Math.random() * 150;
      g.fillStyle = `rgba(${v},${v},${v},.5)`;
      g.fillRect(Math.random() * 1024, Math.random() * 512, 80 + Math.random() * 500, 1);
    }
    brushTex = keep(new THREE.CanvasTexture(c));
    brushTex.wrapS = brushTex.wrapT = THREE.RepeatWrapping;
    return brushTex;
  };

  const makeMaterial = (id: CompanionMaterial) => {
    const spec = MATERIALS[id];
    const mat = new THREE.MeshPhysicalMaterial(spec.params as Three.MeshPhysicalMaterialParameters);
    if (spec.brushed) {
      const t = brushTexture();
      mat.bumpMap = t;
      mat.bumpScale = 0.004;
      mat.roughnessMap = t;
    }
    if (mat.sheen) mat.sheenColor.set(0xffffff);
    addSweep(mat);
    return mat;
  };

  let materialId: CompanionMaterial = live.current.material;
  let bodyMat = makeMaterial(materialId);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;

  /* Glass: a lit core inside the body (seen through the sides), and a backdrop in the page's colour that only
     the transmission pass sees (the canvas is transparent, so glass would otherwise refract black). */
  const coreMat = keep(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const core = new THREE.Mesh(keep(new THREE.SphereGeometry(0.62, 48, 32)), coreMat);
  core.position.y = 1;
  const backdropMat = keep(new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, depthWrite: false }));
  const backdrop = new THREE.Mesh(keep(new THREE.SphereGeometry(40, 16, 12)), backdropMat);
  backdrop.renderOrder = -1;
  backdrop.onBeforeRender = (r) => {
    backdropMat.colorWrite = r.getRenderTarget() !== null;
  };
  const applyGlass = () => {
    const glass = !!MATERIALS[materialId].core;
    core.visible = glass;
    backdrop.visible = glass;
  };
  scene.add(backdrop);
  applyGlass();

  /* Screen: face drawn crisp (ZH), shrunk to N×N with a halo, dithered (Bayer 4×4), scaled up as LEDs (P px per dot). */
  const ZH = 320, N = 80, P = 6;
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = faceCanvas.height = N * P;
  const fx = faceCanvas.getContext("2d")!;
  const sharp = document.createElement("canvas");
  sharp.width = sharp.height = ZH;
  const ex = sharp.getContext("2d")!;
  const small = document.createElement("canvas");
  small.width = small.height = N;
  const sx = small.getContext("2d", { willReadFrequently: true })!;
  const faceTex = keep(new THREE.CanvasTexture(faceCanvas));
  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.anisotropy = 4;
  const A = 0.66, RC = 0.24;
  const screenGeo = keep(new THREE.PlaneGeometry(2 * A, 2 * A, 40, 40));
  {
    const p = screenGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const z = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x), NP) - Math.pow(Math.abs(y), NP)), 1 / NP);
      p.setZ(i, z - 1 + 0.008);
    }
  }
  const screen = new THREE.Mesh(screenGeo, keep(new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, alphaTest: 0.5 })));
  screen.position.set(0, 1, 1.004);

  const spin = new THREE.Group();
  spin.add(body, core, screen);
  const root = new THREE.Group();
  root.add(spin);
  scene.add(root);

  /* ---------- State ---------- */
  const cur: Face = { ...BASE };
  const extra = { open: 0, smileBoost: 0, text: 0, gx: 0, gy: 0, turn: 0, squint: 0 };
  /* Token colours, read from CSS and refreshed twice a second (theme changes). Normalised through a 2D context. */
  const norm = document.createElement("canvas").getContext("2d")!;
  const palette = new Map<string, Three.Color>();
  const readToken = (name: string) => {
    const raw = getComputedStyle(host).getPropertyValue(name).trim();
    norm.fillStyle = "#000";
    if (raw) norm.fillStyle = raw;
    const c = palette.get(name) ?? new THREE.Color();
    c.set(norm.fillStyle as string);
    palette.set(name, c);
  };
  const white = new THREE.Color(1, 1, 1);
  const hsl = { h: 0, s: 0, l: 0 };
  const readPalette = () => {
    for (const t of [BODY_TOKEN, "--positive", "--brand", "--destructive", "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"]) readToken(t);
    // The colour actually behind the companion (first opaque ancestor), for the glass backdrop.
    let el: HTMLElement | null = host.parentElement;
    let bg = "";
    while (el) {
      const c = getComputedStyle(el).backgroundColor;
      if (c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c)) {
        bg = c;
        break;
      }
      el = el.parentElement;
    }
    norm.fillStyle = "#fff";
    if (bg) norm.fillStyle = bg;
    backdropMat.color.set(norm.fillStyle as string);
    // On a dark background the tint is near black and would melt into the screen: lift it a little.
    const body = palette.get(BODY_TOKEN)!;
    body.getHSL(hsl);
    if (hsl.l < 0.35) body.lerp(white, 0.28);
  };
  readPalette();
  let nextPalette = 0.5;
  const tint = palette.get(BODY_TOKEN)!.clone();
  const tintTarget = new THREE.Color();
  const fontFamily = getComputedStyle(host).fontFamily || "sans-serif";

  type Ev = { name: "bounce" | "spin" | "yawn" | "sigh"; t0: number; amp: number };
  const events: Ev[] = [];
  let clock = 0;
  let blinkT = -1, nextBlink = 1.5, nextSaccade = 1, nextFidget = 4;
  let gazeTarget = { x: 0, y: 0 };
  let pointer: { x: number; y: number } | null = null;
  let pointerUntil = 0;
  let bravoUntil = -1;
  let talkTimer = 0, openTarget = 0;
  let lastStatus: CompanionStatus | null = null;
  let statusSince = 0;
  let sweepT0 = -10;
  let phase: CompanionPhase = "idle";

  const play = (name: CompanionEvent) => {
    if (name === "blink") return void (blinkT = 0);
    if (name === "bravo") {
      bravoUntil = clock + 2.2;
      if (!reduced) events.push({ name: "bounce", t0: clock, amp: 1 });
      return;
    }
    if (reduced) return void (blinkT = 0);
    events.push({ name, t0: clock, amp: 1 });
  };

  const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const approach = (a: number, b: number, rate: number, dt: number) => a + (b - a) * (1 - Math.exp(-dt * rate));
  function bounce(u: number, amp: number) {
    if (u < 0.14) return { y: 0, sy: 1 - 0.14 * amp * Math.sin(((u / 0.14) * Math.PI) / 2), done: false };
    if (u < 0.64) {
      const p = (u - 0.14) / 0.5;
      return { y: 0.9 * amp * 4 * p * (1 - p), sy: 1 + 0.12 * amp * Math.abs(1 - 2 * p), done: false };
    }
    const q = (u - 0.64) / 0.5;
    return { y: 0, sy: 1 - 0.17 * amp * Math.exp(-q * 4) * Math.cos(q * 11), done: q > 1.2 };
  }
  function spinAt(u: number) {
    const p = Math.min(u / 1.15, 1);
    return { a: Math.PI * 2 * easeIO(p), y: 0.28 * Math.sin(Math.PI * p), done: p >= 1 };
  }
  /** Smooth 0 → 1 → 0 envelope over `len` seconds. */
  const hump = (u: number, len: number) => (u >= len ? 0 : Math.pow(Math.sin((u / len) * Math.PI), 2));

  /* ---------- Face ---------- */
  function drawFace(t: number) {
    const Z = ZH, m = cur, lw = Z * 0.036;
    ex.setTransform(1, 0, 0, 1, 0, 0);
    ex.clearRect(0, 0, Z, Z);
    ex.setTransform(1.44, 0, 0, 1.44, -Z * 0.22, -Z * 0.19);
    ex.lineCap = ex.lineJoin = "round";
    ex.strokeStyle = ex.fillStyle = "#fff";
    ex.lineWidth = lw;
    const blink = blinkT < 0 ? 0 : Math.sin(Math.min(blinkT / 0.17, 1) * Math.PI);
    const boost = extra.smileBoost;
    const smile = Math.min(1, m.smile + boost);
    const arrow = m.arrow * (1 - boost);
    const closed = Math.min(1, Math.max(m.closed * (1 - boost), extra.squint));
    const pillA = Math.max(0, 1 - arrow - closed);
    const cy = Z * 0.42 + extra.gy * Z * 0.05;
    const gx = extra.gx * Z * 0.07;
    const barW = lw * 1.2;
    for (const side of [-1, 1]) {
      const w = m.w * Z;
      const h = Math.max(barW, m.h * Z * 1.5 * (1 - blink * 0.92));
      const cx = Z / 2 + side * m.sep * Z + gx;
      const lid = Math.min(0.95, Math.max(0, (m.lid + m.skew * side) * (1 - boost)));
      const strokeA = pillA * (1 - smile);
      ex.save();
      ex.translate(cx, cy);
      ex.rotate(m.tilt * -side);
      // Thin vertical stroke; the lid cuts its top.
      if (strokeA > 0.01) {
        const top = -h / 2 + h * lid;
        ex.globalAlpha = strokeA;
        ex.beginPath();
        ex.roundRect(-barW / 2, top, barW, Math.max(barW, h / 2 - top), barW / 2);
        ex.fill();
      }
      // ∩ arcs (pleased, confident, laughing).
      if (smile * pillA > 0.01) {
        ex.globalAlpha = smile * pillA;
        ex.beginPath();
        ex.arc(0, w * 0.35, w * 0.55, Math.PI * 1.08, Math.PI * 1.92);
        ex.stroke();
      }
      if (arrow > 0.01) {
        ex.globalAlpha = arrow;
        const aw = w * 0.8, ah = m.h * Z * 0.8;
        ex.beginPath();
        ex.moveTo((side * aw) / 2, -ah / 2);
        ex.lineTo((-side * aw) / 2, 0);
        ex.lineTo((side * aw) / 2, ah / 2);
        ex.stroke();
      }
      if (closed > 0.01) {
        ex.globalAlpha = closed;
        const cw = w * 1.1;
        ex.beginPath();
        ex.moveTo(-cw / 2, 0);
        ex.quadraticCurveTo(0, m.ccurve * cw * 1.1, cw / 2, 0);
        ex.stroke();
      }
      ex.restore();
      // Brow: a flat bar sitting on the lid line (T), raised, tilted or lifted on one side.
      const browA = m.brow * (1 - smile) * (1 - boost);
      if (browA > 0.01) {
        const top = closed > 0.5 ? -lw * 2.5 : -h / 2 + h * lid;
        const by = cy + top - lw * 0.9 - (m.browY + m.browSkew * side) * Z;
        const bw = w * 1.15;
        ex.save();
        ex.translate(cx - side * w * 0.12, by);
        ex.rotate(m.browTilt * -side);
        ex.globalAlpha = browA;
        ex.beginPath();
        ex.moveTo(-bw / 2, 0);
        ex.lineTo(bw / 2, 0);
        ex.stroke();
        ex.restore();
      }
      ex.globalAlpha = 1;
    }
    // Cheeks: low intensity, so the dither turns them into dots.
    if (m.blush + boost * 0.3 > 0.01) {
      ex.globalAlpha = Math.min(1, m.blush + boost * 0.3) * 0.42;
      for (const side of [-1, 1]) {
        ex.beginPath();
        ex.ellipse(Z / 2 + side * (m.sep + 0.09) * Z + gx, cy + Z * 0.12, Z * 0.065, Z * 0.035, 0, 0, Math.PI * 2);
        ex.fill();
      }
      ex.globalAlpha = 1;
    }
    // Mouth: a curve that opens into a D; smirk lifts the right corner.
    const mx = Z / 2 + extra.gx * Z * 0.05, my = Z * 0.62 + extra.gy * Z * 0.03;
    const mw = (m.mw + boost * 0.06 + extra.open * 0.04) * Z, curve = (m.curve + boost * 0.02) * Z * 2;
    const open = (m.open * (1 - boost * 0.6) + extra.open * 0.13) * Z * 2.2;
    const sk = m.smirk * (1 - boost) * Z;
    const lx = mx - mw / 2, rx = mx + mw / 2, ly = my + sk * 0.4, ry = my - sk, cxm = mx + sk * 1.5;
    if (open > 1) {
      ex.beginPath();
      ex.moveTo(lx, ly);
      ex.quadraticCurveTo(cxm, my + curve * 0.5, rx, ry);
      ex.quadraticCurveTo(cxm, my + curve * 0.5 + open, lx, ly);
      ex.fill();
    }
    ex.beginPath();
    ex.moveTo(lx, ly);
    ex.quadraticCurveTo(cxm, my + (open > 1 ? curve * 0.5 : curve), rx, ry);
    ex.stroke();
    // zZ
    if (m.zz > 0.01) {
      for (let i = 0; i < 3; i++) {
        const p = (t * 0.35 + i / 3) % 1;
        ex.globalAlpha = m.zz * Math.sin(p * Math.PI);
        ex.font = `800 ${Z * (0.09 + i * 0.035)}px ${fontFamily}`;
        ex.fillText(i === 2 ? "Z" : "z", Z * 0.6 + p * Z * 0.08 + i * Z * 0.03, Z * 0.26 - p * Z * 0.1);
      }
      ex.globalAlpha = 1;
    }
    // Thought dots, popping in turn above the eyes.
    if (m.dots > 0.01) {
      for (let i = 0; i < 3; i++) {
        const p = (t * 1.3 - i * 0.28) % 1.4;
        const a = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
        ex.globalAlpha = m.dots * (0.25 + a * 0.75);
        ex.beginPath();
        ex.arc(Z * (0.6 + i * 0.07), Z * (0.27 - i * 0.035) - a * Z * 0.012, Z * (0.018 + i * 0.006), 0, Math.PI * 2);
        ex.fill();
      }
      ex.globalAlpha = 1;
    }
    if (extra.text > 0.01) {
      ex.globalAlpha = extra.text;
      ex.textAlign = "center";
      ex.font = `800 ${Z * 0.14}px ${fontFamily}`;
      ex.fillText("DONE", Z / 2, Z * 0.78);
      ex.textAlign = "start";
      ex.globalAlpha = 1;
    }

    sx.shadowBlur = 0;
    sx.fillStyle = "#000";
    sx.fillRect(0, 0, N, N);
    sx.shadowColor = "rgba(255,255,255,.55)";
    sx.shadowBlur = 3;
    sx.drawImage(sharp, 0, 0, N, N);
    sx.shadowBlur = 0;
    sx.drawImage(sharp, 0, 0, N, N);
    const d = sx.getImageData(0, 0, N, N).data;
    const W = N * P, rc = (RC / (2 * A)) * W;
    fx.clearRect(0, 0, W, W);
    fx.save();
    fx.beginPath();
    fx.roundRect(0, 0, W, W, rc);
    fx.clip();
    fx.fillStyle = "#030304";
    fx.fillRect(0, 0, W, W);
    const on = new Path2D(), off = new Path2D();
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const L = d[(y * N + x) * 4] / 255, th = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
        (L > th ? on : off).rect(x * P, y * P, P - 1, P - 1);
      }
    fx.fillStyle = "#16171A";
    fx.fill(off);
    fx.fillStyle = "#F4F2EA";
    fx.fill(on);
    fx.restore();
    faceTex.needsUpdate = true;
  }

  /* ---------- Loop ---------- */
  let raf = 0;
  let visible = true;
  let shown = false;
  let last = performance.now();

  function frame(now: number) {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    clock += dt;
    const L = live.current;

    // Status → phase (thinking turns into slow, then stalled; done falls back to idle).
    if (L.status !== lastStatus) {
      lastStatus = L.status;
      statusSince = now / 1000;
      if (L.status === "done") {
        sweepT0 = clock;
        play("bravo");
      }
    }
    // Wall-clock time: the animation clock is capped per frame and would run slow on a slow device.
    const elapsed = now / 1000 - statusSince;
    let next: CompanionPhase = L.status;
    if (L.status === "thinking" && elapsed > L.slowAfter) next = elapsed > L.slowAfter * 2.2 ? "stalled" : "slow";
    if (L.status === "done" && elapsed > DONE_HOLD) next = "idle";
    if (next !== phase) {
      if (next === "stalled" && !reduced) events.push({ name: "yawn", t0: clock + 0.3, amp: 1 });
      phase = next;
      host.dataset.phase = phase;
      host.setAttribute("aria-label", `AI companion, ${PHASE_LABEL[phase]}`);
      L.onPhaseChange?.(phase);
    }

    const moodId = L.mood ?? PHASE_MOOD[phase];
    const mood = MOODS[moodId];
    for (const k of KEYS) cur[k] = approach(cur[k], mood.face[k], 6, dt);

    // Blinks
    if (blinkT >= 0) {
      blinkT += dt;
      if (blinkT > 0.17) blinkT = -1;
    } else if ((nextBlink -= dt) <= 0) {
      blinkT = 0;
      nextBlink = moodId === "sleepy" || moodId === "lazy" ? 4 + Math.random() * 4 : 1.8 + Math.random() * 3.5;
    }

    // Gaze: pointer (when the mood follows it), otherwise the mood's own target or random glances.
    const follow = mood.gaze === "follow" && L.followPointer && pointer && clock < pointerUntil;
    if (follow && pointer) gazeTarget = pointer;
    else if ((nextSaccade -= dt) <= 0) {
      const g = mood.gaze;
      if (typeof g === "object") {
        gazeTarget = { x: g.x + (Math.random() - 0.5) * g.jitter, y: g.y + (Math.random() - 0.5) * g.jitter };
        nextSaccade = 1.5 + Math.random() * 2.5;
      } else if (g === "drift") {
        gazeTarget = { x: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5), y: 0.1 + Math.random() * 0.5 };
        nextSaccade = 3 + Math.random() * 3;
      } else if (phase === "listening") {
        gazeTarget = { x: (Math.random() - 0.5) * 0.6, y: 0.75 };
        nextSaccade = 1.2 + Math.random() * 2;
      } else {
        const side = moodId === "impatient" ? (Math.random() < 0.7 ? 0.8 : -0.8) : 0;
        gazeTarget = { x: side + (Math.random() - 0.5) * (side ? 0.4 : 1.4), y: (Math.random() - 0.5) * 0.8 };
        nextSaccade = 0.8 + Math.random() * 2.4;
      }
      if (reduced) nextSaccade = Math.max(nextSaccade, 3);
    }
    const gazeRate = reduced ? 4 : mood.gaze === "drift" || moodId === "lazy" ? 3 : 14;
    extra.gx = approach(extra.gx, gazeTarget.x, gazeRate, dt);
    extra.gy = approach(extra.gy, gazeTarget.y, gazeRate, dt);

    // Fidgets: bored sighs, lazy yawns, excited hops.
    if (!reduced && (nextFidget -= dt) <= 0) {
      if (moodId === "bored") events.push({ name: "sigh", t0: clock, amp: 1 });
      else if (moodId === "lazy") events.push({ name: "yawn", t0: clock, amp: 1 });
      else if (moodId === "excited") events.push({ name: "bounce", t0: clock, amp: 0.45 });
      nextFidget = moodId === "excited" ? 2.6 + Math.random() * 2 : 5 + Math.random() * 4;
    }

    // Talking: random syllables.
    const talking = L.talking ?? phase === "responding";
    if (talking) {
      if ((talkTimer -= dt) <= 0) {
        openTarget = Math.random() < 0.2 ? 0 : 0.25 + Math.random() * 0.75;
        talkTimer = 0.07 + Math.random() * 0.1;
      }
    } else openTarget = 0;

    // Body
    let y = 0, sy = 1 - cur.slump, spinA = 0, leanAdd = 0, yawnOpen = 0, squint = 0;
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      const u = clock - e.t0;
      if (u < 0) continue;
      if (e.name === "bounce") {
        const r = bounce(u, e.amp);
        y += r.y;
        sy *= r.sy;
        if (r.done) events.splice(i, 1);
      } else if (e.name === "spin") {
        const r = spinAt(u);
        y += r.y;
        spinA += r.a;
        if (r.done) events.splice(i, 1);
      } else if (e.name === "yawn") {
        const k = hump(u, 2.4);
        yawnOpen = Math.max(yawnOpen, k * 1.3);
        squint = Math.max(squint, k);
        sy *= 1 + 0.05 * k;
        leanAdd -= 0.12 * k;
        if (u > 2.4) events.splice(i, 1);
      } else {
        const k = hump(u, 1.8);
        yawnOpen = Math.max(yawnOpen, k * 0.3);
        sy *= 1 - 0.035 * k;
        leanAdd -= 0.06 * k;
        if (u > 1.8) events.splice(i, 1);
      }
    }
    extra.open = approach(extra.open, Math.max(openTarget, yawnOpen), yawnOpen > 0 ? 8 : 22, dt);
    extra.squint = approach(extra.squint, squint, 8, dt);
    const bravo = clock < bravoUntil ? 1 : 0;
    extra.smileBoost = approach(extra.smileBoost, bravo, 9, dt);
    extra.text = approach(extra.text, bravo, 9, dt);

    const breathe = reduced ? 0 : Math.sin(clock * cur.breath * 2) * 0.012;
    sy *= 1 + breathe + extra.open * 0.015;
    root.position.y = y;
    root.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
    extra.turn = approach(extra.turn, reduced ? 0 : extra.gx * 0.18, 5, dt);
    spin.rotation.y = extra.turn + spinA; // facing front; turns a little with the gaze
    spin.rotation.x = reduced ? 0 : cur.lean + leanAdd + extra.gy * 0.04;
    spin.rotation.z =
      moodId === "impatient" && !reduced ? Math.pow(Math.max(0, Math.sin(clock * 1.1)), 6) * Math.sin(clock * 22) * 0.025 : 0;

    // Body tint and the one-shot multicolour sweep.
    if ((nextPalette -= dt) <= 0) {
      readPalette();
      nextPalette = 0.5;
    }
    // Material swap (picker): new material, a little hop.
    if (L.material !== materialId) {
      materialId = L.material;
      bodyMat.dispose();
      bodyMat = makeMaterial(materialId);
      body.material = bodyMat;
      applyGlass();
      if (!reduced) events.push({ name: "bounce", t0: clock, amp: 0.35 });
    }
    const spec = MATERIALS[materialId];
    const [token, mix] = TINT[phase];
    if (spec.fixed) tintTarget.set(spec.fixed);
    else tintTarget.copy(palette.get(L.color === "neutral" ? BODY_TOKEN : `--${L.color}`)!);
    if (token) tintTarget.lerp(palette.get(token)!, mix * (spec.fixed ? 0.6 : 1));
    tint.lerp(tintTarget, 1 - Math.exp(-dt * 3));
    bodyMat.color.copy(tint);
    if (bodyMat.transmission) {
      // Glass: tinted in the mass, lighter surface; the core glows in the same colour.
      bodyMat.attenuationColor.copy(tint);
      bodyMat.color.lerp(white, spec.deep ? 0.2 : 0.55);
      coreMat.color.copy(tint).lerp(white, 0.35);
    }
    const su = (clock - sweepT0) / SWEEP;
    if (su >= 0 && su <= 1.15) {
      sweepU.uSweep.value = -0.9 + su * 3.8;
      sweepU.uSweepAmt.value = reduced ? 0.6 * Math.sin(Math.min(su, 1) * Math.PI) : 1;
      if (reduced) sweepU.uSweep.value = 1;
    } else sweepU.uSweepAmt.value = 0;
    sweepU.uTime.value = clock;

    drawFace(clock);
    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
    }
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const start = () => {
    if (raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
  });
  io.observe(host);
  const onVisibility = () => start();
  document.addEventListener("visibilitychange", onVisibility);

  // Eyes follow the pointer anywhere on the page, mapped around the companion.
  const onPointer = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const span = Math.max(r.width, 240) * 1.6;
    pointer = {
      x: Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / span * 2)),
      y: Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.72)) / span * 2)),
    };
    pointerUntil = clock + 2.5;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  start();

  return {
    play,
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      bodyMat.dispose();
      for (const d of disposables) d.dispose();
      scene.environment = null;
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

/* ------------------------------------------------------------------ */

function Companion({
  status = "idle",
  mood,
  talking,
  slowAfter = 4,
  size = 96,
  followPointer = true,
  onPhaseChange,
  customizable = true,
  material: materialProp,
  onMaterialChange,
  color: colorProp,
  onColorChange,
  controlRef,
  className,
  style,
  onClick,
  onKeyDown,
  ...props
}: CompanionProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const api = React.useRef<{ play: (e: CompanionEvent) => void } | null>(null);
  const [stored, setStored] = React.useState(readStoredAppearance);
  const [open, setOpen] = React.useState(false);
  const material = materialProp ?? stored.material;
  const color = colorProp ?? stored.color;
  const live = React.useRef<Live>({ status, mood, talking, slowAfter, followPointer, onPhaseChange, material, color });

  React.useEffect(() => {
    live.current = { status, mood, talking, slowAfter, followPointer, onPhaseChange, material, color };
  });

  const choose = (next: { material?: CompanionMaterial; color?: CompanionColor }) => {
    const value = { material: next.material ?? material, color: next.color ?? color };
    setStored(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
    if (next.material) onMaterialChange?.(next.material);
    if (next.color) onColorChange?.(next.color);
  };

  React.useImperativeHandle(controlRef, () => ({ play: (e) => api.current?.play(e) }), []);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let instance: ReturnType<typeof mountCompanion> | null = null;
    import("three").then((THREE) => {
      if (cancelled) return;
      instance = mountCompanion(THREE, host, live);
      api.current = instance;
    });
    return () => {
      cancelled = true;
      instance?.dispose();
      api.current = null;
    };
  }, []);

  const activate = () => {
    api.current?.play("spin");
    setOpen((o) => !o);
  };

  const node = (
    <div
      ref={hostRef}
      role={customizable ? "button" : "img"}
      tabIndex={customizable ? 0 : undefined}
      aria-label="AI companion"
      aria-haspopup={customizable ? "dialog" : undefined}
      aria-expanded={customizable ? open : undefined}
      data-slot="companion"
      onClick={(e) => {
        onClick?.(e);
        if (customizable && !e.defaultPrevented) activate();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (customizable && !e.defaultPrevented && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          activate();
        }
      }}
      className={cn(
        "relative shrink-0 select-none",
        customizable && "pointer-events-auto cursor-pointer rounded-surface outline-none focus-visible:shadow-focus",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );

  if (!customizable) return node;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>{node}</PopoverAnchor>
      <PopoverContent side="bottom" align="start" className="flex w-64 flex-col gap-4" aria-label="Companion appearance">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Colour</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Colour">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={color === c.id}
                aria-label={c.label}
                title={c.label}
                onClick={() => choose({ color: c.id })}
                className="size-7 rounded-full border outline-none ring-offset-2 ring-offset-surface transition-[box-shadow] focus-visible:shadow-focus aria-checked:ring-2 aria-checked:ring-foreground"
                style={{ background: c.id === "neutral" ? "var(--background-muted)" : `var(--${c.id})` }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Material</span>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Material">
            {(Object.keys(MATERIALS) as CompanionMaterial[]).map((m) => (
              <Button
                key={m}
                type="button"
                role="radio"
                aria-checked={material === m}
                size="xs"
                variant={material === m ? "default" : "outline"}
                onClick={() => choose({ material: m })}
              >
                {MATERIALS[m].label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ *
 * Layer + anchors: ONE companion that glides between places.
 * Put <CompanionAnchor /> where it should stand (centre of an empty
 * chat, top of the message being written); the most recently mounted
 * anchor wins. The companion is never remounted, it moves.
 * ------------------------------------------------------------------ */

type AnchorEntry = { el: HTMLElement; size: number };
const LayerContext = React.createContext<((a: AnchorEntry) => () => void) | null>(null);

export interface CompanionLayerProps extends React.ComponentProps<"div"> {
  /** Props of the single Companion (status, mood, onPhaseChange…). Its size comes from the active anchor. */
  companion?: Omit<CompanionProps, "size">;
}

function CompanionLayer({ companion, className, children, ...props }: CompanionLayerProps) {
  const layerRef = React.useRef<HTMLDivElement>(null);
  const anchors = React.useRef<AnchorEntry[]>([]);
  const [anchor, setAnchor] = React.useState<AnchorEntry | null>(null);
  const [box, setBox] = React.useState<{ x: number; y: number; size: number } | null>(null);

  const register = React.useCallback((a: AnchorEntry) => {
    anchors.current.push(a);
    setAnchor(a);
    return () => {
      anchors.current = anchors.current.filter((x) => x !== a);
      setAnchor(anchors.current.at(-1) ?? null);
    };
  }, []);

  React.useEffect(() => {
    const layer = layerRef.current;
    if (!anchor || !layer) return;
    const update = () => {
      const l = layer.getBoundingClientRect();
      const r = anchor.el.getBoundingClientRect();
      setBox({ x: r.left - l.left, y: r.top - l.top, size: anchor.size });
    };
    // Fires once on observe, then whenever the layout around the anchor changes (new messages, streaming text).
    const ro = new ResizeObserver(update);
    ro.observe(layer);
    ro.observe(anchor.el);
    return () => ro.disconnect();
  }, [anchor]);

  return (
    <div ref={layerRef} data-slot="companion-layer" className={cn("relative", className)} {...props}>
      <LayerContext.Provider value={register}>{children}</LayerContext.Provider>
      {box ? (
        <div
          aria-hidden={!anchor}
          className={cn(
            "pointer-events-none absolute top-0 left-0 z-10 transition-[translate,width,height,opacity] duration-500 ease-(--motion-open-ease) motion-reduce:transition-none",
            !anchor && "opacity-0",
          )}
          style={{ translate: `${box.x}px ${box.y}px`, width: box.size, height: box.size }}
        >
          <Companion {...companion} size={box.size} style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}
    </div>
  );
}

/** Where the companion stands: reserves `size`×`size` px; the companion's feet sit on its bottom edge. */
function CompanionAnchor({ size = 72, className, style, ...props }: React.ComponentProps<"div"> & { size?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const register = React.useContext(LayerContext);
  React.useEffect(() => {
    if (!register || !ref.current) return;
    return register({ el: ref.current, size });
  }, [register, size]);
  return <div ref={ref} aria-hidden data-slot="companion-anchor" className={cn("shrink-0", className)} style={{ width: size, height: size, ...style }} {...props} />;
}

/** Every material and colour, in picker order. */
const companionMaterials = Object.keys(MATERIALS) as CompanionMaterial[];
const companionColors = COLORS.map((c) => c.id);

/** Every expression, in display order. */
const companionMoods = Object.keys(MOODS) as CompanionMood[];

export { Companion, CompanionAnchor, CompanionLayer, companionColors, companionMaterials, companionMoods };
