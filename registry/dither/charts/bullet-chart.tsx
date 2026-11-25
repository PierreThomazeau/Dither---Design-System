import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

export interface BulletDatum {
  label: string;
  /** Secondary line under the label, e.g. "Target €6.0M". */
  caption?: string;
  /** Displayed value on the right. */
  display: string;
  /** Value, target and expected range, all 0–100 (percent of the scale). */
  value: number;
  target: number;
  range?: [number, number];
}

export interface BulletChartProps extends React.ComponentProps<"div"> {
  data: BulletDatum[];
}

/** KPI vs target: expected range band, stretch zone in dither, value bar and a target tick. */
export function BulletChart({ data, className, ...props }: BulletChartProps) {
  return (
    <div data-slot="bullet-chart" className={cn("grid grid-cols-[minmax(6rem,auto)_1fr_auto] items-center gap-x-4 gap-y-4", className)} {...props}>
      {data.map((d) => {
        const onTrack = d.value >= d.target;
        return (
          <React.Fragment key={d.label}>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm">{d.label}</span>
              {d.caption ? <span className="truncate font-mono text-[11px] text-muted-foreground">{d.caption}</span> : null}
            </span>
            <span className="relative h-4" role="img" aria-label={`${d.label}: ${d.display}, ${onTrack ? "on track" : "behind target"}`}>
              <span aria-hidden="true" className="bg-dither-fine absolute inset-y-0.5 right-0 left-0 rounded-[3px]" />
              {d.range ? (
                <span className="absolute inset-y-0 rounded-[3px] bg-background-muted" style={{ left: `${d.range[0]}%`, width: `${d.range[1] - d.range[0]}%` }} />
              ) : null}
              <span className={cn("absolute inset-y-[5px] left-0 rounded-full", onTrack ? "bg-foreground/85" : "bg-chart-4")} style={{ width: `${d.value}%` }} />
              <span className="absolute -inset-y-1 w-0.5 rounded-full bg-foreground" style={{ left: `${d.target}%` }} />
            </span>
            <span className="text-right font-mono text-xs font-medium tabular">{d.display}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
