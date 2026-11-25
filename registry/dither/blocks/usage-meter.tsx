import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

type UsageStatus = "normal" | "warning" | "critical";

const statusBar: Record<UsageStatus, string> = {
  normal: "bg-informative",
  warning: "bg-chart-1",
  critical: "bg-destructive",
};
const statusText: Record<UsageStatus, string> = {
  normal: "text-muted-foreground",
  warning: "text-chart-1",
  critical: "text-destructive",
};

export interface UsageSegment {
  label: string;
  value: number;
}

export interface UsageMeterProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: React.ReactNode;
  /** Total capacity, in the same unit as the segments. */
  max: number;
  /** First segment is drawn solid, the next ones lighter (reserved, staging…). */
  segments: UsageSegment[];
  status?: UsageStatus;
  caption?: React.ReactNode;
  /** Formats numbers in the header (default: locale grouping). */
  format?: (n: number) => string;
}

/** Quota meter: used + reserved segments, remaining capacity in dither, legend and status caption. */
function UsageMeter({
  label,
  max,
  segments,
  status = "normal",
  caption,
  format = (n) => n.toLocaleString("en-US"),
  className,
  ...props
}: UsageMeterProps) {
  const used = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div data-slot="usage-meter" data-status={status} className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground tabular">
          <span className="text-foreground">{format(used)}</span> / {format(max)}
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={used}
        aria-label={typeof label === "string" ? label : undefined}
        className="relative flex h-2 w-full gap-0.5 overflow-hidden rounded-full"
      >
        <span aria-hidden="true" className="bg-dither-organic absolute inset-0" />
        {segments.map((s, i) => (
          <span
            key={s.label}
            className={cn("relative h-full first:rounded-l-full last:rounded-r-full", statusBar[status], i > 0 && "opacity-40")}
            style={{ width: `${Math.min(100, (s.value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
        <ul className="flex flex-wrap items-center gap-3 text-muted-foreground">
          {segments.map((s, i) => (
            <li key={s.label} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-[2px]", statusBar[status], i > 0 && "opacity-40")} />
              {s.label}
            </li>
          ))}
        </ul>
        {caption ? <span className={cn("font-mono tabular", statusText[status])}>{caption}</span> : null}
      </div>
    </div>
  );
}

export { UsageMeter };
