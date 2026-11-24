"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn("group/tabs flex gap-3 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

/**
 * Tabs list (grammar 4): xs 32 / sm 36 / default 40 / lg 44, padding 4,
 * triggers 24 / 28 / 32 / 36 high with px-2 / px-3 / px-3 / px-4.
 */
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center text-muted-foreground group-data-[orientation=vertical]/tabs:h-auto! group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch",
  {
    variants: {
      variant: {
        default: "gap-0.5 rounded-control-min bg-background-muted p-1",
        line: "gap-4 border-b group-data-[orientation=vertical]/tabs:gap-1 group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-l",
      },
      size: {
        xs: "h-control-xs",
        sm: "h-control-sm",
        default: "h-control",
        lg: "h-control-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function TabsList({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-size={size}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap outline-none select-none",
        "transition-[color,background-color,box-shadow] duration-150 hover:text-foreground",
        "focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        "group-data-[orientation=vertical]/tabs:justify-start",
        /* default (segmented) */
        "group-data-[variant=default]/tabs-list:rounded-control",
        "group-data-[variant=default]/tabs-list:data-[state=active]:bg-surface group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-tabs-active",
        "group-data-[size=xs]/tabs-list:h-6 group-data-[size=xs]/tabs-list:px-2 group-data-[size=xs]/tabs-list:text-xs",
        "group-data-[size=sm]/tabs-list:h-7 group-data-[size=sm]/tabs-list:px-3",
        "group-data-[size=default]/tabs-list:h-8 group-data-[size=default]/tabs-list:px-3",
        "group-data-[size=lg]/tabs-list:h-9 group-data-[size=lg]/tabs-list:px-4",
        /* line */
        "group-data-[variant=line]/tabs-list:h-full group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-0",
        "group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-0 group-data-[variant=line]/tabs-list:after:-bottom-px group-data-[variant=line]/tabs-list:after:h-0.5 group-data-[variant=line]/tabs-list:after:rounded-full",
        "group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground group-data-[variant=line]/tabs-list:data-[state=active]:after:bg-foreground",
        "group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:h-8 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:px-3",
        "group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:after:inset-x-auto group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:after:inset-y-1 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:after:-left-px group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:after:h-auto group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:after:w-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 text-sm outline-none", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
