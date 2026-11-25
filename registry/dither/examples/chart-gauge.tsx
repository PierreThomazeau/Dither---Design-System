import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { GaugeChart } from "@/registry/dither/charts/gauge-chart";

export default function ChartGauge() {
  return (
    <ChartCard
      title="Budget consumption"
      subtitle="Q4 budget used to date"
      action="Q4 2026"
      legend={<ChartLegend items={[{ label: "Spent" }, { label: "Remaining", kind: "dither" }]} />}
    >
      <GaugeChart value={72} alert={90} caption="€1.73M of €2.4M" minLabel="€0" maxLabel="€2.4M" />
    </ChartCard>
  );
}
