import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { DitherPattern } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

export interface DonutSegment {
  label: string;
  value: number;
  /** CSS colour (e.g. "var(--chart-1)"). Omit with `unallocated` to draw dither. */
  color?: string;
  unallocated?: boolean;
}

export interface DonutChartProps extends React.ComponentProps<"div"> {
  segments: DonutSegment[];
  /** Centre value (Manrope semibold) and caption (mono). */
  value?: React.ReactNode;
  caption?: React.ReactNode;
  format?: (n: number) => string;
  /** Show the legend table next to the ring. */
  legend?: boolean;
  size?: number;
}

const DEFAULT_COLORS = ["var(--chart-1)", "var(--chart-4)", "var(--chart-3)", "var(--chart-5)", "var(--chart-2)"];

function toArcs(segments: DonutSegment[], total: number, c: number, gap: number, ditherFill: string) {
  const out: (DonutSegment & { color: string; dash: string; offset: number })[] = [];
  let offset = 0;
  let colorIndex = 0;
  for (const s of segments) {
    const len = (s.value / total) * c;
    const color = s.unallocated ? ditherFill : (s.color ?? DEFAULT_COLORS[colorIndex++ % DEFAULT_COLORS.length]);
    out.push({ ...s, color, dash: `${Math.max(0, len - gap)} ${c}`, offset: -offset });
    offset += len;
  }
  return out;
}

/** Donut with gapped arcs; the unallocated share is drawn in dither. Optional legend with % and values. */
export function DonutChart({ segments, value, caption, format = (n) => `${n}`, legend = true, size = 168, className, ...props }: DonutChartProps) {
  const id = `donut-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 40;
  const c = 2 * Math.PI * r;
  const gap = 2.2;
  const arcs = toArcs(segments, total, c, gap, `url(#${id})`);

  return (
    <div data-slot="donut-chart" className={cn("flex flex-wrap items-center gap-6", className)} {...props}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img" aria-label={segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}>
          <defs>
            <DitherPattern id={id} variant="organic" />
          </defs>
          {arcs.map((a) => (
            <circle key={a.label} cx="50" cy="50" r={r} fill="none" stroke={a.color} strokeWidth={12} strokeDasharray={a.dash} strokeDashoffset={a.offset} />
          ))}
        </svg>
        {value ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl leading-8 font-semibold tracking-tight tabular">{value}</span>
            {caption ? <span className="text-xs text-muted-foreground">{caption}</span> : null}
          </div>
        ) : null}
      </div>
      {legend ? (
        <ul className="grid min-w-40 flex-1 grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 gap-y-2 text-sm">
          {arcs.map((a) => (
            <li key={a.label} className="contents">
              {a.unallocated ? (
                <span className="relative size-2.5 overflow-hidden rounded-[2px] ring-1 ring-border ring-inset"><DitherFill variant="fine" /></span>
              ) : (
                <span className="size-2.5 rounded-[2px]" style={{ background: a.color }} />
              )}
              <span className="truncate">{a.label}</span>
              <span className="font-mono text-xs text-muted-foreground tabular">{Math.round((a.value / total) * 100)}%</span>
              <span className="text-right font-mono text-xs font-medium tabular">{format(a.value)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
