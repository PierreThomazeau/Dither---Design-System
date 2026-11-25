import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { SplitBar } from "@/registry/dither/charts/split-bar";

export default function ChartSplitBar() {
  return (
    <ChartCard
      title="Budget changes"
      subtitle="Recommended shift vs. current plan"
      action="Plan B"
      legend={<ChartLegend items={[{ label: "Reduce", tone: "bg-destructive" }, { label: "Increase", tone: "bg-positive" }, { label: "Range", kind: "dither" }]} />}
    >
      <SplitBar
        format={(n) => `€${n}k`}
        data={[
          { label: "Events", value: -400 },
          { label: "Office", value: -150 },
          { label: "Travel", value: -80 },
          { label: "Software", value: 120 },
          { label: "Hiring", value: 300 },
          { label: "Training", value: 210 },
        ]}
      />
    </ChartCard>
  );
}
