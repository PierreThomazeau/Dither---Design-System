"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

/** Slider: the selected range solid, the rest of the track in dither (system rule). One or several thumbs. */
function Slider({ className, defaultValue, value, min = 0, max = 100, "aria-label": ariaLabel, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = value ?? defaultValue ?? [min];
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2">
        <DitherFill variant="organic" />
        <SliderPrimitive.Range className="absolute rounded-full bg-foreground data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {values.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={values.length > 1 ? `${ariaLabel ? `${ariaLabel} ` : ""}${i === 0 ? "minimum" : "maximum"}` : (ariaLabel ?? "Value")}
          className="block size-5 shrink-0 rounded-full border bg-surface shadow-xs outline-none transition-[scale,box-shadow] duration-(--duration-liquid) ease-(--ease-liquid) hover:scale-110 focus-visible:shadow-focus active:scale-95 disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
