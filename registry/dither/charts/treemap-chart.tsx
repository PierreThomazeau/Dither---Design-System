import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

export interface TreemapItem {
  label: string;
  value: number;
  /** Tailwind background class; omit on the "unassigned" item to draw it in dither. */
  tone?: string;
  /** Draw this tile in dither (unassigned, other…). */
  unassigned?: boolean;
}

export interface TreemapChartProps extends React.ComponentProps<"div"> {
  items: TreemapItem[];
  format?: (n: number) => string;
  height?: number;
}

type Rect = { x: number; y: number; w: number; h: number };

/** Squarified treemap layout (Bruls et al.) in a 0–100 box. */
function squarify(values: number[], box: Rect): Rect[] {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const area = box.w * box.h;
  const scaled = values.map((v) => (v / total) * area);
  const out: Rect[] = [];
  let rect = { ...box };
  let row: number[] = [];
  const worst = (r: number[], side: number) => {
    const s = r.reduce((a, b) => a + b, 0);
    const mx = Math.max(...r);
    const mn = Math.min(...r);
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  const layout = (r: number[]) => {
    const s = r.reduce((a, b) => a + b, 0);
    if (rect.w >= rect.h) {
      const w = s / rect.h;
      let y = rect.y;
      for (const v of r) {
        const h = v / w;
        out.push({ x: rect.x, y, w, h });
        y += h;
      }
      rect = { x: rect.x + w, y: rect.y, w: rect.w - w, h: rect.h };
    } else {
      const h = s / rect.w;
      let x = rect.x;
      for (const v of r) {
        const w = v / h;
        out.push({ x, y: rect.y, w, h });
        x += w;
      }
      rect = { x: rect.x, y: rect.y + h, w: rect.w, h: rect.h - h };
    }
  };
  for (const v of scaled) {
    const side = Math.min(rect.w, rect.h);
    if (row.length === 0 || worst([...row, v], side) <= worst(row, side)) {
      row.push(v);
    } else {
      layout(row);
      row = [v];
    }
  }
  if (row.length) layout(row);
  return out;
}

const DEFAULT_TONES = ["bg-chart-1", "bg-chart-4", "bg-chart-3", "bg-chart-5", "bg-chart-2"];

function assignTones(items: TreemapItem[]) {
  let n = 0;
  return items.map((item) => (item.unassigned ? "" : (item.tone ?? DEFAULT_TONES[n++ % DEFAULT_TONES.length])));
}

/** Treemap with labelled tiles; the unassigned share is drawn in dither. */
export function TreemapChart({ items, format = (n) => `${n}`, height = 220, className, ...props }: TreemapChartProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, i) => s + i.value, 0);
  const rects = squarify(sorted.map((i) => i.value), { x: 0, y: 0, w: 100, h: 100 });
  const tones = assignTones(sorted);
  return (
    <div data-slot="treemap-chart" className={cn("relative w-full", className)} style={{ height }} {...props}>
      {sorted.map((item, i) => {
        const r = rects[i];
        const tone = tones[i];
        return (
          <div key={item.label} className="absolute p-0.5" style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}>
            <div
              role="img"
              aria-label={`${item.label}: ${format(item.value)}, ${Math.round((item.value / total) * 100)}%`}
              className={cn(
                "relative flex size-full flex-col overflow-hidden rounded-[6px] p-2 text-xs",
                item.unassigned ? "border border-dashed border-border-strong" : tone,
              )}
            >
              {item.unassigned ? <DitherFill variant="organic" /> : null}
              {/* Label chip on surface: readable on any tile colour, light or dark. */}
              <span className="relative flex max-w-full flex-col self-start rounded-hairline bg-surface/90 px-1.5 py-0.5 text-foreground">
                <span className="truncate font-medium">{item.label}</span>
                <span className="truncate font-mono text-[11px] text-muted-foreground tabular">
                  {format(item.value)} · {Math.round((item.value / total) * 100)}%
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
