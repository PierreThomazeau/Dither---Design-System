"use client";

import { Calendar } from "@/registry/dither/ui/calendar";
import { DatePicker } from "@/registry/dither/ui/date-picker";

export default function DatePickerDemo() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-6">
      <div className="flex w-full max-w-xs flex-col gap-3">
        <DatePicker locale="en-GB" aria-label="Due date" />
        <DatePicker mode="range" locale="en-GB" placeholder="Pick a period" aria-label="Period" />
      </div>
      <Calendar mode="single" className="rounded-field border bg-surface shadow-xs" />
    </div>
  );
}
