import * as React from "react";

import { ditherTile, type DitherVariant } from "@/registry/dither/lib/dither-tile";
import { cn } from "@/registry/dither/lib/utils";

export type { DitherVariant } from "@/registry/dither/lib/dither-tile";

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
}

/**
 * A self-contained SVG that fills its positioned parent with the texture.
 * Use for empty states, skeletons, remaining capacity.
 */
export function DitherFill({ variant = "regular", className, ...props }: DitherFillProps) {
  const id = `dither-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} {...props}>
      <defs>
        <DitherPattern id={id} variant={variant} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
