"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import type { DateRange } from "react-day-picker";

import { fieldVariants, type ControlSize } from "@/registry/dither/lib/control";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Calendar } from "@/registry/dither/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/dither/ui/popover";

/* Date picker: a field-height trigger opening a Calendar in a popover. Dates are formatted with Intl
   (the viewer's locale unless `locale` is given). */

const fmt = (d: Date, locale?: string) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(d);

type Common = { placeholder?: string; size?: ControlSize; disabled?: boolean; locale?: string; className?: string; id?: string; "aria-label"?: string };

export type DatePickerProps =
  | (Common & { mode?: "single"; value?: Date; defaultValue?: Date; onValueChange?: (d: Date | undefined) => void })
  | (Common & { mode: "range"; value?: DateRange; defaultValue?: DateRange; onValueChange?: (r: DateRange | undefined) => void });

function DatePicker(props: DatePickerProps) {
  const { placeholder = "Pick a date", size, disabled, locale, className, id } = props;
  const [open, setOpen] = React.useState(false);
  const [single, setSingle] = React.useState<Date | undefined>(props.mode === "range" ? undefined : props.defaultValue);
  const [range, setRange] = React.useState<DateRange | undefined>(props.mode === "range" ? props.defaultValue : undefined);

  const label =
    props.mode === "range"
      ? (() => {
          const r = props.value ?? range;
          if (!r?.from) return null;
          return r.to ? `${fmt(r.from, locale)} – ${fmt(r.to, locale)}` : fmt(r.from, locale);
        })()
      : (() => {
          const d = props.value ?? single;
          return d ? fmt(d, locale) : null;
        })();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button id={id} type="button" aria-label={props["aria-label"]} data-placeholder={label ? undefined : ""} className={cn(fieldVariants({ size }), "justify-start gap-2 text-left", className)}>
          <Icon icon={Calendar03Icon} className="text-muted-foreground" />
          <span className={cn("truncate", !label && "text-muted-foreground")}>{label ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        {props.mode === "range" ? (
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={props.value ?? range}
            onSelect={(r) => {
              setRange(r);
              props.onValueChange?.(r);
            }}
          />
        ) : (
          <Calendar
            mode="single"
            selected={props.value ?? single}
            onSelect={(d) => {
              setSingle(d);
              props.onValueChange?.(d);
              setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
