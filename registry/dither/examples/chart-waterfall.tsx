import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { WaterfallChart } from "@/registry/dither/charts/waterfall-chart";

export default function ChartWaterfall() {
  return (
    <ChartCard
      title="Revenue bridge"
      subtitle="Q3 → Q4 revenue drivers"
      action="Q4 2026"
      legend={<ChartLegend items={[{ label: "Total", tone: "bg-foreground" }, { label: "Increase", tone: "bg-positive" }, { label: "Decrease", tone: "bg-destructive" }, { label: "Headroom", kind: "dither" }]} />}
    >
      <WaterfallChart
        delta="+26% QoQ"
        format={(n) => `€${n.toFixed(1)}M`}
        steps={[
          { label: "Q3", value: 4.6, kind: "total" },
          { label: "New", value: 0.9 },
          { label: "Upsell", value: 0.5 },
          { label: "Churn", value: -0.6 },
          { label: "Pricing", value: 0.4 },
          { label: "Q4", value: 5.8, kind: "total" },
        ]}
      />
    </ChartCard>
  );
}
