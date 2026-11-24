import { Gauge } from "@/registry/dither/blocks/gauge";

export default function GaugeDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <Gauge value={82} label="Health score" status="good" />
      <Gauge value={64} label="Health score" status="warning" />
      <Gauge value={21} label="Health score" status="critical" />
    </div>
  );
}
