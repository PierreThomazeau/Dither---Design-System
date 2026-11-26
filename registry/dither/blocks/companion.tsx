"use client";

import * as React from "react";
import type * as Three from "three";

import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * Companion: the 3D AI buddy that sits above the prompt.
 * A chrome "squircle" body (superellipsoid) with a square LED screen;
 * the face is drawn crisp, shrunk to 80×80 dots and dithered in 1 bit
 * (Bayer 4×4), so it speaks the same dither language as the rest of
 * the system. Every expression is a set of numbers that glide toward
 * the requested mood, so changes are always smooth.
 *
 * Driven by `status` (what the AI is doing) and optionally `mood`:
 *  - thinking   → looks up, thought dots, indigo chrome
 *  - long wait  → bored, then lazy (yawns), chrome turns red
 *  - responding → talks, sky chrome
 *  - done       → one multicolour sweep through the chrome + "Done"
 *  - error      → sad, orange chrome
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
  /** Imperative events: bounce, spin, bravo, blink, yawn. */
  controlRef?: React.Ref<CompanionHandle>;
}

/* ---------- Expressions: all numbers ---------- *
 * Eyes: w, h size · sep spacing · tilt (+ sad slant) · lid top lid · skew lid difference L/R ·
 *   smile ^ eyes · arrow > < · closed line, ccurve its curve.
 * Mouth: curve smile (+) / pout (−) · smirk one corner up · open D mouth · mw width.
 * blush cheeks · zz "zZ" · dots thought dots · lean forward (+) / back (−) · slump sag · breath speed. */
const KEYS = [
  "w", "h", "sep", "tilt", "lid", "skew", "smile", "arrow", "closed", "ccurve",
  "curve", "smirk", "open", "mw", "blush", "zz", "dots", "lean", "slump", "breath",
] as const;
type Key = (typeof KEYS)[number];
type Face = Record<Key, number>;

const BASE: Face = {
  w: 0.1, h: 0.12, sep: 0.2, tilt: 0, lid: 0, skew: 0, smile: 0, arrow: 0, closed: 0, ccurve: 0,
  curve: 0.045, smirk: 0, open: 0, mw: 0.1, blush: 0.3, zz: 0, dots: 0, lean: 0, slump: 0, breath: 1.6,
};
const face = (p: Partial<Face>): Face => ({ ...BASE, ...p });

type Gaze = "follow" | "drift" | { x: number; y: number; jitter: number };

const MOODS: Record<CompanionMood, { face: Face; gaze: Gaze }> = {
  happy: { face: BASE, gaze: "follow" },
  proud: { face: face({ w: 0.13, h: 0.17, smile: 0.8, curve: 0.05, open: 0.1, mw: 0.16, blush: 0.7, lean: -0.06 }), gaze: "follow" },
  excited: { face: face({ w: 0.12, h: 0.15, arrow: 1, curve: 0.06, open: 0.14, mw: 0.2, blush: 0.4, lean: 0.04, breath: 2.6 }), gaze: "follow" },
  impatient: { face: face({ w: 0.13, h: 0.13, sep: 0.19, tilt: -0.05, lid: 0.5, curve: -0.012, mw: 0.09, blush: 0, breath: 2 }), gaze: "follow" },
  sleepy: { face: face({ w: 0.13, closed: 1, curve: 0, open: 0.05, mw: 0.05, blush: 0.25, zz: 1, lean: 0.07, breath: 0.8 }), gaze: { x: 0, y: 0.3, jitter: 0 } },
  resting: { face: face({ w: 0.13, closed: 1, ccurve: 0.5, curve: 0.04, blush: 0.45, lean: 0.02, breath: 1 }), gaze: { x: 0, y: 0.2, jitter: 0 } },
  /* Fed up: heavy lids, flat drooping mouth, leaning back, slow breath, eyes wandering off. */
  bored: { face: face({ w: 0.13, tilt: 0.05, lid: 0.58, curve: -0.012, mw: 0.085, blush: 0, lean: -0.07, slump: 0.02, breath: 0.7 }), gaze: "drift" },
  /* Looking down its nose: one lid low, one corner up, eyes to the side, head back. */
  disdainful: { face: face({ w: 0.13, tilt: -0.04, lid: 0.42, skew: 0.3, curve: 0, smirk: 0.035, mw: 0.09, blush: 0, lean: -0.1, breath: 1.1 }), gaze: { x: 0.85, y: 0.15, jitter: 0.15 } },
  /* Can't be bothered: lids almost shut, slumped forward, yawns now and then. */
  lazy: { face: face({ w: 0.13, lid: 0.7, curve: -0.004, mw: 0.07, blush: 0.1, lean: 0.1, slump: 0.06, breath: 0.55 }), gaze: { x: -0.1, y: 0.4, jitter: 0.2 } },
  thinking: { face: face({ w: 0.11, h: 0.14, lid: 0.1, curve: -0.006, mw: 0.055, blush: 0.15, dots: 1, lean: -0.04, breath: 1.3 }), gaze: { x: -0.55, y: -0.9, jitter: 0.12 } },
  sad: { face: face({ w: 0.12, h: 0.13, tilt: 0.16, lid: 0.25, curve: -0.035, mw: 0.09, blush: 0, lean: 0.06, slump: 0.03, breath: 0.9 }), gaze: { x: 0, y: 0.5, jitter: 0.25 } },
};

