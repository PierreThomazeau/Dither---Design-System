import * as React from "react";

import { DeltaChip } from "@/registry/dither/charts/chart-kit";
import { cn } from "@/registry/dither/lib/utils";

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelChartProps extends React.ComponentProps<"div"> {
  stages: FunnelStage[];
  format?: (n: number) => string;
  height?: number;
}

const compact = (n: number) => (n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);

/** Conversion funnel: each stage solid, the drop-off from the previous stage in dither, step conversion chips. */
export function FunnelChart({ stages, format = compact, height = 160, className, ...props }: FunnelChartProps) {
  const top = stages[0]?.value || 1;
  return (
    <div data-slot="funnel-chart" className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="mt-6 flex items-end gap-2" style={{ height }}>
        {stages.map((s, i) => {
          const prev = i === 0 ? s.value : stages[i - 1].value;
          const last = i === stages.length - 1;
          return (
            <div key={s.label} className="relative h-full flex-1" role="img" aria-label={`${s.label}: ${format(s.value)}`}>
              {i > 0 ? (
                <span aria-hidden="true" className="bg-dither-organic absolute inset-x-0 rounded-t-[6px]" style={{ bottom: `${(s.value / top) * 100}%`, height: `${((prev - s.value) / top) * 100}%` }} />
              ) : null}
              <span className={cn("absolute inset-x-0 bottom-0 rounded-[6px]", last ? "bg-chart-1" : "bg-foreground/85")} style={{ height: `max(${(s.value / top) * 100}%, 4px)` }} />
              <span className="absolute left-0 -translate-y-[calc(100%+4px)] font-mono text-xs font-medium tabular" style={{ bottom: `${(prev / top) * 100}%` }}>
                {format(s.value)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {stages.map((s, i) => (
          <div key={s.label} className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <span className="truncate text-xs text-muted-foreground">{s.label}</span>
            {i > 0 ? (
              <DeltaChip tone={s.value / stages[i - 1].value >= 0.3 ? "bg-positive" : "bg-destructive"}>
                {Math.round((s.value / stages[i - 1].value) * 100)}%
              </DeltaChip>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
