import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { DeltaChip, HtmlPlot, niceScale } from "@/registry/dither/charts/chart-kit";
import { cn } from "@/registry/dither/lib/utils";

export interface WaterfallStep {
  label: string;
  value: number;
  /** "total" bars start at 0; others move from the running total. */
  kind?: "total" | "delta";
}

export interface WaterfallChartProps extends React.ComponentProps<"div"> {
  steps: WaterfallStep[];
  format?: (n: number) => string;
  /** Delta chip top-right, e.g. "+26% QoQ". */
  delta?: React.ReactNode;
  height?: number;
}

function toBars(steps: WaterfallStep[]) {
  const out: (WaterfallStep & { from: number; to: number })[] = [];
  let running = 0;
  for (const s of steps) {
    if (s.kind === "total") {
      running = s.value;
      out.push({ ...s, from: 0, to: s.value });
    } else {
      out.push({ ...s, from: running, to: running + s.value });
      running += s.value;
    }
  }
  return out;
}

/** Bridge from one total to the next: increases green, decreases red, totals solid, headroom in dither. */
export function WaterfallChart({ steps, format = (n) => `${n}`, delta, height = 200, className, ...props }: WaterfallChartProps) {
  const bars = toBars(steps);
  const { max, ticks } = niceScale(Math.max(...bars.map((b) => Math.max(b.from, b.to))) * 1.15);
  return (
    <div data-slot="waterfall-chart" className={cn("flex flex-col gap-2", className)} {...props}>
      {delta ? (
        <span className="flex justify-end">
          <DeltaChip>{delta}</DeltaChip>
        </span>
      ) : null}
      <HtmlPlot ticks={ticks} max={max} height={height} format={format} className={delta ? "mt-4" : undefined}>
        <div className="absolute inset-0 flex items-end gap-[5%] px-[2%]">
          {bars.map((b) => {
            const lo = Math.min(b.from, b.to);
            const hi = Math.max(b.from, b.to);
            const tone = b.kind === "total" ? "bg-foreground" : b.value >= 0 ? "bg-positive" : "bg-destructive";
            const sign = b.kind === "total" ? "" : b.value >= 0 ? "+" : "−";
            return (
              <div key={b.label} className="relative h-full flex-1" role="img" aria-label={`${b.label}: ${sign}${format(Math.abs(b.value))}`}>
                {b.kind === "total" ? <DitherFill variant="organic" className="inset-auto inset-x-0 top-[8%] bottom-0 rounded-[4px]" /> : null}
                <span className={cn("absolute inset-x-[8%] rounded-[4px]", tone)} style={{ bottom: `${(lo / max) * 100}%`, height: `max(${((hi - lo) / max) * 100}%, 3px)` }} />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+4px)] font-mono text-[11px] font-medium whitespace-nowrap tabular" style={{ bottom: `${(hi / max) * 100}%` }}>
                  {sign}
                  {format(Math.abs(b.value))}
                </span>
              </div>
            );
          })}
        </div>
      </HtmlPlot>
      <div className="flex gap-[5%] pr-[2%] pl-[calc(2.5rem+2%)] font-mono text-[11px] text-muted-foreground">
        {bars.map((b) => (
          <span key={b.label} className="flex-1 truncate text-center">{b.label}</span>
        ))}
      </div>
    </div>
  );
}
