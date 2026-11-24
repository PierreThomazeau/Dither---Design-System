import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Card.
 * - default: a surface panel (border, shadow-xs, rounded-surface).
 * - inset (grammar 2, the Dither signature): a muted shell with p-1 holding the header,
 *   and an inner surface panel (<CardInset>) for the content.
 */
const cardVariants = cva("group/card flex flex-col text-foreground", {
  variants: {
    variant: {
      default: "rounded-surface border bg-surface shadow-xs",
      inset: "rounded-surface bg-background-muted p-1",
    },
    size: {
      default: "",
      sm: "",
    },
  },
  compoundVariants: [
    { variant: "default", size: "default", className: "gap-6 py-6" },
    { variant: "default", size: "sm", className: "gap-4 py-4" },
    { variant: "inset", className: "gap-1" },
  ],
  defaultVariants: { variant: "default", size: "default" },
});

function Card({
  className,
  variant = "default",
  size = "default",
  dither = false,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    /** Inset only: show the dither texture on the shell. */
    dither?: boolean;
  }) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(cardVariants({ variant, size }), dither && variant === "inset" && "relative isolate", className)}
      {...props}
    >
      {dither && variant === "inset" ? (
        <span aria-hidden="true" className="bg-dither-fine pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-60" />
      ) : null}
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "group-data-[size=sm]/card:px-4",
        "group-data-[variant=inset]/card:px-3 group-data-[variant=inset]/card:pt-2 group-data-[variant=inset]/card:pb-1.5",
        "[.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-lg leading-7 font-semibold tracking-tight",
        "group-data-[size=sm]/card:text-sm group-data-[size=sm]/card:leading-5",
        "group-data-[variant=inset]/card:text-sm group-data-[variant=inset]/card:leading-5",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4 group-data-[variant=inset]/card:px-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        "group-data-[variant=inset]/card:px-3 group-data-[variant=inset]/card:py-2",
        className,
      )}
      {...props}
    />
  );
}

/** Inner surface panel of an inset card. */
function CardInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-inset"
      className={cn(
        "flex flex-col gap-4 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-5 shadow-xs",
        "group-data-[size=sm]/card:p-4",
        className,
      )}
      {...props}
    />
  );
}

/** Full-bleed media at the top of a default card. */
function CardImage({ className, alt = "", ...props }: React.ComponentProps<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="card-image"
      alt={alt}
      className={cn("-mt-6 aspect-video w-full rounded-t-[calc(var(--radius-surface)-1px)] object-cover group-data-[size=sm]/card:-mt-4", className)}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardInset, CardTitle, cardVariants };
