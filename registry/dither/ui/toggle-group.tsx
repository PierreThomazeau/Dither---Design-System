"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";
import { toggleVariants } from "@/registry/dither/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({ size: "default", variant: "default" });

/**
 * Items sit in one container (like a button group), so the group is exactly one control height.
 * outline = bordered surface, default = muted track.
 */
function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group inline-flex w-fit items-center gap-0.5 rounded-control p-0.5",
        variant === "outline" ? "border bg-surface shadow-xs" : "bg-background-muted",
        size === "sm" && "h-control-sm",
        size === "default" && "h-control",
        size === "lg" && "h-control-lg",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { size } = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: "default", size }),
        "h-full min-w-0 rounded-[calc(var(--radius-control)-3px)]",
        "group-data-[variant=default]/toggle-group:hover:bg-surface/60",
        "data-[state=on]:bg-surface data-[state=on]:shadow-tabs-active",
        "group-data-[variant=outline]/toggle-group:data-[state=on]:bg-background-muted group-data-[variant=outline]/toggle-group:data-[state=on]:shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
