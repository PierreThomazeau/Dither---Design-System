"use client";

import { useState } from "react";

import { Chip } from "@/registry/dither/blocks/chip";

const PERIODS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

export default function ChipDemo() {
  const [selected, setSelected] = useState(["Q4 2026"]);
  const [tags, setTags] = useState(["Revenue", "Design", "EMEA"]);
  return (
    <div className="flex max-w-xs flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-1.5">
        {PERIODS.map((p) => (
          <Chip
            key={p}
            selected={selected.includes(p)}
            onSelectedChange={(on) => setSelected((s) => (on ? [...s, p] : s.filter((x) => x !== p)))}
          >
            {p}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {tags.map((t) => (
          <Chip key={t} onRemove={() => setTags((s) => s.filter((x) => x !== t))}>{t}</Chip>
        ))}
        {tags.length === 0 ? <span className="text-xs text-muted-foreground">All tags removed</span> : null}
      </div>
    </div>
  );
}
