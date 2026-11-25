import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/** Blur radius per layer (px): each one covers a shorter band, so the blur ramps up towards the edge. */
const LAYERS = [0.5, 1, 2, 4, 8, 16];

/**
 * Progressive blur: stacked `backdrop-filter` layers, each masked to a narrower band, so content
 * scrolling under it gets blurrier towards the top edge, with a light background tint on top.
 * Place it absolutely (e.g. `absolute inset-x-0 top-full h-10`) under a sticky header.
 */
export function ProgressiveBlur({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div aria-hidden="true" data-slot="progressive-blur" className={cn("pointer-events-none", className)} {...props}>
      {LAYERS.map((blur, i) => {
        const end = 100 - (i * 100) / LAYERS.length;
        const mask = `linear-gradient(to bottom, #000 ${Math.max(0, end - 35)}%, transparent ${end}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, maskImage: mask, WebkitMaskImage: mask }}
          />
        );
      })}
      <div className="absolute inset-0 bg-linear-to-b from-background/80 to-transparent" />
    </div>
  );
}
