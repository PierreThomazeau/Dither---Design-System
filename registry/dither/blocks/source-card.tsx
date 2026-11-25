import * as React from "react";
import { Globe02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

export interface SourceCardProps extends Omit<React.ComponentProps<"a">, "title"> {
  index?: number;
  title: React.ReactNode;
  /** Domain · date, file type… */
  meta?: React.ReactNode;
  /** Favicon or file icon. */
  icon?: React.ReactNode;
}

/** Citation card shown under an AI answer. Renders a link when `href` is set. */
function SourceCard({ index, title, meta, icon, href, className, ...props }: SourceCardProps) {
  const classes = cn(
    "inline-flex max-w-64 min-w-0 items-center gap-2.5 rounded-field border bg-surface py-2 pr-3 pl-2 shadow-xs outline-none",
    href && "transition-colors hover:bg-hover focus-visible:shadow-focus",
    className,
  );
  const content = (
    <>
      {index !== undefined ? (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background-muted text-xs tabular-nums text-muted-foreground tabular">
          {index}
        </span>
      ) : null}
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-surface text-muted-foreground [&_img]:size-4 [&_svg]:size-3.5">
        {icon ?? <Icon icon={Globe02Icon} />}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{title}</span>
        {meta ? <span className="truncate font-mono text-xs text-muted-foreground">{meta}</span> : null}
      </span>
    </>
  );
  if (href) {
    return (
      <a data-slot="source-card" href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <div data-slot="source-card" className={classes}>
      {content}
    </div>
  );
}

export { SourceCard };
