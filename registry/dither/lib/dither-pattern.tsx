"use client";

import * as React from "react";

import { ditherTile, TWINKLE_DURATION, type DitherVariant } from "@/registry/dither/lib/dither-tile";

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
 *
 * The dots keep their on-screen size whatever the SVG's viewBox: when the SVG is stretched
 * (a 100-unit donut drawn at 180px), the pattern is scaled back so a 2px dot stays 2px, the same
 * as in every other chart. Organic tiles also twinkle (a few dots fade in and out).
 */
export function DitherPattern({ id, variant = "regular", gradientHeight }: DitherPatternProps) {
  const tile = ditherTile(variant, gradientHeight);
  const ref = React.useRef<SVGPatternElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return;
    const measure = () => {
      const vb = svg.viewBox.baseVal;
      const w = svg.getBoundingClientRect().width;
      if (vb && vb.width > 0 && w > 0) setScale(Math.round((vb.width / w) * 1000) / 1000);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  return (
    <pattern
      ref={ref}
      id={id}
      width={tile.width}
      height={tile.height}
      patternUnits="userSpaceOnUse"
      patternTransform={scale !== 1 ? `scale(${scale})` : undefined}
    >
      {tile.dots.map((d) => (
        <rect
          key={`${d.x}-${d.y}`}
          x={d.x}
          y={d.y}
          width={d.size ?? tile.dot}
          height={d.size ?? tile.dot}
          className={d.twinkle !== undefined ? "dither-twinkle" : undefined}
          style={{ fill: DOT_FILL, ...(d.twinkle !== undefined ? { animationDelay: `-${d.twinkle}s`, animationDuration: `${TWINKLE_DURATION}s` } : null) }}
        />
      ))}
    </pattern>
  );
}
