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
  // Stretch only after the first toggle, so nothing wobbles on page load.
  const [touched, setTouched] = React.useState(false);
  const gooId = `goo-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const travel = "group-data-[size=default]/switch:group-data-[state=checked]/switch:translate-x-4 group-data-[size=sm]/switch:group-data-[state=checked]/switch:translate-x-3";
  const control = (
    <SwitchPrimitive.Root
      id={controlId}
      data-slot="switch"
      data-size={size}
      aria-invalid={invalid || undefined}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent p-px outline-none",
        "transition-[background-color,box-shadow] duration-300 focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=unchecked]:bg-border-strong data-[state=checked]:bg-brand",
        "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-focus-destructive",
        "data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7",
        className,
      )}
      {...props}
      data-touched={touched || undefined}
      onCheckedChange={(checked) => {
        setTouched(true);
        props.onCheckedChange?.(checked);
      }}
    >
      {/* Gooey filter: blur + alpha threshold merges the thumb and its trailing drop into one liquid shape. */}
      <svg aria-hidden="true" className="absolute size-0">
        <filter id={gooId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <span aria-hidden="true" className="relative flex size-full items-center" style={{ filter: `url(#${gooId})` }}>
        {/* Trailing drop: same path, a beat later, smaller. */}
        <span
          className={cn(
            "absolute left-0.5 rounded-full bg-surface transition-transform duration-(--duration-liquid) ease-(--ease-out-soft) motion-reduce:transition-none",
            "dark:group-data-[state=unchecked]/switch:bg-foreground dark:group-data-[state=checked]/switch:bg-brand-foreground",
            "group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2 delay-75",
            travel,
          )}
        />
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none relative block rounded-full bg-surface ring-0",
            "transition-transform duration-(--duration-liquid) ease-(--ease-liquid) motion-reduce:transition-none",
            "dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-brand-foreground",
            "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
            "group-data-[size=default]/switch:data-[state=checked]:translate-x-4 group-data-[size=sm]/switch:data-[state=checked]:translate-x-3",
            /* Stretch while travelling (two names so it replays on every toggle). */
            "group-data-touched/switch:data-[state=checked]:animate-[liquid-stretch-on_var(--duration-liquid)_var(--ease-out-soft)] group-data-touched/switch:data-[state=unchecked]:animate-[liquid-stretch-off_var(--duration-liquid)_var(--ease-out-soft)]",
          )}
        />
      </span>
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