/* Chrome tint per phase. "chrome" = the neutral polished metal. */
const TINT: Record<CompanionPhase, string> = {
  idle: "#E9EAEE",
  listening: "#B6E2C4",
  thinking: "#BBB4F4",
  slow: "#F08A80",
  stalled: "#E3544A",
  responding: "#A9D2E6",
  done: "#E9EAEE",
  error: "#F4A646",
};

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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
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

  /* Liquid chrome studio: wavy bands painted in an equirect canvas (seamless in x), prefiltered by PMREM. */
  {
    const W = 1024, H = 512;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#ffffff");
    sky.addColorStop(0.35, "#d9e0ea");
    sky.addColorStop(0.5, "#3d4a5f");
    sky.addColorStop(0.58, "#5d6f88");
    sky.addColorStop(1, "#c4ccd8");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    const bands: [string, number, number, number, number][] = [
      ["#0a0f1a", 30, 0.22, 2, 0.4], ["#ffffff", 35, 0.3, 3, 1.9], ["#2f4462", 35, 0.44, 2, 3.1], ["#ffffff", 15, 0.52, 4, 0.7],
      ["#0d1422", 35, 0.64, 1, 2.2], ["#e9eef5", 30, 0.74, 3, 4.4], ["#3c5578", 25, 0.84, 2, 5.3], ["#ffffff", 13, 0.12, 2, 2.8],
      ["#101826", 20, 0.06, 3, 0.2], ["#ffffff", 17, 0.92, 1, 1.2],
    ];
    g.lineCap = "round";
    g.filter = "blur(5px)";
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
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8cfc4, 0.6 * Math.PI));
  const key = new THREE.DirectionalLight(0xffffff, 1.1 * Math.PI);
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
  const bodyMat = keep(
    new THREE.MeshPhysicalMaterial({ color: TINT.idle, metalness: 1, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.25 }),
  );
  /* Multicolour sweep: a rainbow band that travels up the body once when an answer is done. */
  const sweepU = { uSweep: { value: -10 }, uSweepAmt: { value: 0 }, uTime: { value: 0 } };
  bodyMat.onBeforeCompile = (shader) => {
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
        diffuseColor.rgb = mix(diffuseColor.rgb, 0.18 + rainbow * 0.82, band);`,
      );
  };
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;

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
  spin.add(body, screen);
  const root = new THREE.Group();
  root.add(spin);
  scene.add(root);

  /* ---------- State ---------- */
  const cur: Face = { ...BASE };
  const extra = { open: 0, smileBoost: 0, text: 0, gx: 0, gy: 0, turn: 0, squint: 0 };
  const tint = new THREE.Color(TINT.idle);
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
    ex.setTransform(1.3, 0, 0, 1.3, -Z * 0.15, -Z * 0.13);
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
    for (const side of [-1, 1]) {
      const w = m.w * Z, h = Math.max(w * 0.3, m.h * Z * (1 - blink * 0.85));
      const cx = Z / 2 + side * m.sep * Z + gx;
      const lid = Math.min(0.95, Math.max(0, (m.lid + m.skew * side) * (1 - boost)));
      ex.save();
      ex.translate(cx, cy);
      ex.rotate(m.tilt * -side);
      if (pillA > 0.01) {
        ex.globalAlpha = pillA;
        ex.beginPath();
        ex.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) / 2);
        ex.fill();
        ex.globalAlpha = 1;
        ex.globalCompositeOperation = "destination-out";
        if (lid > 0.001) ex.fillRect(-w, -h / 2 - 2, w * 2, h * lid + 2);
        if (smile > 0.001) {
          const r = w * 1.1;
          ex.beginPath();
          ex.arc(0, h / 2 + r - smile * h * 0.8, r, 0, Math.PI * 2);
          ex.fill();
        }
        ex.globalCompositeOperation = "source-over";
      }
      if (arrow > 0.01) {
        ex.globalAlpha = arrow;
        const aw = w * 0.9, ah = m.h * Z * 0.9;
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
      ex.globalAlpha = 1;
      ex.restore();
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
      ex.fillText("DONE", Z / 2, Z * 0.83);
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
      statusSince = clock;
      if (L.status === "done") {
        sweepT0 = clock;
        play("bravo");
      }
    }
    const elapsed = clock - statusSince;
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
    extra.turn = approach(extra.turn, reduced ? 0 : extra.gx * 0.32, 5, dt);
    spin.rotation.y = -0.28 + extra.turn + spinA;
    spin.rotation.x = reduced ? 0 : cur.lean + leanAdd + extra.gy * 0.04;
    spin.rotation.z =
      moodId === "impatient" && !reduced ? Math.pow(Math.max(0, Math.sin(clock * 1.1)), 6) * Math.sin(clock * 22) * 0.025 : 0;

    // Chrome tint and the one-shot multicolour sweep.
    tintTarget.set(TINT[phase]);
    tint.lerp(tintTarget, 1 - Math.exp(-dt * 3));
    bodyMat.color.copy(tint);
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
  controlRef,
  className,
  style,
  ...props
}: CompanionProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const live = React.useRef<Live>({ status, mood, talking, slowAfter, followPointer, onPhaseChange });
  const api = React.useRef<{ play: (e: CompanionEvent) => void } | null>(null);

  React.useEffect(() => {
    live.current = { status, mood, talking, slowAfter, followPointer, onPhaseChange };
  });

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

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="AI companion"
      data-slot="companion"
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}

/** Every expression, in display order. */
const companionMoods = Object.keys(MOODS) as CompanionMood[];

export { Companion, companionMoods };
