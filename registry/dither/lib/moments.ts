/* ------------------------------------------------------------------ *
 * Moments: the product events every surface reacts to the same way.
 *
 *   emitMoment("success")   → toast, sweep, companion "bravo", chime
 *   emitMoment("upload")    → same signature, rising notes
 *   emitMoment("delete")    → disintegration, companion shrug, soft blip
 *   emitMoment("undo")      → reverse, companion relieved
 *   emitMoment("error")     → short pulse, companion sad, low buzz
 *
 * One bus (a window CustomEvent), so a toast, a button, the companion
 * and anything else can listen without knowing each other.
 * Sound is OFF by default; haptics (vibration, mobile) are on; both are
 * viewer preferences. Motion intensity: calm / normal / expressive
 * (`data-motion` on <html>), and "reduced" when the OS asks for it.
 * ------------------------------------------------------------------ */

export type MomentName = "success" | "upload" | "delete" | "undo" | "error";

export type MomentDetail = { name: MomentName; label?: string; at: number };

export type MotionIntensity = "reduced" | "calm" | "normal" | "expressive";

export type MomentPrefs = { sound: boolean; haptics: boolean; motion: Exclude<MotionIntensity, "reduced">; density: "comfortable" | "compact" };

const EVENT = "dither:moment";
const PREFS_KEY = "dither-moments";
const DEFAULT_PREFS: MomentPrefs = { sound: false, haptics: true, motion: "normal", density: "comfortable" };

/** The success signature: the chart colours, in order. Sweeps, toasts and the companion share it. */
export const SIGNATURE_STOPS = ["--chart-1", "--chart-3", "--chart-4", "--positive", "--chart-2"] as const;

export function getMomentPrefs(): MomentPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    return { ...DEFAULT_PREFS, ...(JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? "{}") as Partial<MomentPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setMomentPrefs(patch: Partial<MomentPrefs>) {
  const next = { ...getMomentPrefs(), ...patch };
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: lasts for this page */
  }
  applyMotionAttribute(next.motion, next.density);
  window.dispatchEvent(new CustomEvent("dither:moment-prefs", { detail: next }));
  return next;
}

/** Puts the viewer's motion intensity and density on <html data-motion / data-density>. Call once on load (MomentPrefsInit does). */
export function applyMotionAttribute(motion = getMomentPrefs().motion, density = getMomentPrefs().density) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.motion = motion;
  document.documentElement.dataset.density = density;
}

export function motionIntensity(): MotionIntensity {
  if (typeof window === "undefined") return "normal";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  const m = document.documentElement.dataset.motion as MotionIntensity | undefined;
  return m === "calm" || m === "expressive" ? m : "normal";
}

/** Duration / amplitude factor for moment animations (0 = no motion). */
export function motionFactor(): number {
  return { reduced: 0, calm: 0.7, normal: 1, expressive: 1.35 }[motionIntensity()];
}

let last: MomentDetail | null = null;

/** The latest moment (for listeners that mount because of it, like CompanionPresence). */
export function getLastMoment() {
  return last;
}

export function emitMoment(name: MomentName, label?: string) {
  if (typeof window === "undefined") return;
  const detail: MomentDetail = { name, label, at: performance.now() };
  last = detail;
  window.dispatchEvent(new CustomEvent<MomentDetail>(EVENT, { detail }));
  const prefs = getMomentPrefs();
  if (prefs.haptics) vibrate(name);
  if (prefs.sound) playSound(name);
}

export function onMoment(handler: (m: MomentDetail) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<MomentDetail>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/* ---------- Haptics (Vibration API: Android browsers; ignored elsewhere) ---------- */
const PATTERNS: Record<MomentName, number[]> = {
  success: [12, 40, 18],
  upload: [10, 30, 10, 30, 18],
  delete: [24],
  undo: [8, 24, 8],
  error: [40, 30, 40],
};

function vibrate(name: MomentName) {
  try {
    navigator.vibrate?.(PATTERNS[name]);
  } catch {
    /* not allowed */
  }
}

/* ---------- Sound: tiny tones synthesised with Web Audio (no files) ---------- */
let audio: AudioContext | null = null;

function tone(ctx: AudioContext, freq: number, start: number, length: number, type: OscillatorType, gain: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + length + 0.02);
  return osc;
}

export function playSound(name: MomentName) {
  try {
    audio ??= new AudioContext();
    const ctx = audio;
    if (ctx.state === "suspended") void ctx.resume();
    switch (name) {
      case "success":
        tone(ctx, 784, 0, 0.18, "sine", 0.06);
        tone(ctx, 1175, 0.09, 0.28, "sine", 0.05);
        break;
      case "upload":
        [523, 659, 784, 1047].forEach((f, i) => tone(ctx, f, i * 0.06, 0.22, "sine", 0.045));
        break;
      case "delete": {
        const o = tone(ctx, 420, 0, 0.16, "triangle", 0.05);
        o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.16);
        break;
      }
      case "undo": {
        const o = tone(ctx, 260, 0, 0.16, "triangle", 0.045);
        o.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.16);
        break;
      }
      case "error":
        tone(ctx, 180, 0, 0.12, "square", 0.025);
        tone(ctx, 160, 0.14, 0.14, "square", 0.025);
        break;
    }
  } catch {
    /* audio not available */
  }
}
