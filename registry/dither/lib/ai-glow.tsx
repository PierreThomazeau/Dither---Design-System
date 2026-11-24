import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Copilot / AI surface header (grammar 8): a subtle indigo → pink wash with the dither
 * texture tinted by the same gradient. Never a flat purple block.
 * Put it as the first child of a `relative isolate overflow-hidden` element.
 *
 * Pink: `chart-3` in light mode, `chart-5` in dark mode (the palette's pink-most tones).
 */
function AiGlow({
  className,
  direction = "to-r",
}: {
  className?: string;
  /** Gradient direction: indigo at the start, pink at the end. */
  direction?: "to-r" | "to-l" | "to-b";
}) {
  const dir = { "to-r": "bg-linear-to-r", "to-l": "bg-linear-to-l", "to-b": "bg-linear-to-b" }[direction];
  return (
    <span aria-hidden="true" data-slot="ai-glow" className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <span className={cn("absolute inset-0 from-transparent via-brand/6 to-chart-3/12 dark:to-chart-5/12", dir)} />
      <span
        className={cn(
          "bg-dither-fine absolute inset-0 from-transparent via-brand/45 [--dither-color:transparent] to-chart-3/70 opacity-80 dark:to-chart-5/60",
          dir,
        )}
      />
    </span>
  );
}

export { AiGlow };
