"use client";

import * as React from "react";

interface TooltipEntry {
  name?: string | number;
  value?: number | string | (number | string)[];
  color?: string;
  dataKey?: string | number | ((obj: unknown) => unknown);
}

/** Recharts tooltip content in Dither style: surface, border, chart-tooltip shadow, mono values. */
export function ChartTooltipContent({
  active,
  payload,
  label,
  format = (v) => `${v}`,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  format?: (v: number | string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-32 rounded-control border bg-surface px-3 py-2 text-xs shadow-chart-tooltip">
      {label !== undefined ? <div className="mb-1 font-mono text-muted-foreground">{label}</div> : null}
      <ul className="flex flex-col gap-1">
        {payload
          .filter((p) => p.value !== undefined && !Array.isArray(p.value))
          .map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="size-2 rounded-[2px]" style={{ background: p.color }} />
              <span className="flex-1 text-muted-foreground">{p.name}</span>
              <span className="font-mono font-medium tabular">{format(p.value as number)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
