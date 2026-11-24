"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";
import { Choice, type ChoiceProps } from "@/registry/dither/ui/choice";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & Omit<ChoiceProps, "disabled">;

function RadioGroupItem({ className, id, label, description, variant, placement, invalid, ...props }: RadioGroupItemProps) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const control = (
    <RadioGroupPrimitive.Item
      id={controlId}
      data-slot="radio-group-item"
      aria-invalid={invalid || undefined}
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface shadow-2xs outline-none",
        "transition-[border-color,box-shadow] duration-150 focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-brand data-[state=checked]:bg-brand",
        "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-focus-destructive",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="size-1.5 rounded-full bg-brand-foreground" />
    </RadioGroupPrimitive.Item>
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

export { RadioGroup, RadioGroupItem, type RadioGroupItemProps };
