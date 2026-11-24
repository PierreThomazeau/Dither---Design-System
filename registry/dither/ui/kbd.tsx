import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-hairline border bg-surface px-1 font-mono text-xs font-medium text-muted-foreground shadow-2xs select-none",
        "[&_svg]:size-3",
        /* Inside a primary button: translucent on the dark fill. */
        "in-data-[variant=default]:border-primary-foreground/20 in-data-[variant=default]:bg-primary-foreground/10 in-data-[variant=default]:text-primary-foreground in-data-[variant=default]:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="kbd-group" className={cn("inline-flex items-center gap-1", className)} {...props} />;
}

export { Kbd, KbdGroup };
