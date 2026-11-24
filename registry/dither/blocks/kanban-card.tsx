import * as React from "react";
import { Attachment01Icon, Calendar03Icon, Comment01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

type Priority = "low" | "medium" | "high";

function PriorityBars({ priority }: { priority: Priority }) {
  const level = { low: 1, medium: 2, high: 3 }[priority];
  return (
    <span className="inline-flex h-3 items-end gap-px" role="img" aria-label={`${priority} priority`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={cn("w-[3px] rounded-[1px]", n <= level ? "bg-foreground" : "bg-border-strong")} style={{ height: `${n * 4}px` }} />
      ))}
    </span>
  );
}

export interface KanbanCardProps extends Omit<React.ComponentProps<"div">, "title" | "id"> {
  id: string;
  title: React.ReactNode;
  tag?: React.ReactNode;
  priority?: Priority;
  /** Subtasks done / total; shows a progress bar (remaining in dither). */
  subtasks?: { done: number; total: number };
  comments?: number;
  files?: number;
  due?: React.ReactNode;
  /** Assignee, e.g. an Avatar size="xs". */
  assignee?: React.ReactNode;
}

/** Task card for a board: mono ID with priority, tag, title, subtasks and counters. */
function KanbanCard({ id, title, tag, priority = "medium", subtasks, comments, files, due, assignee, className, ...props }: KanbanCardProps) {
  return (
    <div data-slot="kanban-card" className={cn("flex w-full flex-col gap-3 rounded-field border bg-surface p-3 shadow-xs", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground tabular">
          <PriorityBars priority={priority} />
          {id}
        </span>
        {tag ? <span className="inline-flex h-5 items-center rounded-micro border px-1.5 text-xs font-medium">{tag}</span> : null}
      </div>
      <p className="text-sm font-medium">{title}</p>
      {subtasks ? (
        <div className="flex items-center gap-2">
          <span className="relative h-1 flex-1 overflow-hidden rounded-full">
            <span aria-hidden="true" className="bg-dither-fine absolute inset-0" />
            <span className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: `${(subtasks.done / subtasks.total) * 100}%` }} />
          </span>
          <span className="font-mono text-xs text-muted-foreground tabular">
            {subtasks.done}/{subtasks.total}
          </span>
        </div>
      ) : null}
      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground tabular [&_svg]:size-3.5">
        {comments !== undefined ? (
          <span className="inline-flex items-center gap-1" aria-label={`${comments} comments`}>
            <Icon icon={Comment01Icon} />
            {comments}
          </span>
        ) : null}
        {files !== undefined ? (
          <span className="inline-flex items-center gap-1" aria-label={`${files} files`}>
            <Icon icon={Attachment01Icon} />
            {files}
          </span>
        ) : null}
        {due ? (
          <span className="inline-flex items-center gap-1">
            <Icon icon={Calendar03Icon} />
            {due}
          </span>
        ) : null}
        {assignee ? <span className="ml-auto">{assignee}</span> : null}
      </div>
    </div>
  );
}

export { KanbanCard };
