import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Loading placeholder in dither: a muted block with the fine dither texture pulsing on top.
 * The pulse stops with prefers-reduced-motion.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-control bg-background-muted/60",
        "before:bg-dither-fine before:absolute before:inset-0 before:-z-10 before:animate-pulse before:content-[''] motion-reduce:before:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
