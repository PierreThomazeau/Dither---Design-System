import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { Histogram } from "@/registry/dither/charts/histogram";

const bins = [2, 3, 4, 6, 8, 11, 14, 18, 24, 29, 31, 27, 22, 17, 12, 9, 7, 5, 4, 3, 2, 2, 1, 1];

export default function ChartHistogram() {
  return (
    <ChartCard
      title="Order value distribution"
      subtitle="Last 30 days · 28k orders"
      action="Last 30 days"
      legend={<ChartLegend items={[{ label: "Core range €40–90" }, { label: "Outside range", kind: "dither" }]} />}
    >
      <Histogram bins={bins} start={0} step={6.25} core={[7, 14]} median={64} format={(n) => `€${Math.round(n)}`} formatY={(n) => `${n}`} />
    </ChartCard>
  );
}
