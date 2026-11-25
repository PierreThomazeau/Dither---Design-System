"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";

const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-control text-sm font-medium whitespace-nowrap text-muted-foreground outline-none",
    "transition-[color,background-color,box-shadow] duration-150 hover:bg-hover hover:text-foreground",
    "focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "data-[state=on]:bg-background-muted data-[state=on]:text-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border bg-surface data-[state=on]:border-border-strong",
      },
      size: {
        sm: "h-control-sm min-w-control-sm px-2.5",
        default: "h-control min-w-control px-3",
        lg: "h-control-lg min-w-control-lg px-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size }), className)} {...props} />;
}

export { Toggle, toggleVariants };
