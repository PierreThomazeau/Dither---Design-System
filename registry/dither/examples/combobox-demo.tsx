"use client";

import { Combobox } from "@/registry/dither/ui/combobox";

const SQUADS = ["Growth", "Core platform", "Design system", "Mobile", "Payments", "Data"].map((l) => ({ value: l.toLowerCase().replace(/ /g, "-"), label: l }));

export default function ComboboxDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Combobox options={SQUADS} placeholder="Assign a squad" aria-label="Squad" />
      <Combobox multiple options={SQUADS} defaultValue={["growth", "mobile"]} placeholder="Add squads" aria-label="Squads" />
    </div>
  );
}
