import { StatCard } from "@/registry/dither/blocks/stat-card";

export default function StatCardGradient() {
  return (
    <div className="grid w-full max-w-xs gap-3">
      <StatCard variant="gradient" label="Active projects" value="128" delta="+6" caption="this quarter" trend="up" />
      <StatCard variant="gradient" label="Open invoices" value="€64,120" caption="12 invoices" />
    </div>
  );
}
