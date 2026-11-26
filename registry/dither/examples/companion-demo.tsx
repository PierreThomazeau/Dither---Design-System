"use client";

import * as React from "react";

import { Companion, companionMoods, type CompanionMood, type CompanionStatus } from "@/registry/dither/blocks/companion";
import { Button } from "@/registry/dither/ui/button";

const statuses: CompanionStatus[] = ["idle", "listening", "thinking", "responding", "done", "error"];

export default function CompanionDemo() {
  const [status, setStatus] = React.useState<CompanionStatus>("idle");
  const [mood, setMood] = React.useState<CompanionMood | undefined>(undefined);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Companion status={status} mood={mood} slowAfter={3} size={160} />
      <div className="flex flex-wrap justify-center gap-1.5">
        {statuses.map((s) => (
          <Button key={s} size="xs" variant={status === s && !mood ? "default" : "outline"} onClick={() => (setMood(undefined), setStatus(s))}>
            {s}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {companionMoods.map((m) => (
          <Button key={m} size="xs" variant={mood === m ? "secondary" : "ghost"} onClick={() => setMood(mood === m ? undefined : m)}>
            {m}
          </Button>
        ))}
      </div>
    </div>
  );
}
