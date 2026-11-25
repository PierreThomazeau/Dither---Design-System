"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { axisTick, chartColor, gridProps } from "@/registry/dither/charts/chart-kit";
import { ChartTooltipContent } from "@/registry/dither/charts/chart-tooltip";

export interface StackedSeries {
  key: string;
  label: string;
  /** CSS colour; defaults: chart-1, chart-4, chart-3, chart-5. */
  color?: string;
}

export interface StackedAreaProps {
  data: Record<string, number | string>[];
  /** Key of the x value in each datum. */
  xKey: string;
  series: StackedSeries[];
  format?: (n: number) => string;
  height?: number;
  className?: string;
}

const DEFAULTS = [chartColor.highlight, chartColor.secondary, chartColor.tertiary, "var(--chart-5)"];

/** Stacked areas, highlighted series at the bottom, a thin total line on top. */
export function StackedArea({ data, xKey, series, format = (n) => `${n}`, height = 220, className }: StackedAreaProps) {
  const withTotal = data.map((d) => ({ ...d, __total: series.reduce((s, x) => s + Number(d[x.key] ?? 0), 0) }));
  return (
    <div data-slot="stacked-area" className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={withTotal} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} width={44} tickFormatter={format} />
          <Tooltip content={<ChartTooltipContent format={(v) => format(Number(v))} />} cursor={{ stroke: chartColor.grid }} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="stack"
              stroke="var(--surface)"
              strokeWidth={1}
              fill={s.color ?? DEFAULTS[i % DEFAULTS.length]}
              fillOpacity={1}
              isAnimationActive={false}
            />
          ))}
          <Area dataKey="__total" name="Total" stroke={chartColor.neutral} strokeWidth={1.5} fill="none" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
