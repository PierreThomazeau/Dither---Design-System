"use client";

import * as React from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { axisTick, chartColor, gridProps } from "@/registry/dither/charts/chart-kit";
import { ChartTooltipContent } from "@/registry/dither/charts/chart-tooltip";
import { DitherPattern } from "@/registry/dither/lib/dither";

export interface ComboDatum {
  label: string;
  /** Bar value (left axis). */
  bar: number;
  /** Cap drawn behind the bar in dither (left axis). */
  cap?: number;
  /** Line value (right axis). */
  line: number;
}

export interface ComboChartProps {
  data: ComboDatum[];
  barLabel?: string;
  lineLabel?: string;
  formatBar?: (n: number) => string;
  formatLine?: (n: number) => string;
  height?: number;
  className?: string;
}

/** Bars (neutral, with a dither cap behind) and a chart-1 line on a second axis. */
export function ComboChart({
  data,
  barLabel = "Costs",
  lineLabel = "Margin",
  formatBar = (n) => `${n}`,
  formatLine = (n) => `${n}%`,
  height = 220,
  className,
}: ComboChartProps) {
  const id = `combo-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const rows = data.map((d) => ({ ...d, headroom: d.cap !== undefined ? Math.max(0, d.cap - d.bar) : 0 }));
  return (
    <div data-slot="combo-chart" className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 12, right: 0, bottom: 0, left: 0 }} barCategoryGap="28%">
          <defs>
            <DitherPattern id={id} variant="fine" />
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
          <YAxis yAxisId="bar" tick={axisTick} tickLine={false} axisLine={false} width={40} tickFormatter={formatBar} />
          <YAxis yAxisId="line" orientation="right" tick={axisTick} tickLine={false} axisLine={false} width={36} tickFormatter={formatLine} />
          <Tooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--background-muted)", opacity: 0.5 }} />
          <Bar yAxisId="bar" dataKey="bar" name={barLabel} stackId="b" fill={chartColor.muted} radius={[0, 0, 4, 4]} isAnimationActive={false} />
          <Bar yAxisId="bar" dataKey="headroom" name="Budget cap" stackId="b" fill={`url(#${id})`} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Line
            yAxisId="line"
            dataKey="line"
            name={lineLabel}
            stroke={chartColor.highlight}
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--surface)", stroke: chartColor.highlight, strokeWidth: 1.5 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
