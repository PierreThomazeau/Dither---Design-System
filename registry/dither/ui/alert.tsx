import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/registry/dither/lib/utils";

const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-field border bg-surface px-4 py-3 text-sm shadow-xs",
    "has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 [&>svg]:translate-y-0.5",
    "has-data-[slot=alert-action]:pr-28",
  ],
  {
    variants: {
      variant: {
        default: "[&>svg]:text-foreground",
        brand: "border-brand/30 bg-brand/5 [&>svg]:text-brand",
        positive: "border-positive/30 bg-positive/5 [&>svg]:text-positive",
        informative: "border-informative/30 bg-informative/5 [&>svg]:text-informative",
        destructive: "border-destructive/30 bg-destructive/5 text-destructive [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/80",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("col-start-2 leading-5 font-medium", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 grid justify-items-start gap-1 leading-5 text-muted-foreground [&_p]:leading-5", className)}
      {...props}
    />
  );
}

/** Optional action pinned to the right (a small button). */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("absolute top-1/2 right-3 -translate-y-1/2", className)} {...props} />;
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
