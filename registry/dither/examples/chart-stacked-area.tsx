"use client";

import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { StackedArea } from "@/registry/dither/charts/stacked-area";

const data = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  subscriptions: 1.6 + i * 0.08 + Math.sin(i / 2) * 0.1,
  services: 1.0 + i * 0.05 + Math.cos(i / 3) * 0.1,
  addons: 0.5 + i * 0.04,
}));

export default function ChartStackedArea() {
  return (
    <ChartCard
      title="Revenue by stream"
      subtitle="Weekly revenue · stacked"
      action="Last 12 weeks"
      legend={<ChartLegend items={[{ label: "Subscriptions" }, { label: "Services", tone: "bg-chart-4" }, { label: "Add-ons", tone: "bg-chart-3" }, { label: "Total", kind: "line", tone: "bg-foreground" }]} />}
    >
      <StackedArea
        data={data}
        xKey="week"
        format={(n) => `€${n.toFixed(0)}M`}
        series={[
          { key: "subscriptions", label: "Subscriptions" },
          { key: "services", label: "Services" },
          { key: "addons", label: "Add-ons" },
        ]}
      />
    </ChartCard>
  );
}
