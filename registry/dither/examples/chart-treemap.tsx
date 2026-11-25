import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { TreemapChart } from "@/registry/dither/charts/treemap-chart";

export default function ChartTreemap() {
  return (
    <ChartCard title="Revenue by region" subtitle="Q4 revenue · €2.4M" action="Q4 2026">
      <TreemapChart
        format={(n) => `€${n}k`}
        items={[
          { label: "France", value: 720 },
          { label: "Germany", value: 480 },
          { label: "UK", value: 360 },
          { label: "Spain", value: 240 },
          { label: "Italy", value: 264 },
          { label: "Unassigned", value: 336, unassigned: true },
        ]}
      />
    </ChartCard>
  );
}
