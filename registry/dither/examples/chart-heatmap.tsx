import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { HeatmapChart } from "@/registry/dither/charts/heatmap-chart";

const rows = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const values = rows.map((_, r) =>
  Array.from({ length: 12 }, (_, c) => {
    const v = Math.round(Math.sin((r + 1) * (c + 2)) * 5 + 5 - (r > 4 ? 4 : 0));
    return Math.max(0, v);
  }),
);

export default function ChartHeatmap() {
  return (
    <ChartCard
      title="Workspace activity"
      subtitle="Sessions per day · last 12 weeks"
      action="Last 12 weeks"
      legend={<ChartLegend items={[{ label: "No activity", kind: "dither" }, { label: "Low", tone: "bg-chart-1/25" }, { label: "High" }]} />}
    >
      <HeatmapChart values={values} rowLabels={rows} columnLabels={{ 0: "Sep", 4: "Oct", 8: "Nov" }} unit="sessions" />
    </ChartCard>
  );
}
