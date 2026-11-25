import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ColumnChart } from "@/registry/dither/charts/column-chart";

export default function ChartColumn() {
  return (
    <ChartCard
      title="Delivery by sprint"
      subtitle="Story points shipped vs. planned"
      action="Last 6 sprints"
      legend={<ChartLegend items={[{ label: "Shipped", tone: "bg-foreground/85" }, { label: "Current sprint" }, { label: "Planned", kind: "dither" }]} />}
    >
      <ColumnChart
        delta="84% shipped"
        data={[
          { label: "S19", planned: 40, actual: 34 },
          { label: "S20", planned: 46, actual: 44 },
          { label: "S21", planned: 40, actual: 28 },
          { label: "S22", planned: 44, actual: 42 },
          { label: "S23", planned: 48, actual: 45 },
          { label: "S24", planned: 50, actual: 42 },
        ]}
      />
    </ChartCard>
  );
}
