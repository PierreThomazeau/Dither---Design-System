/**
 * Organic dither — proposal (lab). Pure functions, no DOM.
 *
 * Instead of a fixed tile (regular grid, linear gradient), every cell of a pixel grid gets a
 * density between 0 and 1 from a *shape* (cloud, scatter, halo, flow) modulated by fractal
 * value noise. The cell is lit when its density beats an ordered (Bayer 8×8) threshold, so the
 * texture stays pixel-crisp but its density moves in clumps, wisps and holes.
 */

export type OrganicShape = "cloud" | "scatter" | "halo" | "flow";

export const ORGANIC_SHAPES: readonly OrganicShape[] = ["cloud", "scatter", "halo", "flow"];

/** 8×8 Bayer matrix, normalised thresholds in (0, 1). */
const BAYER_8 = (() => {
  const m4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  const out: number[][] = [];
  for (let y = 0; y < 8; y++) {
    out.push([]);
    for (let x = 0; x < 8; x++) {
      const q = (y >> 2) * 2 + (x >> 2); // quadrant 0..3 → 0, 2, 3, 1
      const base = [0, 2, 3, 1][q];
      out[y].push((4 * m4[y % 4][x % 4] + base + 0.5) / 64);
    }
  }
  return out;
})();

export function bayer(col: number, row: number) {
  return BAYER_8[row & 7][col & 7];
}

/** Integer hash → [0, 1). Deterministic, seedable. */
function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** 2D value noise in [0, 1]. */
export function valueNoise(x: number, y: number, seed = 1) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = smooth(x - xi);
  const ty = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

/** Fractal noise (4 octaves) in ~[0, 1]. */
export function fbm(x: number, y: number, seed = 1) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let o = 0; o < 4; o++) {
    sum += amp * valueNoise(x * f, y * f, seed + o * 17);
    f *= 2.03;
    amp *= 0.5;
  }
  return sum / 0.9375;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Contrast curve: below lo = empty, above hi = full, dithered in between. */
const band = (v: number, lo: number, hi: number) => smooth(clamp01((v - lo) / (hi - lo)));

export interface FieldInput {
  /** Normalised position, 0..1 across the element. */
  u: number;
  v: number;
  /** Aspect ratio (w / h), so noise stays round on wide elements. */
  aspect: number;
  /** Time in seconds (drift). */
  t: number;
  seed: number;
  /** Noise scale: higher = smaller clumps. */
  scale: number;
}

/** Density 0..1 for one cell. */
export function density(shape: OrganicShape, { u, v, aspect, t, seed, scale }: FieldInput) {
  const nx = u * aspect * scale;
  const ny = v * scale;
  const drift = t * 0.06;
  switch (shape) {
    case "cloud": {
      // Billowy clumps with a slow domain warp: big soft masses and holes.
      const wx = fbm(nx * 0.6 + drift, ny * 0.6, seed + 3) - 0.5;
      const wy = fbm(nx * 0.6, ny * 0.6 - drift, seed + 7) - 0.5;
      const n = fbm(nx + wx * 1.6 + drift * 0.5, ny + wy * 1.6, seed);
      return band(n, 0.4, 0.66);
    }
    case "scatter": {
      // Dense at the top, breaking into a noisy, irregular edge and sparse grain below.
      const n = fbm(nx * 1.4 + drift, ny * 1.4, seed);
      const edge = 0.34 + (n - 0.5) * 0.7; // ragged boundary
      const fall = band(1 - (v - edge) * 2.2, 0.1, 0.9);
      // Below the edge: sparse grain that still follows the noise.
      const tail = band(n, 0.45, 0.8) * 0.32 * (1 - v * 0.6);
      return Math.max(fall, tail);
    }
    case "halo": {
      // A soft blob around the centre with a granular, noisy rim (content sits in the middle).
      const dx = (u - 0.5) * aspect;
      const dy = v - 0.5;
      const r = Math.sqrt(dx * dx * 0.35 + dy * dy * 1.6);
      const n = fbm(nx * 1.2 + drift, ny * 1.2 - drift, seed);
      const ring = 1 - Math.abs(r - 0.44) * 3;
      return band(ring + (n - 0.5) * 1.1, 0.25, 0.85);
    }
    case "flow": {
      // Warped bands, like a topographic field: stripes that thin and swell.
      const w = fbm(nx * 0.5 + drift, ny * 0.5, seed) * 6;
      const s = Math.sin((nx * 0.9 + ny * 1.4) * 3.4 + w);
      const n = fbm(nx * 2, ny * 2, seed + 11);
      return band(0.5 + s * 0.6 + (n - 0.5) * 0.6, 0.35, 0.8);
    }
  }
}
