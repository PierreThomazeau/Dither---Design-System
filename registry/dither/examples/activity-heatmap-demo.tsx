import { ActivityHeatmap } from "@/registry/dither/blocks/activity-heatmap";

// Deterministic demo data: 20 weeks from Monday July 6, 2026.
const values = Array.from({ length: 20 * 7 }, (_, i) => {
  const weekday = i % 7;
  const wave = Math.sin(i / 9) * 3 + Math.cos(i / 4) * 2;
  return weekday > 4 ? Math.max(0, Math.round(wave / 2)) : Math.max(0, Math.round(wave + 3));
});

export default function ActivityHeatmapDemo() {
  return <ActivityHeatmap values={values} start="2026-07-06" unit="deploys" />;
}
