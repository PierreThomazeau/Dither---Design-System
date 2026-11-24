import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-micro border border-transparent px-1.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-background-muted text-foreground",
        outline: "border-border bg-surface text-foreground",
        brand: "bg-brand/10 text-brand",
        positive: "bg-positive/10 text-positive",
        destructive: "bg-destructive/10 text-destructive",
        informative: "bg-informative/10 text-informative",
        /* Annotation tag (grammar 7): black, mono, uppercase. */
        tag: "rounded-hairline bg-foreground font-mono tracking-wide text-primary-foreground uppercase",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
