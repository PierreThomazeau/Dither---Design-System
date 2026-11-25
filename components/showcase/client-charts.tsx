"use client";

/* Recharts-based charts preconfigured for the showcase screens (formatters are functions,
   so they must live on the client side). */
import { ComboChart } from "@/registry/dither/charts/combo-chart";
import { ForecastChart } from "@/registry/dither/charts/forecast-chart";
import { StackedArea } from "@/registry/dither/charts/stacked-area";

const cash = [3.1, 3.3, 3.2, 3.6, 3.8, 3.7, 4.0, 4.2, 4.1, 4.5, 4.6, 4.8];
const cashData = [
  ...cash.map((v, i) => ({ label: `M${i + 1}`, actual: v, ...(i === cash.length - 1 ? { forecast: v, range: [v, v] as [number, number] } : {}) })),
  ...[5.0, 5.1, 5.3].map((v, i) => ({ label: `M${i + 13}`, forecast: v, range: [v - 0.3 * (i + 1), v + 0.3 * (i + 1)] as [number, number] })),
];

export function CashForecast() {
  return <ForecastChart data={cashData} today="M12" format={(n) => `€${n}M`} height={240} />;
}

const streams = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  subscriptions: 1.6 + i * 0.08 + Math.sin(i / 2) * 0.1,
  services: 1.0 + i * 0.05 + Math.cos(i / 3) * 0.1,
  addons: 0.5 + i * 0.04,
}));

export function RevenueStreams() {
  return (
    <StackedArea
      data={streams}
      xKey="week"
      format={(n) => `€${n.toFixed(0)}M`}
      series={[
        { key: "subscriptions", label: "Subscriptions" },
        { key: "services", label: "Services" },
        { key: "addons", label: "Add-ons" },
      ]}
    />
  );
}

export function CostsMargin() {
  return (
    <ComboChart
      formatBar={(n) => `€${n}M`}
      data={[
        { label: "Jun", bar: 1.6, cap: 2.8, line: 41 },
        { label: "Jul", bar: 1.9, cap: 2.8, line: 39 },
        { label: "Aug", bar: 1.4, cap: 2.8, line: 44 },
        { label: "Sep", bar: 2.1, cap: 2.8, line: 45 },
        { label: "Oct", bar: 2.2, cap: 2.8, line: 46 },
        { label: "Nov", bar: 2.0, cap: 2.8, line: 47 },
      ]}
    />
  );
}
