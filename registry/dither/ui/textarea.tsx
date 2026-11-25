import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-20 w-full rounded-field border bg-surface px-4 py-3 text-sm outline-none",
        "transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-border-strong",
        "focus-visible:border-ring focus-visible:shadow-focus",
        "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-focus-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
