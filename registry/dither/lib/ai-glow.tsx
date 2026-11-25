import * as React from "react";

import { DitherFill, ditherFadeMask } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

/**
 * Copilot / AI surface header (grammar 8): blurred indigo and pink light, a faint wash, and an
 * organic dither cloud tinted by the same gradient. Everything fades out softly: no hard edge,
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
  /** Gradient direction: indigo at the start, pink at the end; the glow fades out towards the start. */
  direction?: "to-r" | "to-l" | "to-b";
}) {
  const dir = { "to-r": "bg-linear-to-r", "to-l": "bg-linear-to-l", "to-b": "bg-linear-to-b" }[direction];
  const mask = ditherFadeMask[direction === "to-b" ? "bottom" : direction === "to-l" ? "right" : "left"];
  return (
    <span
      aria-hidden="true"
      data-slot="ai-glow"
      className={cn("pointer-events-none absolute inset-0 -z-10 [--ai-pink:var(--chart-3)] dark:[--ai-pink:var(--chart-5)]", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <span className={cn("absolute inset-0 from-brand/4 via-brand/6 to-chart-3/10 dark:to-chart-5/10", dir)} />
      <span className="absolute inset-0 opacity-70">
        <DitherFill shape="cloud" scale={2.4} seed={5} dot={[1.5, 2.5]} glow={["--brand", "--ai-pink"]} tint={{ stops: ["transparent", "--brand", "--ai-pink"], direction }} className="[&>canvas]:opacity-50" />
      </span>
    </span>
  );
}

export { AiGlow };
