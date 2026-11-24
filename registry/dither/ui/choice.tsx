import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Shared layout for Checkbox, Radio and Switch: label + description,
 * Type[default|box], Control placement[start|end], invalid and disabled.
 */
export interface ChoiceProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** `box` wraps the control in a bordered card that turns brand-tinted when checked (Figma: Type). */
  variant?: "default" | "box";
  placement?: "start" | "end";
  invalid?: boolean;
  disabled?: boolean;
}

export function Choice({
  id,
  control,
  label,
  description,
  variant = "default",
  placement = "start",
  invalid,
  disabled,
  className,
}: ChoiceProps & { id: string; control: React.ReactNode; className?: string }) {
  if (!label && !description) return <>{control}</>;

  return (
    <label
      htmlFor={id}
      data-slot="choice"
      data-variant={variant}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={cn(
        "group/choice flex w-full max-w-sm gap-3 text-sm",
        placement === "end" && "flex-row-reverse justify-between",
        description ? "items-start" : "items-center",
        variant === "box" && [
          "rounded-control border bg-surface p-3 shadow-xs transition-colors",
          "has-data-[state=checked]:border-brand has-data-[state=checked]:bg-brand/5",
          "data-invalid:border-destructive data-invalid:bg-destructive/5",
        ],
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <span className={cn("flex shrink-0", description && "pt-0.5")}>{control}</span>
      <span className="flex flex-col gap-0.5">
        {label ? <span className="leading-5 font-medium group-data-invalid/choice:text-destructive">{label}</span> : null}
        {description ? <span className="leading-5 text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  );
}
