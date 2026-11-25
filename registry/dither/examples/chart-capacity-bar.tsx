import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { CapacityBar } from "@/registry/dither/charts/capacity-bar";

export default function ChartCapacityBar() {
  return (
    <ChartCard
      title="Cycle capacity"
      subtitle="Sprint 24 · 4 days left"
      action="This cycle"
      legend={<ChartLegend items={[{ label: "Logged" }, { label: "Planned", tone: "bg-chart-4" }, { label: "Free", kind: "dither" }]} />}
    >
      <CapacityBar
        total={240}
        display="240h"
        caption="team capacity"
        format={(n) => `${n}h`}
        segments={[{ label: "Logged", value: 120 }, { label: "Planned", value: 72 }]}
      />
    </ChartCard>
  );
}
