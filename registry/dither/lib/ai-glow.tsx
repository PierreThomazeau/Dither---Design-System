import * as React from "react";

import { DitherFill, ditherFadeMask } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

/**
 * Copilot / AI surface header (grammar 8): the colour lives only in the dither. An organic
 * cloud tinted indigo → pink, fading out softly towards the start: no wash, no blurred blobs,
 * never a flat purple block.
 * Put it as the first child of a `relative isolate overflow-hidden` element.
 *
 * Pink: `chart-3` in light mode, `chart-5` in dark mode (the palette's pink-most tones).
 */
function AiGlow({
  className,
  direction = "to-r",
}: {
  className?: string;
  /** Tint direction: indigo at the start, pink at the end; the texture fades out towards the start. */
  direction?: "to-r" | "to-l" | "to-b";
}) {
  const mask = ditherFadeMask[direction === "to-b" ? "bottom" : direction === "to-l" ? "right" : "left"];
  return (
    <span
      aria-hidden="true"
      data-slot="ai-glow"
      className={cn("pointer-events-none absolute inset-0 -z-10 [--ai-pink:var(--chart-3)] dark:[--ai-pink:var(--chart-5)]", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <span className="absolute inset-0 opacity-60 dark:opacity-75">
        <DitherFill shape="cloud" scale={2.4} seed={5} dot={[1.5, 2.5]} tint={{ stops: ["--brand", "--brand", "--ai-pink"], direction }} />
      </span>
    </span>
  );
}

export { AiGlow };
