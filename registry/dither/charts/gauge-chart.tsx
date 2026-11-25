import * as React from "react";

import { DitherPattern } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

export interface GaugeChartProps extends React.ComponentProps<"div"> {
  /** 0–100. */
  value: number;
  /** Alert threshold (0–100): marker on the ring + tag. */
  alert?: number;
  display?: React.ReactNode;
  caption?: React.ReactNode;
  /** Labels at both ends of the ring. */
  minLabel?: string;
  maxLabel?: string;
}

/** Large half-ring gauge: value in chart-1, remaining arc in dither, an alert marker with a black tag. */
export function GaugeChart({ value, alert, display, caption, minLabel, maxLabel, className, ...props }: GaugeChartProps) {
  const id = `gauge-chart-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const v = Math.min(100, Math.max(0, value));
  const r = 80;
  const cx = 100;
  const cy = 100;
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const len = Math.PI * r;
  const at = (p: number, rad: number) => {
    const a = Math.PI * (1 - p / 100);
    return [cx + rad * Math.cos(a), cy - rad * Math.sin(a)];
  };
  const [ax1, ay1] = alert !== undefined ? at(alert, r - 18) : [0, 0];
  const [ax2, ay2] = alert !== undefined ? at(alert, r + 18) : [0, 0];

  return (
    <div data-slot="gauge-chart" className={cn("relative mx-auto w-full max-w-72", className)} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} {...props}>
      <svg viewBox="0 0 200 112" className="w-full overflow-visible">
        <defs>
          <DitherPattern id={id} variant="fine" />
          <mask id={`${id}-m`}>
            <path d={arc} fill="none" stroke="white" strokeWidth={22} />
          </mask>
        </defs>
        <rect x="0" y="0" width="200" height="112" fill={`url(#${id})`} mask={`url(#${id}-m)`} />
        <path d={arc} fill="none" style={{ stroke: "var(--chart-1)" }} strokeWidth={22} strokeDasharray={`${(v / 100) * len} ${len}`} />
        {alert !== undefined ? <line x1={ax1} y1={ay1} x2={ax2} y2={ay2} style={{ stroke: "var(--foreground)" }} strokeWidth={1.5} /> : null}
      </svg>
      {alert !== undefined ? (
        <span
          className="absolute inline-flex h-4 -translate-y-full items-center rounded-hairline bg-foreground px-1.5 font-mono text-[10px] font-medium whitespace-nowrap text-primary-foreground"
          style={{ left: `${(ax2 / 200) * 100}%`, top: `${(ay2 / 112) * 100}%` }}
        >
          ALERT {alert}%
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <span className="font-heading text-4xl leading-none font-semibold tracking-tight tabular">{display ?? `${Math.round(v)}%`}</span>
        {caption ? <span className="mt-1 font-mono text-[11px] text-muted-foreground tabular">{caption}</span> : null}
      </div>
      {minLabel || maxLabel ? (
        <div className="mt-1 flex justify-between px-[6%] font-mono text-[11px] text-muted-foreground tabular">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
