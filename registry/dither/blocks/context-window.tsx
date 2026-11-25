import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

const SEGMENT_COLORS = ["bg-foreground", "bg-chart-4", "bg-chart-1", "bg-chart-2", "bg-chart-3"] as const;

export interface ContextSegment {
  label: string;
  tokens: number;
}

export interface ContextWindowProps extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  /** Max tokens of the model. */
  max: number;
  segments: ContextSegment[];
  title?: React.ReactNode;
}

const compact = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);

/** Token budget breakdown for an AI conversation; free space in dither. */
function ContextWindow({ max, segments, title = "Context window", className, ...props }: ContextWindowProps) {
  const used = segments.reduce((sum, s) => sum + s.tokens, 0);
  return (
    <div data-slot="context-window" className={cn("flex w-full max-w-xs flex-col gap-3 rounded-field border bg-surface p-4 shadow-xs", className)} {...props}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{title}</span>
        <span className="font-mono text-xs text-muted-foreground tabular">
          {compact(used)} / {compact(max)}
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={used}
        aria-label="Tokens used"
        className="relative flex h-1.5 gap-0.5 overflow-hidden rounded-full"
      >
        <span aria-hidden="true" className="bg-dither-organic absolute inset-0" />
        {segments.map((s, i) => (
          <span key={s.label} className={cn("relative h-full first:rounded-l-full", SEGMENT_COLORS[i % SEGMENT_COLORS.length])} style={{ width: `${(s.tokens / max) * 100}%` }} />
        ))}
      </div>
      <ul className="flex flex-col gap-1 text-xs">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-[2px]", SEGMENT_COLORS[i % SEGMENT_COLORS.length])} />
            <span className="flex-1 text-muted-foreground">{s.label}</span>
            <span className="font-mono font-medium tabular">{compact(s.tokens)}</span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span className="bg-dither-fine size-2.5 rounded-[2px]" />
          <span className="flex-1 text-muted-foreground">Free</span>
          <span className="font-mono font-medium tabular">{compact(max - used)}</span>
        </li>
      </ul>
    </div>
  );
}

export { ContextWindow };
