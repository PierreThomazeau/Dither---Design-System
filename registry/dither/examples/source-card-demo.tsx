import { SourceCard } from "@/registry/dither/blocks/source-card";

export default function SourceCardDemo() {
  return (
    <div className="flex max-w-md flex-wrap justify-center gap-2">
      <SourceCard index={1} href="#" title="Q3 revenue report" meta="northwind.studio · 2 days ago" />
      <SourceCard index={2} href="#" title="Pricing benchmark 2026" meta="lumen.finance · Nov 12" />
    </div>
  );
}
