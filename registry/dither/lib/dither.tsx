import * as React from "react";

import { ditherTile, type DitherVariant } from "@/registry/dither/lib/dither-tile";
import { DitherField } from "@/registry/dither/lib/dither-field";
import { OrganicDither, type OrganicDitherProps, type OrganicShape } from "@/registry/dither/lib/organic-dither";
import { cn } from "@/registry/dither/lib/utils";

export type { DitherVariant } from "@/registry/dither/lib/dither-tile";
export type { OrganicShape } from "@/registry/dither/lib/organic-dither";

const DOT_FILL = "var(--dither-color, var(--border-strong))";

export interface DitherPatternProps {
  /** id referenced by `fill="url(#id)"`. Must be unique on the page. */
  id: string;
  variant?: DitherVariant;
  /** Height of the gradient tile in px (gradient variant only). */
  gradientHeight?: number;
}

/**
 * SVG `<pattern>` of the Dither texture. Place it inside `<defs>` of any SVG
 * (charts, tracks, forecast bands) and fill shapes with `url(#id)`.
 * Dots use `--dither-color`, falling back to `--border-strong`.
 */
export function DitherPattern({ id, variant = "regular", gradientHeight }: DitherPatternProps) {
  const tile = ditherTile(variant, gradientHeight);
  return (
    <pattern id={id} width={tile.width} height={tile.height} patternUnits="userSpaceOnUse">
      {tile.dots.map((d) => (
        <rect key={`${d.x}-${d.y}`} x={d.x} y={d.y} width={tile.dot} height={tile.dot} style={{ fill: DOT_FILL }} />
      ))}
    </pattern>
  );
}

export interface DitherFillProps extends React.ComponentProps<"svg"> {
  variant?: DitherVariant;
  /** Dots move away from the pointer (canvas, client-side). Static under reduced motion. */
  interactive?: boolean;
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
  /** Organic only: seed, to vary neighbouring panels. */
  seed?: number;
  /** Organic only: gradient tint (see OrganicDither). */
  tint?: OrganicDitherProps["tint"];
  /** Organic only: dot side range in px, [sparse, dense]. */
  dot?: [number, number];
}

const DEFAULT_SCALE: Record<OrganicShape, number> = { cloud: 2.4, scatter: 3, halo: 3.2, flow: 1.6 };

/**
 * Fills its positioned parent with the texture.
 * - `shape`: organic texture (surfaces: heroes, cards, empty states, AI headers).
 * - otherwise the regular tile as SVG (data marks: tracks, remaining capacity), or the
 *   repelling dot field with `interactive`.
 */
export function DitherFill({ variant = "regular", gradientHeight, interactive = false, shape, scale, seed, tint, dot, className, ...props }: DitherFillProps) {
  const id = `dither-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  if (shape) return <OrganicDither shape={shape} scale={scale ?? DEFAULT_SCALE[shape]} seed={seed} tint={tint} dot={dot} className={className} />;
  if (interactive) return <DitherField variant={variant} gradientHeight={gradientHeight} className={className} />;
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} {...props}>
      <defs>
        <DitherPattern id={id} variant={variant} gradientHeight={gradientHeight} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
