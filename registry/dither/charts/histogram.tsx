import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { ChartTag, HtmlPlot, niceScale } from "@/registry/dither/charts/chart-kit";
import { cn } from "@/registry/dither/lib/utils";

export interface HistogramProps extends React.ComponentProps<"div"> {
  /** Counts per bin, left to right. */
  bins: number[];
  /** Value of the left edge of the first bin and the bin width (for labels). */
  start: number;
  step: number;
  /** Bins inside the core range are solid (chart-1); others are dither. Inclusive indexes. */
  core?: [number, number];
  /** Median value (vertical line + tag). */
  median?: number;
  format?: (n: number) => string;
  /** Formats the y axis (counts or shares). */
  formatY?: (n: number) => string;
  height?: number;
}

/** Distribution: core range solid, tails in dither, a median line with a tag. */
export function Histogram({ bins, start, step, core, median, format = (n) => `${n}`, formatY, height = 180, className, ...props }: HistogramProps) {
  const { max, ticks } = niceScale(Math.max(...bins) * 1.1);
  const span = bins.length * step;
  const labels = [0, Math.round(bins.length / 3), Math.round((bins.length * 2) / 3), bins.length];
  return (
    <div data-slot="histogram" className={cn("flex flex-col gap-2", className)} {...props}>
      <HtmlPlot ticks={ticks} max={max} height={height} format={formatY} className={median !== undefined ? "mt-10" : undefined}>
        <div className="absolute inset-0 flex items-end gap-px">
          {bins.map((count, i) => {
            const inCore = core ? i >= core[0] && i <= core[1] : true;
            return (
              <span
                key={i}
                title={`${format(start + i * step)}–${format(start + (i + 1) * step)}: ${count}`}
                className={cn("relative flex-1 overflow-hidden rounded-t-[3px]", inCore && "bg-chart-1")}
                style={{ height: `${(count / max) * 100}%` }}
              >
                {inCore ? null : <DitherFill variant="organic" />}
              </span>
            );
          })}
        </div>
        {median !== undefined ? (
          <span aria-hidden="true" className="absolute -top-2 bottom-0 border-l border-foreground" style={{ left: `${((median - start) / span) * 100}%` }}>
            <ChartTag className="absolute -top-2 left-0 -translate-x-1/2 -translate-y-full">Median {format(median)}</ChartTag>
          </span>
        ) : null}
      </HtmlPlot>
      <div className="relative ml-10 h-4 font-mono text-[11px] text-muted-foreground">
        {labels.map((b) => (
          <span key={b} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: `${(b / bins.length) * 100}%` }}>
            {format(start + b * step)}
          </span>
        ))}
      </div>
    </div>
  );
}
