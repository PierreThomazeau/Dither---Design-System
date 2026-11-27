/**
 * Dither tile geometry — pure data, no React, no DOM.
 * Shared by <DitherPattern /> (SVG) and scripts/build-dither-css.ts (CSS mask utilities),
 * so the texture is identical everywhere.
 *
 * Spec (tokens.json → dither):
 * - regular  : 2px dots on a 6px grid, odd rows offset by 3px
 * - fine     : 2px dots on a 4px grid, odd rows offset by 2px
 * - bayer    : 4×4 ordered dither, 4px cells, threshold 0.32
 * - gradient : 4×4 ordered dither, density fades 0.68 → 0.06 top to bottom
 * - organic  : seamless 96px tile from periodic noise, clumps and gaps, 2px dots on a 4px grid
 *
 * Every dot in the system is DITHER_DOT (2px), the organic tile's size (Pierre).
 *              (the static sibling of the organic canvas texture)
 */


export type DitherVariant = "regular" | "fine" | "bayer" | "gradient" | "organic";

/** The one dot size of the whole system, and the organic grid step (Pierre: the organic tile is the base). */
export const DITHER_DOT = 2;
export const DITHER_CELL = 4;

export const DITHER_VARIANTS: readonly DitherVariant[] = ["regular", "fine", "bayer", "gradient", "organic"];

export interface DitherDot {
  x: number;
  y: number;
  /** Per-dot side (organic tile); falls back to the tile's `dot`. */
  size?: number;
}

export interface DitherTile {
  width: number;
  height: number;
  /** Side of each square dot, in px. */
  dot: number;
  dots: DitherDot[];
}

/** Classic 4×4 Bayer index matrix (0–15). */
export const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;


/* ------------------------------------------------------------------ *
 * Noise primitives, shared with organic-field.ts (the canvas texture).
 * ------------------------------------------------------------------ */

/** 8×8 Bayer matrix, normalised thresholds in (0, 1). */
const BAYER_8 = (() => {
  const out: number[][] = [];
  for (let y = 0; y < 8; y++) {
    out.push([]);
    for (let x = 0; x < 8; x++) {
      const q = (y >> 2) * 2 + (x >> 2);
      out[y].push((4 * BAYER_4[y % 4][x % 4] + [0, 2, 3, 1][q] + 0.5) / 64);
    }
  }
  return out;
})();

export function bayer(col: number, row: number) {
  return BAYER_8[row & 7][col & 7];
}

/** Integer hash → [0, 1). Deterministic, seedable. */
export function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Contrast curve: below lo = empty, above hi = full, dithered in between. */
export const band = (v: number, lo: number, hi: number) => smooth(clamp01((v - lo) / (hi - lo)));

/* ------------------------------------------------------------------ *
 * Seamless organic tile (static): for SVG patterns, CSS masks and small
 * marks (chart tracks, remaining capacity, the button glow). Periodic
 * value noise, so the tile repeats without a visible seam.
 * ------------------------------------------------------------------ */

/** Value noise that repeats every `period` cells: tiles seamlessly. */
export function periodicNoise(x: number, y: number, period: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = smooth(x - xi);
  const ty = smooth(y - yi);
  const w = (v: number) => ((v % period) + period) % period;
  const a = hash(w(xi), w(yi), seed);
  const b = hash(w(xi + 1), w(yi), seed);
  const c = hash(w(xi), w(yi + 1), seed);
  const d = hash(w(xi + 1), w(yi + 1), seed);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

function periodicFbm(x: number, y: number, period: number, seed: number) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let o = 0; o < 3; o++) {
    sum += amp * periodicNoise(x * f, y * f, period * f, seed + o * 17);
    f *= 2;
    amp *= 0.5;
  }
  return sum / 0.875;
}

interface OrganicTileDot {
  x: number;
  y: number;
  size: number;
}

export interface OrganicTile {
  size: number;
  dots: OrganicTileDot[];
}

