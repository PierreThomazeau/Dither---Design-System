import * as React from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * Dither chart kit (grammar 7): card, legend, tags, delta chip, axis.
 * ------------------------------------------------------------------ */

/** Tailwind classes for the chart roles. One highlighted series, the rest neutral. */
export const chartTone = {
  highlight: "bg-chart-1",
  neutral: "bg-foreground/85",
  muted: "bg-border-strong",
  positive: "bg-positive",
  negative: "bg-destructive",
  secondary: "bg-chart-4",
} as const;

/** The same roles as SVG paint values (for Recharts props). */
export const chartColor = {
  highlight: "var(--chart-1)",
  neutral: "var(--foreground)",
  muted: "var(--border-strong)",
  positive: "var(--positive)",
  negative: "var(--destructive)",
  secondary: "var(--chart-4)",
  tertiary: "var(--chart-3)",
  grid: "var(--border)",
} as const;

/** Recharts axis tick: mono xs, muted. */
export const axisTick = {
  fontFamily: "var(--dither-font-mono)",
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const;

/** Recharts grid: dotted, border colour, horizontal only. */
export const gridProps = {
  stroke: "var(--border)",
  strokeDasharray: "1 3",
  vertical: false,
} as const;

export interface ChartCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Period selector label (renders an outline button with a chevron) or any node. */
  action?: React.ReactNode;
  legend?: React.ReactNode;
}

/** Card header: title text-lg semibold, subtitle muted, period button on the right. Legend at the bottom. */
export function ChartCard({ title, subtitle, action, legend, className, children, ...props }: ChartCardProps) {
  return (
    <div data-slot="chart-card" className={cn("flex w-full min-w-0 flex-col gap-5 rounded-surface border bg-surface p-5 shadow-xs", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-lg leading-7 font-semibold tracking-tight">{title}</span>
          {subtitle ? <span className="text-sm text-muted-foreground">{subtitle}</span> : null}
        </div>
        {typeof action === "string" ? <PeriodButton>{action}</PeriodButton> : action}
      </div>
      <div className="min-w-0">{children}</div>
      {legend}
    </div>
  );
}

/** Outline sm button with a chevron, used as the period selector. */
export function PeriodButton({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-control-sm shrink-0 items-center gap-1.5 rounded-control border bg-surface px-3 text-sm font-medium shadow-xs outline-none hover:bg-hover focus-visible:shadow-focus",
        className,
      )}
      {...props}
    >
      {children}
      <Icon icon={ArrowDown01Icon} className="text-muted-foreground" />
    </button>
  );
}

export type LegendKind = "square" | "dither" | "line" | "dashed";

export interface LegendItem {
  label: React.ReactNode;
  kind?: LegendKind;
  /** Tailwind background class for square / line (e.g. "bg-chart-1"). */
  tone?: string;
}

/** 10px squares (rounded 2px); the dither entry uses a mini dither swatch. */
export function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul data-slot="chart-legend" className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <LegendSwatch kind={item.kind ?? "square"} tone={item.tone} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function LegendSwatch({ kind, tone = chartTone.highlight }: { kind: LegendKind; tone?: string }) {
  if (kind === "dither") return <span className="bg-dither-fine size-2.5 rounded-[2px] ring-1 ring-border ring-inset" />;
  if (kind === "line") return <span className={cn("h-0.5 w-3 rounded-full", tone)} />;
  if (kind === "dashed") return <span className="w-3 border-t-2 border-dashed border-foreground" />;
  return <span className={cn("size-2.5 rounded-[2px]", tone)} />;
}

/** Black annotation tag: TARGET 70%, TODAY, ALERT 90%… */
export function ChartTag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chart-tag"
      className={cn("inline-flex h-4 items-center rounded-hairline bg-foreground px-1.5 font-mono text-[10px] leading-none font-medium whitespace-nowrap text-primary-foreground uppercase", className)}
      {...props}
    />
  );
}

/** Delta chip: surface, 1px border, rounded 6px, a 6px coloured square + mono text. */
export function DeltaChip({ tone = chartTone.positive, className, children, ...props }: React.ComponentProps<"span"> & { tone?: string }) {
  return (
    <span
      data-slot="delta-chip"
      className={cn("inline-flex h-5 items-center gap-1.5 rounded-micro border bg-surface px-1.5 font-mono text-[11px] whitespace-nowrap text-foreground tabular shadow-2xs", className)}
      {...props}
    >
      <span className={cn("size-1.5 rounded-[1px]", tone)} />
      {children}
    </span>
  );
}

/** SVG version of the black tag, for Recharts labels. Width is estimated from the text length. */
export function SvgTag({ x, y, text, anchor = "middle" }: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" }) {
  const w = text.length * 6.2 + 10;
  const h = 16;
  const left = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={left} y={y - h / 2} width={w} height={h} rx={4} style={{ fill: "var(--foreground)" }} />
      <text
        x={left + w / 2}
        y={y + 3.5}
        textAnchor="middle"
        style={{ fill: "var(--primary-foreground)", fontFamily: "var(--dither-font-mono)", fontSize: 10, fontWeight: 500 }}
      >
        {text.toUpperCase()}
      </text>
    </g>
  );
}

/** "Nice" axis maximum and ticks for HTML charts. */
export function niceScale(max: number, count = 4) {
  if (max <= 0) return { max: 1, ticks: [0, 1] };
  const raw = max / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(6));
  return { max: top, ticks };
}

/** Y axis + dotted gridlines behind an HTML plot area. Children are positioned inside the plot. */
export function HtmlPlot({
  ticks,
  max,
  format = (n) => `${n}`,
  height = 200,
  className,
  children,
}: {
  ticks: number[];
  max: number;
  format?: (n: number) => string;
  height?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative mt-6 flex gap-2", className)} style={{ height }}>
      <div className="relative w-8 shrink-0 font-mono text-[11px] text-muted-foreground tabular">
        {ticks.map((t) => (
          <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / max) * 100}%` }}>
            {format(t)}
          </span>
        ))}
      </div>
      <div className="relative flex-1">
        {ticks.map((t) => (
          <span key={t} aria-hidden="true" className="absolute inset-x-0 border-t border-dotted border-border" style={{ bottom: `${(t / max) * 100}%` }} />
        ))}
        {children}
      </div>
    </div>
  );
}
