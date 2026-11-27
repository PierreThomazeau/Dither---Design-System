import * as React from "react";
import { CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

type AgentStepStatus = "done" | "running" | "queued";

const statusIcon: Record<AgentStepStatus, React.ReactNode> = {
  done: <Icon icon={CheckmarkCircle02Icon} className="text-positive-ink" />,
  running: <Icon icon={Loading03Icon} className="animate-spin text-brand-ink motion-reduce:animate-none" />,
  queued: <span className="m-0.5 size-3 rounded-full border-[1.5px] border-border-strong" />,
};

function AgentSteps({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="agent-steps" className={cn("flex flex-col gap-2", className)} {...props} />;
}

export interface AgentStepProps extends Omit<React.ComponentProps<"li">, "title"> {
  status?: AgentStepStatus;
  title: React.ReactNode;
  /** Tool name, query, file… in muted text. */
  detail?: React.ReactNode;
}

/** One step of an AI agent run (tool call, search…): Done / Running / Queued. */
function AgentStep({ status = "queued", title, detail, className, ...props }: AgentStepProps) {
  return (
    <li
      data-slot="agent-step"
      data-status={status}
      aria-current={status === "running" ? "step" : undefined}
      className={cn("flex items-center gap-2 text-sm", status === "queued" && "text-muted-foreground", className)}
      {...props}
    >
      <span className="flex size-4 shrink-0 items-center justify-center">{statusIcon[status]}</span>
      <span className={cn("font-medium", status === "queued" && "font-normal")}>{title}</span>
      {detail ? <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">{detail}</span> : null}
      <span className="sr-only">({status})</span>
    </li>
  );
}

export { AgentStep, AgentSteps, type AgentStepStatus };
