"use client";

import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ComboChart } from "@/registry/dither/charts/combo-chart";

export default function ChartCombo() {
  return (
    <ChartCard
      title="Costs & margin"
      subtitle="Monthly costs with gross margin"
      action="2026"
      legend={<ChartLegend items={[{ label: "Costs", tone: "bg-border-strong" }, { label: "Margin", kind: "line" }, { label: "Budget cap", kind: "dither" }]} />}
    >
      <ComboChart
        formatBar={(n) => `€${n}M`}
        data={[
          { label: "Jun", bar: 1.6, cap: 2.8, line: 41 },
          { label: "Jul", bar: 1.9, cap: 2.8, line: 39 },
          { label: "Aug", bar: 1.4, cap: 2.8, line: 44 },
          { label: "Sep", bar: 2.1, cap: 2.8, line: 45 },
          { label: "Oct", bar: 2.2, cap: 2.8, line: 46 },
          { label: "Nov", bar: 2.0, cap: 2.8, line: 47 },
        ]}
      />
    </ChartCard>
  );
}
