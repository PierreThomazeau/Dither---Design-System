import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

export interface SparklineProps extends Omit<React.ComponentProps<"div">, "children"> {
  data: number[];
  /** Fill under the line (a fading area in the line colour). */
  area?: boolean;
  /** Dither texture behind the line. */
  dither?: boolean;
  /** Accessible summary, e.g. "Revenue, up 12% over 30 days". */
  label?: string;
}

/**
 * Tiny trend line that stretches to its container. Colour follows `currentColor`,
 * so set it with a text utility (`text-positive`, `text-chart-1`…).
 */
function Sparkline({ data, area = true, dither = false, label, className, ...props }: SparklineProps) {
  const gradientId = `spark-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const W = 100;
  const H = 32;
  const pad = 2;
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  // Keep a minimum vertical range (25% of the mean) so near-flat series stay flat instead of zigzagging.
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const span = Math.max(hi - lo, Math.abs(mean) * 0.25) || 1;
  const min = (lo + hi) / 2 - span / 2;
  const points = data.map((v, i) => [
    data.length === 1 ? W / 2 : (i / (data.length - 1)) * W,
    pad + (1 - (v - min) / span) * (H - pad * 2),
  ]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const fill = `${line} L${W},${H} L0,${H} Z`;

  return (
    <div
      data-slot="sparkline"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative h-8 w-full overflow-hidden text-chart-1", className)}
      {...props}
    >
      {dither ? <DitherFill variant="organic" /> : null}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="relative size-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.24} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        {area ? <path d={fill} fill={`url(#${gradientId})`} /> : null}
        <path d={line} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export { Sparkline };
