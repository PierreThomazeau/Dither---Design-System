"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";
import { Choice, type ChoiceProps } from "@/registry/dither/ui/choice";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> &
  Omit<ChoiceProps, "disabled"> & { size?: "default" | "sm" };

function Switch({ className, id, size = "default", label, description, variant, placement, invalid, ...props }: SwitchProps) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const control = (
    <SwitchPrimitive.Root
      id={controlId}
      data-slot="switch"
      data-size={size}
      aria-invalid={invalid || undefined}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent p-px outline-none",
        "transition-[background-color,box-shadow] duration-150 focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=unchecked]:bg-border-strong data-[state=checked]:bg-brand",
        "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-focus-destructive",
        "data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-surface shadow-sm ring-0 transition-transform duration-150 motion-reduce:transition-none",
          "dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-brand-foreground",
          "group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:data-[state=checked]:translate-x-4",
          "group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:data-[state=checked]:translate-x-3",
          "data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );

  return (
    <Choice
      id={controlId}
      control={control}
      label={label}
      description={description}
      variant={variant}
      placement={placement}
      invalid={invalid}
      disabled={props.disabled}
    />
  );
}

export { Switch, type SwitchProps };
