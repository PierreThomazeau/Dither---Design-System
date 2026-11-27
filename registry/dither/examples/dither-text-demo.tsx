"use client";

import * as React from "react";

import { DitherText } from "@/registry/dither/lib/dither-text";
import { Button } from "@/registry/dither/ui/button";

const ANSWER =
  "Velocity is up 8% on last sprint, driven by Growth and Design system. The review backlog grew to 14 items, mostly checkout specs waiting on accessibility sign-off.";

export default function DitherTextDemo() {
  const [n, setN] = React.useState(0);
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    if (!run) return;
    const iv = window.setInterval(() => setN((x) => (x >= ANSWER.length ? (window.clearInterval(iv), x) : x + 3)), 30);
    return () => window.clearInterval(iv);
  }, [run]);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <p className="min-h-24 rounded-field bg-background-muted px-3.5 py-2.5 text-sm leading-6">
        <DitherText key={run} text={ANSWER.slice(0, n)} />
      </p>
      <Button variant="outline" size="sm" className="self-start" onClick={() => {
          setN(0);
          setRun((r) => r + 1);
        }}>
        Stream an answer
      </Button>
    </div>
  );
}
