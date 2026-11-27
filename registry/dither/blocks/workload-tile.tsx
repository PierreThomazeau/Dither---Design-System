import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

type WorkloadStatus = "backlog" | "not-started" | "in-progress" | "done";

const statusMeta: Record<WorkloadStatus, { label: string; ring: string; progress: number }> = {
  backlog: { label: "Backlog", ring: "text-muted-foreground", progress: 0 },
  "not-started": { label: "Not started", ring: "text-chart-1", progress: 0.25 },
  "in-progress": { label: "In progress", ring: "text-informative-ink", progress: 0.6 },
  done: { label: "Done", ring: "text-positive-ink", progress: 1 },
};

export interface WorkloadTileProps extends Omit<React.ComponentProps<"div">, "title"> {
  count: number;
  status?: WorkloadStatus;
  /** Defaults to the status name. */
  title?: React.ReactNode;
  due?: React.ReactNode;
  /** Override the ring progress (0–1); defaults per status. */
  progress?: number;
  /** Assignees, e.g. an AvatarGroup. */
  assignees?: React.ReactNode;
}

/** Workflow state tile: a progress ring around the count, title, due date and assignees. */
function WorkloadTile({ count, status = "backlog", title, due, progress, assignees, className, ...props }: WorkloadTileProps) {
  const meta = statusMeta[status];
  const p = Math.min(1, Math.max(0, progress ?? meta.progress));
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <div
      data-slot="workload-tile"
      data-status={status}
      className={cn("flex items-center gap-3 rounded-field border bg-surface p-3 shadow-xs", className)}
      {...props}
    >
      <span className={cn("relative flex size-9 shrink-0 items-center justify-center", meta.ring)}>
        <svg viewBox="0 0 32 32" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="16" cy="16" r={r} fill="none" stroke="var(--border)" strokeWidth={2.5} strokeDasharray={status === "backlog" ? "2 3" : undefined} />
          {p > 0 ? (
            <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${p * c} ${c}`} />
          ) : null}
        </svg>
        <span className="font-mono text-xs font-medium text-foreground tabular">{count}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{title ?? meta.label}</span>
        {due ? <span className="truncate text-xs text-muted-foreground">{due}</span> : null}
      </span>
      {assignees ? <span className="shrink-0">{assignees}</span> : null}
    </div>
  );
}

export { WorkloadTile, type WorkloadStatus };