/**
 * A square, seamless organic tile: clumps and gaps, dots growing with density.
 * `cell` is the grid step, `dot` the [sparse, dense] dot sides, `period` the number of noise
 * cells across the tile (more = smaller clumps).
 */
export function organicTile({ size = 96, cell = DITHER_CELL, dot = [DITHER_DOT, DITHER_DOT], period = 3, seed = 7 }: { size?: number; cell?: number; dot?: [number, number]; period?: number; seed?: number } = {}): OrganicTile {
  const dots: OrganicTileDot[] = [];
  const n = Math.round(size / cell);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const v = periodicFbm((col / n) * period, (row / n) * period, period, seed);
      // Keep a floor of sparse dots everywhere so tracks always read, clumps on top.
      const dens = 0.22 + band(v, 0.4, 0.75) * 0.36;
      if (dens <= bayer(col, row)) continue;
      const s = Math.round((dot[0] + (dot[1] - dot[0]) * Math.min(1, dens * 1.8)) * 4) / 4;
      const o = (cell - s) / 2;
      dots.push({ x: col * cell + o, y: row * cell + o, size: s });
    }
  }
  return { size, dots };
}

const BAYER_CELL = 4;
const BAYER_DOT = DITHER_DOT;
const BAYER_THRESHOLD = 0.32;
const GRADIENT_FROM = 0.68;
const GRADIENT_TO = 0.06;
/** Default height of the gradient tile (64 rows of 4px). */
export const GRADIENT_HEIGHT = 256;

function bayerOn(col: number, row: number, threshold: number) {
  return (BAYER_4[row % 4][col % 4] + 0.5) / 16 < threshold;
}

/** Centre a dot inside its cell so the grid reads evenly. */
const inset = (cell: number, dot: number) => (cell - dot) / 2;

export function ditherTile(variant: DitherVariant = "regular", gradientHeight = GRADIENT_HEIGHT): DitherTile {
  switch (variant) {
    case "regular":
    case "fine": {
      const cell = variant === "fine" ? 4 : 6;
      const dot = DITHER_DOT;
      const offset = cell / 2;
      return {
        width: cell,
        height: cell * 2,
        dot,
        dots: [
          { x: 0, y: 0 },
          { x: offset, y: cell },
        ],
      };
    }
    case "bayer": {
      const dots: DitherDot[] = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (bayerOn(col, row, BAYER_THRESHOLD)) {
            dots.push({
              x: col * BAYER_CELL + inset(BAYER_CELL, BAYER_DOT),
              y: row * BAYER_CELL + inset(BAYER_CELL, BAYER_DOT),
            });
          }
        }
      }
      return { width: BAYER_CELL * 4, height: BAYER_CELL * 4, dot: BAYER_DOT, dots };
    }
    case "organic": {
      const t = organicTile();
      return { width: t.size, height: t.size, dot: 2, dots: t.dots };
    }
    case "gradient": {
      const rows = Math.max(4, Math.round(gradientHeight / BAYER_CELL));
      const dots: DitherDot[] = [];
      for (let row = 0; row < rows; row++) {
        const t = GRADIENT_FROM - ((GRADIENT_FROM - GRADIENT_TO) * row) / (rows - 1);
        for (let col = 0; col < 4; col++) {
          if (bayerOn(col, row, t)) {
            dots.push({
              x: col * BAYER_CELL + inset(BAYER_CELL, BAYER_DOT),
              y: row * BAYER_CELL + inset(BAYER_CELL, BAYER_DOT),
            });
          }
        }
      }
      return { width: BAYER_CELL * 4, height: rows * BAYER_CELL, dot: BAYER_DOT, dots };
    }
  }
}

/** Standalone SVG markup of one tile, dots filled with `fill` (default black, for CSS masks). */
export function ditherTileSvg(variant: DitherVariant, fill = "#000") {
  const { width, height, dot, dots } = ditherTile(variant);
  const rects = dots.map((d) => `<rect x='${d.x}' y='${d.y}' width='${d.size ?? dot}' height='${d.size ?? dot}'/>`).join("");
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' fill='${fill}'>${rects}</svg>`;
}
