import * as React from "react";

import { ChartTag } from "@/registry/dither/charts/chart-kit";
import { cn } from "@/registry/dither/lib/utils";

export interface RankingDatum {
  label: string;
  value: number;
}

export interface RankingChartProps extends React.ComponentProps<"div"> {
  data: RankingDatum[];
  /** Scale maximum (defaults to the largest value, rounded up). */
  max?: number;
  /** Break-even value: a vertical line with a tag; values below it turn destructive. */
  breakEven?: number;
  format?: (n: number) => string;
}

/** Horizontal ranking with dither tracks: top item highlighted, items below break-even in red. */
export function RankingChart({ data, max, breakEven, format = (n) => `${n.toFixed(1)}x`, className, ...props }: RankingChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = max ?? Math.ceil(Math.max(...data.map((d) => d.value)));
  return (
    <div data-slot="ranking-chart" className={cn("relative grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2.5 pt-6", className)} {...props}>
      {sorted.map((d, i) => {
        const below = breakEven !== undefined && d.value < breakEven;
        const tone = below ? "bg-destructive" : i === 0 ? "bg-chart-1" : "bg-foreground/85";
        return (
          <React.Fragment key={d.label}>
            <span className="truncate text-sm">{d.label}</span>
            <span className="relative h-2.5" role="img" aria-label={`${d.label}: ${format(d.value)}`}>
              <span aria-hidden="true" className="bg-dither-fine absolute inset-0 rounded-full" />
              <span className={cn("absolute inset-y-0 left-0 rounded-full", tone)} style={{ width: `${(d.value / top) * 100}%` }} />
            </span>
            <span className={cn("text-right font-mono text-xs tabular", below && "text-destructive")}>{format(d.value)}</span>
          </React.Fragment>
        );
      })}
      {breakEven !== undefined ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 col-start-2 row-span-full" style={{ gridRow: `1 / span ${sorted.length}` }}>
          <span className="absolute -top-6 bottom-0 border-l border-foreground" style={{ left: `${(breakEven / top) * 100}%` }}>
            <ChartTag className="absolute top-0 left-0 -translate-x-1/2">Break-even {format(breakEven)}</ChartTag>
          </span>
        </div>
      ) : null}
    </div>
  );
}
