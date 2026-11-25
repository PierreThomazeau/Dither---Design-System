import { useId } from "react";

import { DITHER_VARIANTS } from "@/registry/dither/lib/dither-tile";
import { DitherFill, DitherPattern } from "@/registry/dither/lib/dither";

export function DitherVariantsDemo() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {DITHER_VARIANTS.map((variant) => (
        <figure key={variant} className="flex flex-col gap-1.5">
          <div className="relative h-20 overflow-hidden rounded-control-min border bg-surface">
            <DitherFill variant={variant} />
          </div>
          <figcaption className="font-mono text-xs text-muted-foreground">{variant}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** A capacity track: value in chart-1, remaining in dither. */
export function DitherTrackDemo() {
  const id = `track-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg viewBox="0 0 200 24" className="w-full max-w-xs" role="img" aria-label="64% used">
      <defs>
        <DitherPattern id={id} variant="fine" />
      </defs>
      <rect width="200" height="24" rx="6" fill={`url(#${id})`} />
      <rect width="128" height="24" rx="6" className="fill-chart-1" />
    </svg>
  );
}
