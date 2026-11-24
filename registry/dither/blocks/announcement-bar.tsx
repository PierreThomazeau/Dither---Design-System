"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

const announcementBarVariants = cva(
  "relative flex min-h-control-sm w-full items-center justify-center gap-2 px-10 py-2 text-center text-sm [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "bg-foreground text-primary-foreground",
        promo: "bg-informative text-informative-foreground",
        warning: "bg-informative/10 text-informative",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface AnnouncementBarProps extends React.ComponentProps<"div">, VariantProps<typeof announcementBarVariants> {
  icon?: React.ReactNode;
  /** Trailing link, e.g. <a href="/changelog">Learn more →</a>. */
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/** Full-width banner above the app header, for launches, promos and incidents. */
function AnnouncementBar({ variant, icon, action, dismissible = true, onDismiss, className, children, ...props }: AnnouncementBarProps) {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
    <div data-slot="announcement-bar" role="region" aria-label="Announcement" className={cn(announcementBarVariants({ variant }), className)} {...props}>
      {icon}
      <span>{children}</span>
      {action ? <span className="font-medium underline-offset-4 [&_a]:outline-none [&_a:focus-visible]:underline [&_a:hover]:underline">{action}</span> : null}
      {dismissible ? (
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            setOpen(false);
            onDismiss?.();
          }}
          className="absolute right-2 inline-flex size-7 items-center justify-center rounded-control opacity-70 outline-none hover:bg-current/10 hover:opacity-100 focus-visible:shadow-focus"
        >
          <Icon icon={Cancel01Icon} size={14} />
        </button>
      ) : null}
    </div>
  );
}

export { AnnouncementBar, announcementBarVariants };
