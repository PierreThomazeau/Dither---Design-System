"use client";

import * as React from "react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { DayPicker } from "react-day-picker";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

/**
 * Calendar (react-day-picker): days are 36px pills, the selection in primary, ranges joined by a muted band,
 * today underlined with a dot. Keyboard navigation and labels come from react-day-picker.
 */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-sm", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption: "flex h-control-sm items-center justify-center px-10",
        caption_label: "text-sm font-semibold",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: "inline-flex size-control-sm items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus disabled:opacity-40",
        button_next: "inline-flex size-control-sm items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus disabled:opacity-40",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-normal text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center [&:has([aria-selected].range_middle)]:bg-background-muted",
        day_button:
          "inline-flex size-9 items-center justify-center rounded-full font-mono text-sm tabular outline-none hover:bg-hover focus-visible:shadow-focus aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
        selected: "",
        today: "[&>button]:font-semibold [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:size-1 [&>button]:after:rounded-full [&>button]:after:bg-current",
        outside: "text-muted-foreground/60 [&>button]:aria-selected:opacity-70",
        disabled: "opacity-40 [&>button]:pointer-events-none",
        range_start: "rounded-l-full bg-background-muted",
        range_end: "rounded-r-full bg-background-muted",
        range_middle: "range_middle bg-background-muted [&>button]:aria-selected:bg-transparent [&>button]:aria-selected:text-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => <Icon icon={orientation === "left" ? ArrowLeft01Icon : ArrowRight01Icon} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
