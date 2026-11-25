"use client";

import * as React from "react";
import { Area, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

import { axisTick, chartColor, gridProps, SvgTag } from "@/registry/dither/charts/chart-kit";
import { ChartTooltipContent } from "@/registry/dither/charts/chart-tooltip";
import { DitherPattern } from "@/registry/dither/lib/dither";

export interface ForecastDatum {
  label: string;
  /** Actual value (until today). */
  actual?: number;
  /** Forecast value (from today). */
  forecast?: number;
  /** Confidence range [low, high] around the forecast. */
  range?: [number, number];
}

export interface ForecastChartProps {
  data: ForecastDatum[];
  /** Label of the "today" point (vertical line + TODAY tag). */
  today?: string;
  format?: (n: number) => string;
  height?: number;
  className?: string;
}

/** Actuals in chart-1, forecast dashed, confidence band in dither, a TODAY marker. */
export function ForecastChart({ data, today, format = (n) => `${n}`, height = 220, className }: ForecastChartProps) {
  const id = `forecast-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <div data-slot="forecast-chart" className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <DitherPattern id={id} variant="fine" />
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} width={44} tickFormatter={format} />
          <Tooltip content={<ChartTooltipContent format={(v) => format(Number(v))} />} cursor={{ stroke: chartColor.grid }} />
          <Area dataKey="range" name="Confidence range" stroke="none" fill={`url(#${id})`} isAnimationActive={false} />
          <Line dataKey="actual" name="Actual" stroke={chartColor.highlight} strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line dataKey="forecast" name="Forecast" stroke={chartColor.neutral} strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
          {today ? (
            <ReferenceLine
              x={today}
              stroke={chartColor.neutral}
              strokeDasharray="2 3"
              label={(props: { viewBox?: { x?: number; y?: number; height?: number } }) => {
                const vb = props.viewBox ?? {};
                return <SvgTag x={vb.x ?? 0} y={(vb.y ?? 0) + (vb.height ?? 0) - 10} text="Today" />;
              }}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
