import * as React from "react";

import { ditherTile, type DitherVariant } from "@/registry/dither/lib/dither-tile";
import { DitherPattern } from "@/registry/dither/lib/dither-pattern";
import { OrganicDither, type OrganicDitherProps, type OrganicShape } from "@/registry/dither/lib/organic-dither";
import { cn } from "@/registry/dither/lib/utils";

export type { DitherVariant } from "@/registry/dither/lib/dither-tile";
export type { OrganicShape } from "@/registry/dither/lib/organic-dither";

export { DitherPattern, type DitherPatternProps } from "@/registry/dither/lib/dither-pattern";

export interface DitherFillProps extends React.ComponentProps<"svg"> {
  variant?: DitherVariant;
  /** @deprecated Every DitherFill is animated now (drift + pointer wake). Kept for compatibility. */
  interactive?: boolean;
  /** Render the plain SVG tile, without the canvas animation (print, thumbnails). */
  static?: boolean;
  /** Gradient variant: height over which the density fades out (match the element height). */
  gradientHeight?: number;
  /**
   * Organic texture (canvas): density from a noise field instead of the tile.
   * cloud = masses and holes, scatter = dense on top with a ragged edge, halo = around the
   * content, flow = warped bands. Takes over `variant` / `interactive` when set.
   */
  shape?: OrganicShape;
  /** Organic only: noise scale (higher = smaller clumps). */
  scale?: number;
  /** Seed, to vary neighbouring panels. */
  seed?: number;
  /** Organic only: gradient tint (see OrganicDither). */
  tint?: OrganicDitherProps["tint"];
  /** Organic only: dot side range in px, [sparse, dense]. */
  dot?: [number, number];
  /** Organic only: soft edge, the texture (and glow) fades out instead of being cut. */
  fade?: DitherFade;
  /**
   * Organic only: blurred colour blobs under the dots, as custom property names
   * (e.g. ["--brand", "--chart-3"]). Dither and colour in blur, never a flat block.
   */
  glow?: string[];
}

export type DitherFade = "none" | "top" | "bottom" | "left" | "right" | "corner" | "edges";

/** CSS masks for the soft edges. "corner" keeps the top-right corner. */
export const ditherFadeMask: Record<DitherFade, string | undefined> = {
  none: undefined,
  top: "linear-gradient(to top, #000 35%, transparent)",
  bottom: "linear-gradient(to bottom, #000 35%, transparent)",
  left: "linear-gradient(to right, transparent, #000 55%)",
  right: "linear-gradient(to left, transparent, #000 55%)",
  corner: "radial-gradient(120% 120% at 100% 0%, #000 20%, transparent 70%)",
  edges: "radial-gradient(closest-side, #000 60%, transparent)",
};

const GLOW_SPOTS = [
  "left-[-10%] top-[-30%] h-[110%] w-[60%]",
  "right-[-10%] top-[-10%] h-[100%] w-[55%]",
  "left-[30%] bottom-[-40%] h-[90%] w-[50%]",
];

const DEFAULT_SCALE: Record<OrganicShape, number> = { cloud: 2.4, scatter: 3, halo: 3.2, flow: 1.6 };

/**
 * Fills its positioned parent with the texture.
 * - `shape`: organic texture (surfaces: heroes, cards, empty states, AI headers), with optional
 *   soft edge (`fade`) and blurred colour (`glow`).
 * - otherwise the tile `variant` (regular, fine, bayer, gradient, organic), animated the same way as
 *   the shapes: drifting noise and the pointer wake (canvas, still under reduced motion).
 *   `static` renders the plain SVG tile instead.
 */
export function DitherFill({ variant = "regular", gradientHeight, interactive: _interactive, static: isStatic = false, shape, scale, seed, tint, dot, fade = "none", glow, className, ...props }: DitherFillProps) {
  const id = `dither-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  if (shape) {
    const mask = ditherFadeMask[fade];
    return (
      <span
        aria-hidden="true"
        data-slot="dither-fill"
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      >
        {glow?.map((color, i) => (
          <span
            key={color + i}
            className={cn("absolute rounded-full opacity-20 blur-3xl motion-safe:animate-[glow-float_14s_ease-in-out_infinite_alternate]", GLOW_SPOTS[i % GLOW_SPOTS.length])}
            style={{ background: `var(${color})`, animationDelay: `${i * -5}s` }}
          />
        ))}
        <OrganicDither shape={shape} scale={scale ?? DEFAULT_SCALE[shape]} seed={seed} tint={tint} dot={dot} />
      </span>
    );
  }
  if (!isStatic) {
    return (
      <span aria-hidden="true" data-slot="dither-fill" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} style={props.style}>
        <OrganicDither tile={variant} gradientHeight={gradientHeight} seed={seed} />
      </span>
    );
  }
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} {...props}>
      <defs>
        <DitherPattern id={id} variant={variant} gradientHeight={gradientHeight} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
