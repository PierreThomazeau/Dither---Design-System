"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { DitherFill } from "@/registry/dither/lib/dither";
import { BAYER_4, DITHER_CELL, DITHER_DOT } from "@/registry/dither/lib/dither-tile";
import { readColors } from "@/registry/dither/lib/moment-sweep";
import { valueNoise } from "@/registry/dither/lib/organic-field";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * Progress, two readings of "how far":
 *  - bar:     solid fill, the remaining part in dither (system rule)
 *  - density: dither as progress itself; 2px dots light up across the
 *             whole track in Bayer order as the value grows (0 = empty,
 *             100 = dense). Used by FileDrop.
 * value undefined = indeterminate (dither drifts).
 * ------------------------------------------------------------------ */

export interface ProgressProps extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value"> {
  value?: number | null;
  variant?: "bar" | "density";
  /** Track height: sm 4px, default 8px, lg 12px. */
  size?: "sm" | "default" | "lg";
  /** Fill colour token (default --foreground; density uses it for the dots). */
  tone?: string;
}

const HEIGHT = { sm: "h-1", default: "h-2", lg: "h-3" } as const;

function DensityCanvas({ value, tone }: { value: number; tone: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const paint = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);
      const [on, rest] = readColors(canvas, [tone, "--border-strong"]);
      const cell = DITHER_CELL, dot = DITHER_DOT, o = (cell - dot) / 2;
      const cols = Math.ceil(r.width / cell), rows = Math.max(1, Math.round(r.height / cell));
      const p = value / 100;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          // Rank mixes Bayer order with a little noise so it fills evenly, not in stripes.
          const rank = (BAYER_4[y & 3][x & 3] + 0.5) / 16 * 0.7 + valueNoise(x * 0.35, y * 0.35, 9) * 0.3;
          const lit = rank < p;
          ctx.fillStyle = lit ? `rgb(${on.join(",")})` : `rgba(${rest.join(",")},0.55)`;
          if (lit || (x + y) % 2 === 0) ctx.fillRect(x * cell + o, y * cell + o, dot, dot);
        }
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [value, tone]);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}

function Progress({ value, variant = "bar", size = "default", tone = "--foreground", className, ...props }: ProgressProps) {
  const v = value == null ? null : Math.max(0, Math.min(100, value));
  const height = variant === "density" ? (size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3") : HEIGHT[size];
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={variant}
      value={v}
      className={cn("relative w-full overflow-hidden", variant === "bar" ? "rounded-full" : "rounded-hairline", height, className)}
      {...props}
    >
      {v === null ? (
        <DitherFill variant="organic" />
      ) : variant === "density" ? (
        <DensityCanvas value={v} tone={tone} />
      ) : (
        <>
          <DitherFill variant="organic" />
          <ProgressPrimitive.Indicator
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-(--motion-open-duration) ease-(--motion-open-ease)"
            style={{ width: `${v}%`, background: `var(${tone})` }}
          />
        </>
      )}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
