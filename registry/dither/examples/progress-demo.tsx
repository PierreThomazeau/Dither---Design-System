"use client";

import * as React from "react";

import { Progress } from "@/registry/dither/ui/progress";

export default function ProgressDemo() {
  const [v, setV] = React.useState(12);
  React.useEffect(() => {
    const iv = window.setInterval(() => setV((x) => (x >= 100 ? 0 : x + 4)), 220);
    return () => window.clearInterval(iv);
  }, []);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm"><span>Storage</span><span className="font-mono text-muted-foreground tabular">{v}%</span></div>
        <Progress value={v} aria-label="Storage" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm"><span>Uploading assets</span><span className="font-mono text-muted-foreground tabular">{v}%</span></div>
        <Progress variant="density" value={v} aria-label="Uploading assets" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">Syncing (indeterminate)</span>
        <Progress aria-label="Syncing" />
      </div>
    </div>
  );
}
