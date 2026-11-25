"use client";

import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ScatterChart } from "@/registry/dither/charts/scatter-chart";

const points = [
  { x: 20, y: 0.6, z: 4 }, { x: 35, y: 0.9, z: 3 }, { x: 48, y: 0.5, z: 6 }, { x: 60, y: 1.4, z: 5 },
  { x: 70, y: 1.8, z: 8 }, { x: 82, y: 2.2, z: 4 }, { x: 95, y: 1.1, z: 3 }, { x: 140, y: 0.4, z: 2 },
  { x: 160, y: 0.5, z: 2 },
  { x: 115, y: 2.6, z: 6, highlight: true }, { x: 130, y: 2.2, z: 4, highlight: true }, { x: 150, y: 2.5, z: 9, highlight: true },
  { x: 170, y: 2.7, z: 7, highlight: true }, { x: 185, y: 2.1, z: 3, highlight: true }, { x: 125, y: 2.9, z: 2, highlight: true },
];

export default function ChartScatter() {
  return (
    <ChartCard
      title="Effort vs. impact"
      subtitle="Projects · bubble size = team size"
      action="2026"
      legend={<ChartLegend items={[{ label: "Big bets" }, { label: "Other projects", tone: "bg-foreground/85" }, { label: "Opportunity zone", kind: "dither" }]} />}
    >
      <ScatterChart data={points} zone={{ x1: 100, x2: 200, y1: 1.8, y2: 3, label: "Big bets" }} formatX={(n) => `${n} d`} />
    </ChartCard>
  );
}
