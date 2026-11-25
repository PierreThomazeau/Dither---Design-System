"use client";

import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

export interface ChipProps extends Omit<React.ComponentProps<"span">, "onClick"> {
  selected?: boolean;
  /** Makes the chip a toggle (aria-pressed). */
  onSelectedChange?: (selected: boolean) => void;
  /** Shows a remove button. */
  onRemove?: () => void;
  icon?: React.ReactNode;
}

/** Compact filter / tag chip: selectable, removable. */
function Chip({ selected = false, onSelectedChange, onRemove, icon, className, children, ...props }: ChipProps) {
  const labelText = typeof children === "string" ? children : "chip";
  const body = (
    <>
      {icon}
      <span className="font-mono tabular">{children}</span>
    </>
  );
  return (
    <span
      data-slot="chip"
      data-selected={selected || undefined}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full border bg-surface text-xs font-medium shadow-2xs transition-colors [&_svg]:size-3",
        "data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:animate-[liquid-pop_var(--duration-liquid)_var(--ease-out-soft)]",
        onRemove ? "pr-1 pl-2.5" : "px-2.5",
        className,
      )}
      {...props}
    >
      {onSelectedChange ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onSelectedChange(!selected)}
          className="-my-1 inline-flex items-center gap-1 rounded-full outline-none focus-visible:shadow-focus"
        >
          {body}
        </button>
      ) : (
        body
      )}
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${labelText}`}
          onClick={onRemove}
          className="inline-flex size-5 items-center justify-center rounded-full opacity-60 outline-none hover:bg-current/10 hover:opacity-100 focus-visible:shadow-focus"
        >
          <Icon icon={Cancel01Icon} size={12} />
        </button>
      ) : null}
    </span>
  );
}

export { Chip };
