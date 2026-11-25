"use client";

import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ResponseCurve } from "@/registry/dither/charts/response-curve";

const data = Array.from({ length: 26 }, (_, i) => ({ x: i, y: Math.round(11000 * (1 - Math.exp(-i / 7))) }));

export default function ChartResponseCurve() {
  return (
    <ChartCard
      title="Discount response"
      subtitle="Conversions vs. discount level"
      action="Pro plan"
      legend={<ChartLegend items={[{ label: "Response", kind: "line" }, { label: "Current discount", tone: "bg-foreground" }, { label: "Diminishing returns", kind: "dither" }]} />}
    >
      <ResponseCurve
        data={data}
        saturation={16}
        current={{ x: 12, label: "Now 12% · +0.4 pts per 1%" }}
        formatX={(n) => `${n}%`}
        formatY={(n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)}
      />
    </ChartCard>
  );
}
