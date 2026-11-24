"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

/**
 * default: a surface panel. inset (grammar 2): a muted shell with p-1 around an inner panel;
 * put the header in <PopoverHeader> and the body in <PopoverInset>.
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  variant = "default",
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { variant?: "default" | "inset" }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        data-variant={variant}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "group/popover z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col text-sm text-foreground outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          variant === "default" ? "gap-3 rounded-field border bg-surface p-4 shadow-popover" : "gap-1 rounded-surface bg-background-muted p-1 shadow-popover",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 group-data-[variant=inset]/popover:px-3 group-data-[variant=inset]/popover:pt-2 group-data-[variant=inset]/popover:pb-1.5", className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-title" className={cn("font-medium", className)} {...props} />;
}

function PopoverDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="popover-description" className={cn("text-muted-foreground", className)} {...props} />;
}

/** Inner panel of an inset popover. */
function PopoverInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-inset"
      className={cn("flex flex-col gap-3 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-4 shadow-xs", className)}
      {...props}
    />
  );
}

export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverInset, PopoverTitle, PopoverTrigger };
