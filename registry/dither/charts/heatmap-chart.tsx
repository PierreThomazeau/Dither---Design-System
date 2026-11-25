import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

const LEVELS = ["", "bg-chart-1/25", "bg-chart-1/50", "bg-chart-1/75", "bg-chart-1"] as const;

export interface HeatmapChartProps extends React.ComponentProps<"div"> {
  /** values[row][col]; 0 = empty cell (dither). */
  values: number[][];
  rowLabels: string[];
  /** Labels above some columns: { index: label }. */
  columnLabels?: Record<number, string>;
  /** Upper bounds for levels 1–3; above = level 4. */
  thresholds?: [number, number, number];
  unit?: string;
}

function level(v: number, [a, b, c]: [number, number, number]) {
  if (v <= 0) return 0;
  if (v <= a) return 1;
  if (v <= b) return 2;
  if (v <= c) return 3;
  return 4;
}

/** Matrix heatmap that stretches to its container; empty cells in dither, four chart-1 levels. */
export function HeatmapChart({ values, rowLabels, columnLabels = {}, thresholds = [2, 5, 8], unit = "", className, ...props }: HeatmapChartProps) {
  const cols = values[0]?.length ?? 0;
  return (
    <div data-slot="heatmap-chart" className={cn("grid gap-1", className)} style={{ gridTemplateColumns: `2rem repeat(${cols}, minmax(0, 1fr))` }} {...props}>
      <span />
      {Array.from({ length: cols }, (_, c) => (
        <span key={c} className="overflow-visible font-mono text-[11px] whitespace-nowrap text-muted-foreground">{columnLabels[c] ?? ""}</span>
      ))}
      {values.map((row, r) => (
        <React.Fragment key={r}>
          <span className="self-center font-mono text-[11px] text-muted-foreground">{rowLabels[r]}</span>
          {row.map((v, c) => {
            const l = level(v, thresholds);
            return (
              <span
                key={c}
                title={`${rowLabels[r]} · ${v}${unit ? ` ${unit}` : ""}`}
                className={cn("aspect-square w-full max-w-6 justify-self-center rounded-[4px]", l === 0 ? "bg-dither-fine" : LEVELS[l])}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
