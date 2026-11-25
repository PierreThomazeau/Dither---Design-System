import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ProgressBars } from "@/registry/dither/charts/progress-bars";

export default function ChartProgressBars() {
  return (
    <ChartCard
      title="Lead performance"
      subtitle="Items shipped vs. committed · Sprint 24"
      action="Sprint 24"
      legend={<ChartLegend items={[{ label: "Highlighted lead" }, { label: "Other leads", tone: "bg-border-strong" }, { label: "Remaining", kind: "dither" }]} />}
    >
      <ProgressBars
        highlight={2}
        target={70}
        delta="+12 pts"
        items={[
          { label: "Inès", marker: "I", value: 62 },
          { label: "Hugo", marker: "H", value: 48 },
          { label: "Léa", marker: "L", value: 87 },
          { label: "Malik", marker: "M", value: 34 },
        ]}
      />
    </ChartCard>
  );
}
