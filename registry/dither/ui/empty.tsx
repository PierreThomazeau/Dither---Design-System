import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

const emptyVariants = cva(
  "relative isolate flex min-w-0 flex-1 flex-col items-center justify-center gap-5 overflow-hidden p-6 text-center text-balance md:p-10",
  {
    variants: {
      variant: {
        default: "",
        outline: "rounded-surface border bg-surface",
        muted: "rounded-surface bg-background-muted",
        /** Brand texture: a dither gradient fading out behind the media, never under the text. */
        dither: "rounded-surface border bg-surface",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Empty({ className, variant, children, ...props }: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
  return (
    <div data-slot="empty" data-variant={variant ?? "default"} className={cn(emptyVariants({ variant }), className)} {...props}>
      {variant === "dither" ? <DitherFill variant="gradient" gradientHeight={96} className="inset-auto top-0 left-0 -z-10 h-24 w-full" /> : null}
      {children}
    </div>
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("flex max-w-sm flex-col items-center gap-2", className)} {...props} />;
}

const emptyMediaVariants = cva("mb-1 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "size-10 rounded-control border bg-surface text-foreground shadow-xs [&_svg:not([class*='size-'])]:size-5",
    },
  },
  defaultVariants: { variant: "default" },
});

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return <div data-slot="empty-media" data-variant={variant} className={cn(emptyMediaVariants({ variant }), className)} {...props} />;
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("text-base leading-6 font-semibold tracking-tight", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn("text-sm leading-5 text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-foreground", className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="empty-content" className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-sm text-balance", className)} {...props} />
  );
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
