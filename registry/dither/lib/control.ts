import { cva } from "class-variance-authority";

/**
 * Shared field styling for Input, Select trigger and friends, so every control
 * has the same height, radius, border and focus ring at the same size.
 */
export const fieldVariants = cva(
  [
    "flex w-full min-w-0 items-center rounded-control border bg-surface text-sm text-foreground shadow-xs outline-none",
    "transition-[border-color,box-shadow] duration-150",
    "placeholder:text-muted-foreground data-[placeholder]:text-muted-foreground",
    "hover:border-border-strong",
    "focus-visible:border-ring focus-visible:shadow-focus",
    "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-focus-destructive",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        xs: "h-control-xs px-2.5 text-xs",
        sm: "h-control-sm px-3",
        default: "h-control px-4",
        lg: "h-control-lg px-4",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export type ControlSize = "xs" | "sm" | "default" | "lg";
