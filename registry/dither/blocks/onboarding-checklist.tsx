import * as React from "react";
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

export interface ChecklistStep {
  label: React.ReactNode;
  done?: boolean;
  /** Link for a pending step (shows an arrow). */
  href?: string;
}

export interface OnboardingChecklistProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  steps: ChecklistStep[];
  /** Buttons under the list (Continue setup, Dismiss…). */
  actions?: React.ReactNode;
}

/** First-run checklist: progress bar (remaining in dither), done steps checked, pending steps linked. */
function OnboardingChecklist({ title, steps, actions, className, ...props }: OnboardingChecklistProps) {
  const done = steps.filter((s) => s.done).length;
  return (
    <div data-slot="onboarding-checklist" className={cn("flex w-full max-w-sm flex-col gap-4 rounded-surface border bg-surface p-5 shadow-xs", className)} {...props}>
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-base font-semibold tracking-tight">{title}</span>
          <span className="shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground tabular">
            {done} of {steps.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Setup progress"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={done}
          className="relative h-1.5 overflow-hidden rounded-full"
        >
          <DitherFill variant="organic" />
          <span className="absolute inset-y-0 left-0 rounded-full bg-positive transition-[width]" style={{ width: `${(done / steps.length) * 100}%` }} />
        </div>
      </div>
      <ul className="flex flex-col">
        {steps.map((step, i) => {
          const content = (
            <>
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full",
                  step.done ? "bg-positive text-positive-foreground" : "border border-border-strong",
                )}
              >
                {step.done ? <Icon icon={Tick02Icon} size={10} strokeWidth={3} /> : null}
              </span>
              <span className={cn("flex-1 text-sm", step.done && "text-muted-foreground")}>{step.label}</span>
              {!step.done && step.href ? <Icon icon={ArrowRight01Icon} className="text-muted-foreground" /> : null}
            </>
          );
          return (
            <li key={i}>
              {!step.done && step.href ? (
                <a href={step.href} className="-mx-2 flex h-control-sm items-center gap-3 rounded-control px-2 outline-none hover:bg-hover focus-visible:shadow-focus">
                  {content}
                </a>
              ) : (
                <span className="-mx-2 flex h-control-sm items-center gap-3 px-2">{content}</span>
              )}
            </li>
          );
        })}
      </ul>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export { OnboardingChecklist };
