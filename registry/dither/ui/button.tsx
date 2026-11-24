import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";
import { Spinner } from "@/registry/dither/ui/spinner";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-control text-sm font-medium whitespace-nowrap outline-none select-none",
    "transition-[background-color,background-image,box-shadow,color,border-color] duration-150",
    "disabled:pointer-events-none disabled:opacity-50 aria-busy:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "focus-visible:shadow-focus aria-invalid:shadow-focus-destructive",
  ],
  {
    variants: {
      variant: {
        /* Tactile primary (grammar 1): white gradient overlay + inner shadows, nothing bleeds outside. */
        default: [
          "bg-primary text-primary-foreground shadow-button-primary",
          "bg-linear-to-b from-white/8 to-white/0 hover:from-white/14 hover:to-white/3",
          "active:from-white/0 active:to-white/5 active:shadow-button-primary-pressed",
          "focus-visible:shadow-[var(--dither-shadow-button-primary),var(--dither-shadow-focus)]",
        ],
        outline: "border bg-surface shadow-xs hover:bg-hover active:bg-background-muted focus-visible:border-ring",
        secondary: "bg-background-muted text-foreground hover:bg-border/60 active:bg-border",
        destructive: [
          "bg-destructive/10 text-destructive hover:bg-destructive/15 active:bg-destructive/20",
          "dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90",
          "focus-visible:shadow-focus-destructive",
        ],
        ghost: "hover:bg-hover active:bg-background-muted",
        link: "h-auto! px-0! text-foreground underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-control-xs gap-1.5 px-2.5 text-xs",
        sm: "h-control-sm px-3",
        default: "h-control px-4",
        lg: "h-control-lg px-5",
        icon: "size-control",
        "icon-xs": "size-control-xs",
        "icon-sm": "size-control-sm",
        "icon-lg": "size-control-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Shows a spinner, disables the button and sets aria-busy. */
    loading?: boolean;
  };

function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && !asChild ? <Spinner /> : null}
      {asChild ? children : <Slot.Slottable>{children}</Slot.Slottable>}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
