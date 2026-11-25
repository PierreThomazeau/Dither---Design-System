import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { RankingChart } from "@/registry/dither/charts/ranking-chart";

export default function ChartRanking() {
  return (
    <ChartCard
      title="Return by product"
      subtitle="Revenue per € of cost · Q4"
      action="Q4 2026"
      legend={<ChartLegend items={[{ label: "Top product" }, { label: "Profitable", tone: "bg-foreground/85" }, { label: "Below break-even", tone: "bg-destructive" }]} />}
    >
      <RankingChart
        max={3}
        breakEven={1}
        data={[
          { label: "Enterprise", value: 2.8 },
          { label: "Pro", value: 2.4 },
          { label: "Teams", value: 2.1 },
          { label: "Starter", value: 1.4 },
          { label: "Add-ons", value: 1.1 },
          { label: "Legacy", value: 0.8 },
        ]}
      />
    </ChartCard>
  );
}
