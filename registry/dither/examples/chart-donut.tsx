import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { DonutChart } from "@/registry/dither/charts/donut-chart";

export default function ChartDonut() {
  return (
    <ChartCard title="Q4 cost breakdown" subtitle="Spend by category" action="Q4 2026">
      <DonutChart
        value="€2.4M"
        caption="Q4 budget"
        format={(n) => `€${n}k`}
        segments={[
          { label: "Payroll", value: 816 },
          { label: "Software", value: 576 },
          { label: "Office", value: 432 },
          { label: "Travel", value: 240 },
          { label: "Unallocated", value: 336, unallocated: true },
        ]}
      />
    </ChartCard>
  );
}
