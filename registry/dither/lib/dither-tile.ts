/**
 * Dither tile geometry — pure data, no React, no DOM.
 * Shared by <DitherPattern /> (SVG) and scripts/build-dither-css.ts (CSS mask utilities),
 * so the texture is identical everywhere.
 *
 * Spec (tokens.json → dither):
 * - regular  : 2px dots on a 6px grid, odd rows offset by 3px
 * - fine     : 1.5px dots on a 4px grid, odd rows offset by 2px
 * - bayer    : 4×4 ordered dither, 4px cells, threshold 0.32
 * - gradient : 4×4 ordered dither, density fades 0.68 → 0.06 top to bottom
 */

export type DitherVariant = "regular" | "fine" | "bayer" | "gradient";

export const DITHER_VARIANTS: readonly DitherVariant[] = ["regular", "fine", "bayer", "gradient"];

export interface DitherDot {
  x: number;
  y: number;
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

const BAYER_CELL = 4;
const BAYER_DOT = 2;
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
      const dot = variant === "fine" ? 1.5 : 2;
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
  const rects = dots.map((d) => `<rect x='${d.x}' y='${d.y}' width='${dot}' height='${dot}'/>`).join("");
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' fill='${fill}'>${rects}</svg>`;
}
