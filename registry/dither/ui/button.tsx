"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";
import { Spinner } from "@/registry/dither/ui/spinner";

const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-control text-sm font-medium whitespace-nowrap outline-none select-none",
    /* Liquid press: squash on press, overshoot back on release. */
    "transition-[background-color,background-image,box-shadow,color,border-color,scale] duration-(--duration-liquid) ease-(--ease-liquid)",
    "active:scale-x-[1.03] active:scale-y-[0.94]",
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
  const shared = {
    "data-slot": "button",
    "data-variant": variant ?? "default",
    "data-size": size ?? "default",
    className: cn(buttonVariants({ variant, size }), className),
    "aria-busy": loading || undefined,
  };
  // Primary only: the dither lights up under the cursor (CSS vars, no re-render).
  const glow = (variant ?? "default") === "default";
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    props.onPointerMove?.(e as React.PointerEvent<HTMLButtonElement>);
    if (!glow) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  if (asChild) {
    // Slot needs exactly one child element.
    return (
      <Slot.Root {...shared} {...props} onPointerMove={onPointerMove}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button {...shared} disabled={disabled || loading} {...props} onPointerMove={onPointerMove}>
      {glow ? (
        <span
          aria-hidden="true"
          className={cn(
            "bg-dither-glow pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300",
            "[--dither-color:color-mix(in_oklab,var(--primary-foreground)_55%,transparent)] [--glow-r:56px]",
            "group-hover/button:animate-dither-drift group-hover/button:opacity-100 group-active/button:[--glow-r:140px]",
          )}
        />
      ) : null}
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export { Button, buttonVariants, type ButtonProps };
