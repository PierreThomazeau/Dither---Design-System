import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

export interface CapacitySegment {
  label: string;
  value: number;
  /** Tailwind background class; defaults: chart-1, then chart-4. */
  tone?: string;
}

export interface CapacityBarProps extends React.ComponentProps<"div"> {
  total: number;
  segments: CapacitySegment[];
  /** Big total, e.g. "240h". */
  display?: React.ReactNode;
  caption?: React.ReactNode;
  /** Formats segment values (default `${n}`). */
  format?: (n: number) => string;
}

const DEFAULT_TONES = ["bg-chart-1", "bg-chart-4", "bg-informative", "bg-foreground/85"];

/** Capacity split in segments; the free part is dither. Each segment is labelled above with % and value. */
export function CapacityBar({ total, segments, display, caption, format = (n) => `${n}`, className, ...props }: CapacityBarProps) {
  const used = segments.reduce((s, x) => s + x.value, 0);
  const free = Math.max(0, total - used);
  const cols = [
    ...segments.map((s, i) => ({ ...s, tone: s.tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length], free: false })),
    ...(free > 0 ? [{ label: "Free", value: free, tone: "", free: true }] : []),
  ];
  return (
    <div data-slot="capacity-bar" className={cn("flex flex-col gap-5", className)} {...props}>
      {display ? (
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-4xl leading-none font-semibold tracking-tight tabular">{display}</span>
          {caption ? <span className="text-sm text-muted-foreground">{caption}</span> : null}
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <div className="flex">
          {cols.map((c) => (
            <div key={c.label} className="flex min-w-0 flex-col gap-0.5 border-l border-dotted border-border-strong pb-6 pl-2 first:border-l-0 first:pl-0" style={{ width: `${(c.value / total) * 100}%` }}>
              <span className="font-mono text-xs font-medium tabular">{Math.round((c.value / total) * 100)}%</span>
              <span className="truncate font-mono text-[11px] text-muted-foreground tabular">{format(c.value)}</span>
            </div>
          ))}
        </div>
        <div role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={used} aria-label="Capacity used" className="flex h-3 gap-1">
          {cols.map((c) => (
            <span key={c.label} className={cn("relative h-full overflow-hidden rounded-[3px]", !c.free && c.tone)} style={{ width: `${(c.value / total) * 100}%` }}>
              {c.free ? <DitherFill variant="organic" /> : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
