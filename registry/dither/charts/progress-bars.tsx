import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { ChartTag, DeltaChip } from "@/registry/dither/charts/chart-kit";
import { cn } from "@/registry/dither/lib/utils";

export interface ProgressBarItem {
  label: React.ReactNode;
  /** 0–100. */
  value: number;
  /** Small marker before the label (initial, avatar…). */
  marker?: React.ReactNode;
}

export interface ProgressBarsProps extends React.ComponentProps<"div"> {
  items: ProgressBarItem[];
  /** Index of the highlighted bar (chart-1). */
  highlight?: number;
  /** Target line, 0–100. */
  target?: number;
  /** Delta chip above the highlighted bar, e.g. "+12 pts". */
  delta?: React.ReactNode;
  height?: number;
}

/** Vertical progress bars: remaining to 100% in dither, one highlighted bar, a target line. */
export function ProgressBars({ items, highlight, target, delta, height = 180, className, ...props }: ProgressBarsProps) {
  return (
    <div data-slot="progress-bars" className={cn("flex flex-col gap-2", className)} {...props}>
      {/* With a target, the bars leave a right gutter for its tag, so the tag never sits on a bar. */}
      <div className={cn("relative flex gap-2", target !== undefined && "pr-24")} style={{ height }}>
        {items.map((item, i) => {
          const hl = i === highlight;
          return (
            <div key={i} className="relative flex-1">
              <DitherFill variant="organic" className="rounded-control-min" />
              {hl && delta ? (
                <span className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-[calc(100%+4px)]" style={{ bottom: `${item.value}%` }}>
                  <DeltaChip>{delta}</DeltaChip>
                </span>
              ) : null}
              <div
                role="img"
                aria-label={`${typeof item.label === "string" ? item.label : "Item"}: ${item.value}%`}
                className={cn("absolute inset-x-0 bottom-0 rounded-control-min", hl ? "bg-chart-1 text-woodsmoke-950" : "bg-border-strong text-foreground")}
                style={{ height: `${item.value}%` }}
              >
                <span className="absolute top-2 left-2.5 font-mono text-xs font-medium tabular">{item.value}%</span>
              </div>
            </div>
          );
        })}
        {target !== undefined ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-10 border-t border-foreground" style={{ bottom: `${target}%` }}>
            <ChartTag className="absolute right-0 w-22 -translate-y-1/2 justify-center">Target {target}%</ChartTag>
          </div>
        ) : null}
      </div>
      <div className={cn("flex gap-2", target !== undefined && "pr-24")}>
        {items.map((item, i) => (
          <span key={i} className="flex flex-1 items-center justify-center gap-1.5 truncate text-xs text-muted-foreground">
            {item.marker ? (
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full border font-mono text-[9px]">{item.marker}</span>
            ) : null}
            <span className={cn("truncate", i === highlight && "font-medium text-foreground")}>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
