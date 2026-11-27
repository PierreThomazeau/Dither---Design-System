import * as React from "react";
import { ArrowDownRight01Icon, ArrowRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import { Sparkline } from "@/registry/dither/blocks/sparkline";
import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

type Trend = "up" | "down" | "neutral";

const trendClass: Record<Trend, string> = {
  up: "text-positive-ink",
  down: "text-destructive-ink",
  neutral: "text-muted-foreground",
};

const trendIcon = { up: ArrowUpRight01Icon, down: ArrowDownRight01Icon, neutral: ArrowRight01Icon };

export interface StatCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  caption?: React.ReactNode;
  trend?: Trend;
  /** Icon in the top-right corner (a Hugeicons icon). */
  icon?: React.ReactNode;
  /** Sparkline values; coloured by trend, over a dither backdrop. */
  sparkline?: number[];
  /** gradient: a dither corner fading from the top right. */
  variant?: "default" | "gradient";
}

/** KPI card: label, big value (Manrope semibold), mono delta and caption, optional sparkline. */
function StatCard({
  label,
  value,
  delta,
  caption,
  trend = "neutral",
  icon,
  sparkline,
  variant = "default",
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      data-trend={trend}
      className={cn("relative isolate flex flex-col gap-3 overflow-hidden rounded-surface border bg-surface p-4 shadow-xs", className)}
      {...props}
    >
      {variant === "gradient" ? (
        <DitherFill shape="scatter" scale={2} fade="corner" className="inset-auto top-0 right-0 -z-10 h-24 w-2/3" />
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon ? <span className="text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-heading text-3xl leading-9 font-semibold tracking-tight tabular">{value}</span>
          {delta || caption ? (
            <span className="flex flex-wrap items-center gap-x-1.5 text-xs">
              {delta ? (
                <span className={cn("inline-flex items-center gap-0.5 font-mono font-medium tabular", trendClass[trend])}>
                  <Icon icon={trendIcon[trend]} size={12} strokeWidth={2} />
                  {delta}
                </span>
              ) : null}
              {caption ? <span className="text-muted-foreground">{caption}</span> : null}
            </span>
          ) : null}
        </div>
        {sparkline ? <Sparkline data={sparkline} dither className={cn("h-10 w-24 shrink-0 rounded-hairline", trendClass[trend])} /> : null}
      </div>
    </div>
  );
}

export { StatCard };
