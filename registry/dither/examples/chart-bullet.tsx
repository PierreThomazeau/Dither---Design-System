import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { BulletChart } from "@/registry/dither/charts/bullet-chart";

export default function ChartBullet() {
  return (
    <ChartCard
      title="KPI vs. target"
      subtitle="Q4 to date · Company goals"
      action="Q4 2026"
      legend={
        <ChartLegend
          items={[
            { label: "On track", tone: "bg-foreground/85" },
            { label: "Behind target", tone: "bg-chart-4" },
            { label: "Expected range", tone: "bg-background-muted" },
            { label: "Stretch", kind: "dither" },
          ]}
        />
      }
    >
      <BulletChart
        data={[
          { label: "Revenue", caption: "Target €6.0M", display: "€5.6M", value: 74, target: 80, range: [60, 85] },
          { label: "Gross margin", caption: "Target 44%", display: "46%", value: 82, target: 78, range: [65, 90] },
          { label: "Activation", caption: "Target 75%", display: "68%", value: 65, target: 72, range: [55, 80] },
          { label: "Cost per customer", caption: "Target €20", display: "€18", value: 40, target: 46, range: [30, 55] },
        ]}
      />
    </ChartCard>
  );
}
