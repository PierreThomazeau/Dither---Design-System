import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Loading placeholder in organic dither: a muted block with the organic texture (a few dots
 * twinkle), and a darker band of the same texture sweeping across. Both stop with
 * prefers-reduced-motion.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-control-min bg-background-muted/60",
        "before:bg-dither-organic before:absolute before:inset-0 before:-z-10 before:content-['']",
        "after:bg-dither-sweep after:absolute after:inset-0 after:-z-10 after:content-[''] after:[--dither-color:color-mix(in_oklab,var(--muted-foreground)_55%,transparent)] after:animate-dither-sweep motion-reduce:after:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
