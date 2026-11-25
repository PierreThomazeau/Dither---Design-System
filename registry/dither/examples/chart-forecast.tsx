"use client";

import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ForecastChart } from "@/registry/dither/charts/forecast-chart";

const actual = [2.4, 2.6, 2.5, 2.9, 3.1, 3.0, 3.4, 3.6, 3.5, 3.9, 4.2, 4.4];
const data = [
  ...actual.map((v, i) => ({ label: `W${i + 1}`, actual: v, ...(i === actual.length - 1 ? { forecast: v, range: [v, v] as [number, number] } : {}) })),
  ...[4.6, 4.8, 5.0, 5.2].map((v, i) => ({ label: `W${i + 13}`, forecast: v, range: [v - 0.25 * (i + 1), v + 0.25 * (i + 1)] as [number, number] })),
];

export default function ChartForecast() {
  return (
    <ChartCard
      title="Revenue"
      subtitle="Weekly actuals and 4-week forecast"
      action="Last 12 weeks"
      legend={<ChartLegend items={[{ label: "Actual", kind: "line" }, { label: "Forecast", kind: "dashed" }, { label: "Confidence range", kind: "dither" }]} />}
    >
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-heading text-4xl leading-none font-semibold tracking-tight tabular">€5.6M</span>
        <span className="text-sm text-muted-foreground">projected · week 16</span>
      </div>
      <ForecastChart data={data} today="W12" format={(n) => `€${n}M`} />
    </ChartCard>
  );
}
