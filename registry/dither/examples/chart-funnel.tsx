import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { FunnelChart } from "@/registry/dither/charts/funnel-chart";

export default function ChartFunnel() {
  return (
    <ChartCard
      title="Conversion funnel"
      subtitle="From visit to paid plan · last 30 days"
      action="Last 30 days"
      legend={<ChartLegend items={[{ label: "Converted", tone: "bg-foreground/85" }, { label: "Paid" }, { label: "Drop-off", kind: "dither" }]} />}
    >
      <FunnelChart
        stages={[
          { label: "Visitors", value: 1_200_000 },
          { label: "Sign-ups", value: 384_000 },
          { label: "Activated", value: 96_000 },
          { label: "Trial", value: 41_000 },
          { label: "Paid", value: 28_000 },
        ]}
      />
    </ChartCard>
  );
}
