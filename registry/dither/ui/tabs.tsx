"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { liquidSpring } from "@/registry/dither/lib/motion";
import { cn } from "@/registry/dither/lib/utils";

/* The active indicator is one element per Tabs that slides between triggers (motion layoutId). */
const TabsContext = React.createContext<{ value?: string; id: string }>({ id: "" });
const TabsListContext = React.createContext<{ variant: "default" | "line" }>({ variant: "default" });

function Tabs({
  className,
  orientation = "horizontal",
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const id = React.useId();
  return (
    <TabsContext.Provider value={{ value, id }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        value={value}
        onValueChange={(v) => {
          setUncontrolled(v);
          onValueChange?.(v);
        }}
        className={cn("group/tabs flex gap-3 data-[orientation=horizontal]:flex-col", className)}
        {...props}
      />
    </TabsContext.Provider>
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
    <TabsListContext.Provider value={{ variant: variant ?? "default" }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        data-size={size}
        className={cn(tabsListVariants({ variant, size }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  );
}

/** Tabs used as a view switch (no TabsContent): drop aria-controls when it points at nothing. */
function dropDanglingControls(el: HTMLButtonElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    const id = el.getAttribute("aria-controls");
    if (id && !document.getElementById(id)) el.removeAttribute("aria-controls");
  });
}

function TabsTrigger({ className, value, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const tabs = React.useContext(TabsContext);
  const { variant } = React.useContext(TabsListContext);
  const reduce = useReducedMotion();
  const active = tabs.value === value;
  return (
    <TabsPrimitive.Trigger
      ref={dropDanglingControls}
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative isolate inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap outline-none select-none",
        "transition-colors duration-150 hover:text-foreground data-[state=active]:text-foreground",
        "focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        "group-data-[orientation=vertical]/tabs:justify-start",
        "group-data-[variant=default]/tabs-list:rounded-control",
        "group-data-[size=xs]/tabs-list:h-6 group-data-[size=xs]/tabs-list:px-2 group-data-[size=xs]/tabs-list:text-xs",
        "group-data-[size=sm]/tabs-list:h-7 group-data-[size=sm]/tabs-list:px-3",
        "group-data-[size=default]/tabs-list:h-8 group-data-[size=default]/tabs-list:px-3",
        "group-data-[size=lg]/tabs-list:h-9 group-data-[size=lg]/tabs-list:px-4",
        "group-data-[variant=line]/tabs-list:h-full group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-0",
        "group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:h-8 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:px-3",
        className,
      )}
      {...props}
    >
      {active ? (
        <motion.span
          aria-hidden="true"
          layoutId={`tabs-indicator-${tabs.id}`}
          transition={reduce ? { duration: 0 } : liquidSpring}
          className={cn(
            "absolute -z-10",
            variant === "line"
              ? "inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground group-data-[orientation=vertical]/tabs:inset-x-auto group-data-[orientation=vertical]/tabs:inset-y-1 group-data-[orientation=vertical]/tabs:-left-px group-data-[orientation=vertical]/tabs:h-auto group-data-[orientation=vertical]/tabs:w-0.5"
              : "inset-0 rounded-control bg-surface shadow-tabs-active",
          )}
        />
      ) : null}
      {children}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 text-sm outline-none", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
