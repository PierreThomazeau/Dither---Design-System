import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Button group (grammar 3): one container holding ghost buttons separated by short dividers.
 * The container carries the size, so the group is exactly one control height (40 by default).
 */
const buttonGroupVariants = cva(
  [
    "group/button-group inline-flex w-fit items-center gap-0.5 p-0.5",
    /* Children fill the container height; buttons inside behave as ghost buttons. */
    "*:data-[slot=button]:h-full *:data-[slot=button]:rounded-[calc(var(--radius-control)-3px)] *:data-[slot=button]:bg-transparent *:data-[slot=button]:bg-none *:data-[slot=button]:px-3 *:data-[slot=button]:shadow-none",
    "*:data-[slot=button]:text-current",
  ],
  {
    variants: {
      variant: {
        outline: "rounded-control border bg-surface *:data-[slot=button]:hover:bg-hover",
        secondary: "rounded-control bg-background-muted *:data-[slot=button]:hover:bg-surface",
        default: [
          "rounded-control bg-primary text-primary-foreground shadow-button-primary",
          "*:data-[slot=button]:hover:bg-primary-foreground/10",
        ],
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "h-auto! flex-col rounded-field *:data-[slot=button]:h-control-sm *:data-[slot=button]:w-full *:data-[slot=button]:justify-start",
      },
      size: {
        xs: "h-control-xs *:data-[slot=button]:px-2 *:data-[slot=button]:text-xs",
        sm: "h-control-sm",
        default: "h-control",
        lg: "h-control-lg *:data-[slot=button]:px-4",
      },
    },
    defaultVariants: { variant: "outline", orientation: "horizontal", size: "default" },
  },
);

function ButtonGroup({
  className,
  variant,
  orientation,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-variant={variant ?? "outline"}
      data-orientation={orientation ?? "horizontal"}
      className={cn(buttonGroupVariants({ variant, orientation, size }), className)}
      {...props}
    />
  );
}

/** Short divider between grouped buttons: 16px, border colour (20% primary-foreground on the solid variant). */
function ButtonGroupSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="button-group-separator"
      className={cn(
        "h-4 w-px shrink-0 bg-border",
        "group-data-[variant=default]/button-group:bg-primary-foreground/20",
        "group-data-[orientation=vertical]/button-group:my-0.5 group-data-[orientation=vertical]/button-group:h-px group-data-[orientation=vertical]/button-group:w-[calc(100%-16px)] group-data-[orientation=vertical]/button-group:self-center",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, buttonGroupVariants };
