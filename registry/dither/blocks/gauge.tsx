import * as React from "react";

import { DitherPattern } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

type GaugeStatus = "good" | "warning" | "critical";

const statusClass: Record<GaugeStatus, string> = {
  good: "text-positive",
  warning: "text-chart-1",
  critical: "text-destructive",
};

export interface GaugeProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** 0–100. */
  value: number;
  label?: React.ReactNode;
  status?: GaugeStatus;
  /** Override the centre text (defaults to the value). */
  display?: React.ReactNode;
}

/** Half-ring score gauge. The remaining part of the ring is drawn in dither. */
function Gauge({ value, label, status = "good", display, className, ...props }: GaugeProps) {
  const id = `gauge-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const v = Math.min(100, Math.max(0, value));
  const r = 40;
  const stroke = 10;
  const arc = `M ${50 - r} 50 A ${r} ${r} 0 0 1 ${50 + r} 50`;
  const length = Math.PI * r;

  return (
    <div
      data-slot="gauge"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={typeof label === "string" ? label : undefined}
      className={cn("relative flex w-40 flex-col items-center", className)}
      {...props}
    >
      <svg viewBox="0 0 100 56" className={cn("w-full overflow-visible", statusClass[status])}>
        <defs>
          <DitherPattern id={id} variant="fine" />
          <mask id={`${id}-track`}>
            <path d={arc} fill="none" stroke="white" strokeWidth={stroke} strokeLinecap="round" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100" height="56" fill={`url(#${id})`} mask={`url(#${id}-track)`} />
        <path
          d={arc}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * length} ${length}`}
        />
      </svg>
      <div className="-mt-7 flex flex-col items-center">
        <span className="font-heading text-2xl leading-8 font-semibold tracking-tight tabular">{display ?? Math.round(v)}</span>
        {label ? <span className="text-xs text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  );
}

export { Gauge };
