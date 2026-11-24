import * as React from "react";
import { Alert02Icon, CancelCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

type TimelineStatus = "default" | "success" | "warning" | "error";

const statusMeta: Record<TimelineStatus, { className: string; icon: React.ReactNode }> = {
  default: { className: "text-muted-foreground", icon: <span className="size-2 rounded-full border-[1.5px] border-current" /> },
  success: { className: "text-positive", icon: <Icon icon={CheckmarkCircle02Icon} size={14} /> },
  warning: { className: "text-chart-1", icon: <Icon icon={Alert02Icon} size={14} /> },
  error: { className: "text-destructive", icon: <Icon icon={CancelCircleIcon} size={14} /> },
};

function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="timeline" className={cn("flex flex-col", className)} {...props} />;
}

export interface TimelineItemProps extends Omit<React.ComponentProps<"li">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  status?: TimelineStatus;
  /** Replace the status marker. */
  icon?: React.ReactNode;
}

/** One event: marker on a dotted connector, title, description and mono time. */
function TimelineItem({ title, description, time, status = "default", icon, className, children, ...props }: TimelineItemProps) {
  const meta = statusMeta[status];
  return (
    <li data-slot="timeline-item" data-status={status} className={cn("group/timeline-item relative flex gap-3 pb-5 last:pb-0", className)} {...props}>
      <span
        aria-hidden="true"
        className="absolute top-7 bottom-1 left-[11.5px] border-l border-dashed border-border-strong group-last/timeline-item:hidden"
      />
      <span className={cn("relative flex size-6 shrink-0 items-center justify-center rounded-full border bg-surface", meta.className)}>
        {icon ?? meta.icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium">{title}</span>
          {time ? <time className="shrink-0 font-mono text-xs text-muted-foreground tabular">{time}</time> : null}
        </div>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {children}
      </div>
    </li>
  );
}

export { Timeline, TimelineItem, type TimelineStatus };
