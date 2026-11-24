"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { AiBrain01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

export interface ReasoningBlockProps extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  /** e.g. "Thought for 12 seconds". */
  label?: React.ReactNode;
  /** While the model is still thinking: animated label. */
  streaming?: boolean;
}

/** Collapsible chain-of-thought summary shown above an AI answer. */
function ReasoningBlock({ label = "Thought for a few seconds", streaming = false, className, children, ...props }: ReasoningBlockProps) {
  return (
    <CollapsiblePrimitive.Root data-slot="reasoning-block" className={cn("group/reasoning flex flex-col gap-2", className)} {...props}>
      <CollapsiblePrimitive.Trigger className="inline-flex w-fit items-center gap-1.5 rounded-control text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:shadow-focus">
        <Icon icon={AiBrain01Icon} />
        <span className={cn(streaming && "animate-pulse motion-reduce:animate-none")}>{label}</span>
        <Icon icon={ArrowDown01Icon} className="transition-transform duration-150 group-data-[state=open]/reasoning:rotate-180" />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="ml-2 border-l border-dashed border-border-strong pl-4 text-sm leading-6 text-muted-foreground">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

export { ReasoningBlock };
