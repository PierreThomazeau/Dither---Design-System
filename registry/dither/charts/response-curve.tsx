"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { axisTick, chartColor, gridProps, SvgTag } from "@/registry/dither/charts/chart-kit";
import { ChartTooltipContent } from "@/registry/dither/charts/chart-tooltip";
import { DitherPattern } from "@/registry/dither/lib/dither";

export interface ResponseCurveProps {
  /** Points of the curve, x ascending. */
  data: { x: number; y: number }[];
  /** Saturation zone start (x), drawn in dither to the end with a tag. */
  saturation?: number;
  /** Current point (dot + label). */
  current?: { x: number; label?: string };
  formatX?: (n: number) => string;
  formatY?: (n: number) => string;
  height?: number;
  className?: string;
}

/** Diminishing-returns curve in chart-1, saturation zone in dither, the current point marked. */
export function ResponseCurve({ data, saturation, current, formatX = (n) => `${n}`, formatY = (n) => `${n}`, height = 220, className }: ResponseCurveProps) {
  const id = `curve-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const maxX = data[data.length - 1]?.x ?? 0;
  const currentY = current ? data.reduce((best, p) => (Math.abs(p.x - current.x) < Math.abs(best.x - current.x) ? p : best), data[0]).y : 0;
  return (
    <div data-slot="response-curve" className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <DitherPattern id={id} variant="fine" />
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis type="number" dataKey="x" domain={[0, maxX]} tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatX} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} width={36} tickFormatter={formatY} />
          {saturation !== undefined ? (
            <ReferenceArea
              x1={saturation}
              x2={maxX}
              fill={`url(#${id})`}
              fillOpacity={1}
              stroke="none"
              label={(props: { viewBox?: { x?: number; y?: number; width?: number; height?: number } }) => {
                const vb = props.viewBox ?? {};
                return <SvgTag x={(vb.x ?? 0) + (vb.width ?? 0) / 2} y={(vb.y ?? 0) + (vb.height ?? 0) - 12} text={`Saturation ${formatX(saturation)}`} />;
              }}
            />
          ) : null}
          <Tooltip content={<ChartTooltipContent format={(v) => formatY(Number(v))} />} cursor={{ stroke: chartColor.grid }} labelFormatter={(l) => formatX(Number(l))} />
          <Line dataKey="y" name="Response" type="monotone" stroke={chartColor.highlight} strokeWidth={2} dot={false} isAnimationActive={false} />
          {current ? (
            <ReferenceDot
              x={current.x}
              y={currentY}
              r={4}
              fill="var(--foreground)"
              stroke="var(--surface)"
              strokeWidth={2}
              label={(props: { viewBox?: { x?: number; y?: number } }) => {
                const vb = props.viewBox ?? {};
                return current.label ? <SvgTag x={(vb.x ?? 0) - 8} y={(vb.y ?? 0) - 14} text={current.label} anchor="end" /> : null;
              }}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
