"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Choice, type ChoiceProps } from "@/registry/dither/ui/choice";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & Omit<ChoiceProps, "disabled">;

function Checkbox({ className, id, label, description, variant, placement, invalid, ...props }: CheckboxProps) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const control = (
    <CheckboxPrimitive.Root
      id={controlId}
      data-slot="checkbox"
      aria-invalid={invalid || undefined}
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-border-strong bg-surface shadow-2xs outline-none",
        "transition-[background-color,border-color,box-shadow] duration-150",
        "focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground",
        "data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand data-[state=indeterminate]:text-brand-foreground",
        "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-focus-destructive aria-invalid:data-[state=checked]:bg-destructive",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="group flex items-center justify-center animate-[liquid-pop_var(--duration-liquid)_var(--ease-out-soft)]">
        <Icon icon={Tick02Icon} size={12} strokeWidth={2.5} className="group-data-[state=indeterminate]:hidden" />
        <Icon icon={MinusSignIcon} size={12} strokeWidth={2.5} className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
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

export { Checkbox, type CheckboxProps };
