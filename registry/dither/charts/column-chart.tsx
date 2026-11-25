import * as React from "react";

import { DeltaChip, HtmlPlot, niceScale } from "@/registry/dither/charts/chart-kit";
import { cn } from "@/registry/dither/lib/utils";

export interface ColumnDatum {
  label: string;
  /** Plan (drawn in dither behind the bar). */
  planned: number;
  /** Actual (solid bar). */
  actual: number;
}

export interface ColumnChartProps extends React.ComponentProps<"div"> {
  data: ColumnDatum[];
  /** Index of the highlighted column (chart-1), e.g. the current sprint. Defaults to the last one. */
  highlight?: number;
  /** Delta chip in the top-left corner, e.g. "84% shipped". */
  delta?: React.ReactNode;
  height?: number;
}

/** Planned vs actual columns: plan in dither, actual solid, the current column highlighted. */
export function ColumnChart({ data, highlight = data.length - 1, delta, height = 200, className, ...props }: ColumnChartProps) {
  const { max, ticks } = niceScale(Math.max(...data.flatMap((d) => [d.planned, d.actual])));
  return (
    <div data-slot="column-chart" className={cn("flex flex-col gap-2", className)} {...props}>
      <HtmlPlot ticks={ticks} max={max} height={height}>
        {delta ? (
          <span className="absolute -top-6 left-1 z-10">
            <DeltaChip tone="bg-chart-1">{delta}</DeltaChip>
          </span>
        ) : null}
        <div className="absolute inset-0 flex items-end gap-[6%] px-[3%]">
          {data.map((d, i) => {
            const hl = i === highlight;
            return (
              <div key={d.label} className="relative h-full flex-1" role="img" aria-label={`${d.label}: ${d.actual} of ${d.planned}`}>
                <span aria-hidden="true" className="bg-dither-fine absolute inset-x-0 bottom-0 rounded-t-[6px]" style={{ height: `${(d.planned / max) * 100}%` }} />
                <span
                  className={cn("absolute inset-x-[10%] bottom-0 rounded-t-[6px]", hl ? "bg-chart-1" : "bg-foreground/85")}
                  style={{ height: `${(d.actual / max) * 100}%` }}
                />
                {hl ? (
                  <span className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+4px)] font-mono text-xs font-medium tabular" style={{ bottom: `${(Math.max(d.actual, d.planned) / max) * 100}%` }}>
                    {d.actual}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </HtmlPlot>
      <div className="flex gap-[6%] pr-[3%] pl-[calc(2.5rem+3%)] font-mono text-[11px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
