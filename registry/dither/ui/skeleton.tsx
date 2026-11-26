import * as React from "react";

import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

/**
 * Loading placeholder: a muted block filled with the living dither (the same animated organic
 * tile as everywhere else: drifting noise, pointer wake; still under reduced motion).
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("relative isolate overflow-hidden rounded-control-min bg-background-muted/60", className)}
      {...props}
    >
      <DitherFill variant="organic" className="-z-10" />
    </div>
  );
}

export { Skeleton };
