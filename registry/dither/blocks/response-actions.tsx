"use client";

import * as React from "react";
import { Copy01Icon, RefreshIcon, Share08Icon, ThumbsDownIcon, ThumbsUpIcon, Tick02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/dither/ui/tooltip";

type Feedback = "up" | "down" | null;

export interface ResponseActionsProps extends React.ComponentProps<"div"> {
  /** Text copied by the copy button. */
  copyText?: string;
  onRegenerate?: () => void;
  onShare?: () => void;
  feedback?: Feedback;
  onFeedbackChange?: (feedback: Feedback) => void;
}

const btn =
  "inline-flex size-control-xs items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-hover hover:text-foreground focus-visible:shadow-focus aria-pressed:text-foreground aria-pressed:bg-background-muted";

function Action({ label, children, ...props }: React.ComponentProps<"button"> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={label} className={btn} {...props}>
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Row of actions under an AI answer: copy, feedback, regenerate, share. */
function ResponseActions({ copyText, onRegenerate, onShare, feedback: feedbackProp, onFeedbackChange, className, ...props }: ResponseActionsProps) {
  const [copied, setCopied] = React.useState(false);
  const [localFeedback, setLocalFeedback] = React.useState<Feedback>(null);
  const feedback = feedbackProp !== undefined ? feedbackProp : localFeedback;
  const setFeedback = (f: Feedback) => {
    setLocalFeedback(f);
    onFeedbackChange?.(f);
  };

  return (
    <div data-slot="response-actions" className={cn("flex items-center gap-0.5", className)} {...props}>
      <Action
        label={copied ? "Copied" : "Copy"}
        onClick={async () => {
          if (copyText) {
            try {
              await navigator.clipboard.writeText(copyText);
            } catch {
              /* clipboard unavailable */
            }
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        <Icon icon={copied ? Tick02Icon : Copy01Icon} />
      </Action>
      <Action label="Good response" aria-pressed={feedback === "up"} onClick={() => setFeedback(feedback === "up" ? null : "up")}>
        <Icon icon={ThumbsUpIcon} />
      </Action>
      <Action label="Bad response" aria-pressed={feedback === "down"} onClick={() => setFeedback(feedback === "down" ? null : "down")}>
        <Icon icon={ThumbsDownIcon} />
      </Action>
      {onRegenerate ? (
        <Action label="Regenerate" onClick={onRegenerate}>
          <Icon icon={RefreshIcon} />
        </Action>
      ) : null}
      {onShare ? (
        <Action label="Share" onClick={onShare}>
          <Icon icon={Share08Icon} />
        </Action>
      ) : null}
    </div>
  );
}

export { ResponseActions };
