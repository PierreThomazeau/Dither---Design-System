"use client";

import * as React from "react";

import { DitherDevelop } from "@/registry/dither/lib/dither-develop";
import { DitherImage } from "@/registry/dither/lib/dither-image";
import { Button } from "@/registry/dither/ui/button";

export default function DevelopDemo() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (ready) return;
    const t = window.setTimeout(() => setReady(true), 1400);
    return () => window.clearTimeout(t);
  }, [ready]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DitherDevelop ready={ready} moment="success" className="rounded-surface border bg-surface shadow-xs">
        <DitherImage preset="ember" animated={false} className="aspect-[16/9]" />
        <div className="flex flex-col gap-1 p-4">
          <span className="text-sm font-semibold">The physical data platform</span>
          <span className="text-sm text-muted-foreground">A screen from a SaaS product, saved to Inspiration.</span>
        </div>
      </DitherDevelop>
      <Button variant="outline" size="sm" className="self-start" onClick={() => setReady(false)} disabled={!ready}>
        Load again
      </Button>
    </div>
  );
}
