import * as React from "react";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

import { ProgressiveBlur } from "@/components/showcase/progressive-blur";
import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/dither/ui/avatar";
import { Badge } from "@/registry/dither/ui/badge";

/**
 * Screen title row: title, sync status, presence, live badge and actions.
 * Sticks to the top of the shell's scroll area (it covers the parent's p-5 / md:p-6 padding);
 * the content scrolling under it goes through a progressive blur instead of a hard line.
 */
export function PageHeader({
  title,
  status,
  people = [],
  live = false,
  actions,
}: {
  title: React.ReactNode;
  status?: string;
  people?: string[];
  live?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-5 -mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 px-5 pt-5 pb-3 md:-mx-6 md:-mt-6 md:px-6 md:pt-6">
      <h1 className="mr-auto text-3xl leading-9 font-semibold tracking-tight">{title}</h1>
      {status ? (
        <span className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
          <Icon icon={CheckmarkCircle01Icon} />
          {status}
        </span>
      ) : null}
      {people.length ? (
        <AvatarGroup className="hidden md:flex">
          {people.map((p) => (
            <Avatar key={p} size="xs">
              <AvatarFallback>{p}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      ) : null}
      {live ? (
        <Badge variant="outline">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive motion-reduce:animate-none" />
          Live
        </Badge>
      ) : null}
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      {/* Opaque, the same background as the top bar; the blur lives in a sibling layer under it. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background" />
      <ProgressiveBlur className="absolute inset-x-0 top-full -z-10 h-12" />
    </div>
  );
}

/** Section title with optional right-side meta. */
export function SectionTitle({ title, meta }: { title: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {meta ? <span className="text-xs text-muted-foreground">{meta}</span> : null}
    </div>
  );
}

/** Plain bordered panel with a title row, used across screens. */
export function Panel({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={["flex min-w-0 flex-col gap-4 rounded-surface border bg-surface p-5 shadow-xs", className].filter(Boolean).join(" ")}>
      {title ? (
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
