"use client";

import * as React from "react";
import { CartesianGrid, ReferenceArea, ResponsiveContainer, Scatter, ScatterChart as RScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import { axisTick, chartColor, gridProps, SvgTag } from "@/registry/dither/charts/chart-kit";
import { DitherPattern } from "@/registry/dither/lib/dither";

export interface ScatterDatum {
  x: number;
  y: number;
  /** Bubble size. */
  z?: number;
  label?: string;
  /** Highlighted points (chart-1), e.g. inside the opportunity zone. */
  highlight?: boolean;
}

export interface ScatterChartProps {
  data: ScatterDatum[];
  /** Opportunity zone drawn in dither, with a tag. */
  zone?: { x1: number; x2: number; y1: number; y2: number; label?: string };
  formatX?: (n: number) => string;
  formatY?: (n: number) => string;
  height?: number;
  className?: string;
}

/** Bubble scatter: highlighted points in chart-1, others neutral, an opportunity zone in dither. */
export function ScatterChart({ data, zone, formatX = (n) => `${n}`, formatY = (n) => `${n}`, height = 240, className }: ScatterChartProps) {
  const id = `scatter-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <div data-slot="scatter-chart" className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RScatterChart margin={{ top: 16, right: 20, bottom: 0, left: 4 }}>
          <defs>
            <DitherPattern id={id} variant="fine" />
          </defs>
          <CartesianGrid {...gridProps} vertical />
          <XAxis type="number" dataKey="x" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatX} />
          <YAxis type="number" dataKey="y" tick={axisTick} tickLine={false} axisLine={false} width={40} tickFormatter={formatY} />
          <ZAxis type="number" dataKey="z" range={[30, 260]} />
          {zone ? (
            <ReferenceArea
              x1={zone.x1}
              x2={zone.x2}
              y1={zone.y1}
              y2={zone.y2}
              fill={`url(#${id})`}
              fillOpacity={1}
              stroke="none"
              label={(props: { viewBox?: { x?: number; y?: number; width?: number } }) => {
                const vb = props.viewBox ?? {};
                return zone.label ? <SvgTag x={(vb.x ?? 0) + (vb.width ?? 0) - 4} y={(vb.y ?? 0) + 10} text={zone.label} anchor="end" /> : null;
              }}
            />
          ) : null}
          <Tooltip cursor={{ strokeDasharray: "2 3", stroke: chartColor.grid }} />
          <Scatter data={data.filter((d) => !d.highlight)} fill={chartColor.neutral} fillOpacity={0.85} isAnimationActive={false} />
          <Scatter data={data.filter((d) => d.highlight)} fill={chartColor.highlight} isAnimationActive={false} />
        </RScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
