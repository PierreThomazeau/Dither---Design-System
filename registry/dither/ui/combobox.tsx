"use client";

import * as React from "react";
import { ArrowDown01Icon, Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { fieldVariants, type ControlSize } from "@/registry/dither/lib/control";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/dither/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/dither/ui/popover";

/* ------------------------------------------------------------------ *
 * Combobox: a searchable select (Popover + Command). Single value, or
 * `multiple` with removable chips in the trigger. Same height and look
 * as every other field.
 * ------------------------------------------------------------------ */

export type ComboboxOption = { value: string; label: string; icon?: React.ReactNode; disabled?: boolean };

type Common = {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: ControlSize;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  id?: string;
};

export type ComboboxProps =
  | (Common & { multiple?: false; value?: string | null; defaultValue?: string | null; onValueChange?: (value: string | null) => void })
  | (Common & { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void });

function Combobox(props: ComboboxProps) {
  const { options, placeholder = "Select…", searchPlaceholder = "Search…", emptyText = "Nothing found.", size, disabled, className, id } = props;
  const [open, setOpen] = React.useState(false);
  const listId = `combobox-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const [inner, setInner] = React.useState<string[]>(() =>
    props.multiple ? (props.defaultValue ?? []) : props.defaultValue ? [props.defaultValue] : [],
  );
  const selected: string[] = props.multiple ? (props.value ?? inner) : props.value !== undefined ? (props.value ? [props.value] : []) : inner;

  const commit = (next: string[]) => {
    setInner(next);
    if (props.multiple) props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? null);
  };
  const toggle = (v: string) => {
    if (props.multiple) commit(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    else {
      commit(selected[0] === v ? [] : [v]);
      setOpen(false);
    }
  };
  const byValue = (v: string) => options.find((o) => o.value === v);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={props["aria-label"]}
          data-placeholder={selected.length ? undefined : ""}
          className={cn(fieldVariants({ size }), "h-auto justify-between gap-2 text-left", props.multiple ? "min-h-control py-1 pl-1.5" : "", className)}
        >
          {props.multiple && selected.length ? (
            <span className="flex min-w-0 flex-wrap gap-1">
              {selected.map((v) => (
                <span key={v} className="inline-flex h-7 items-center gap-1 rounded-full bg-background-muted pr-1 pl-2.5 text-xs font-medium">
                  {byValue(v)?.label ?? v}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={`Remove ${byValue(v)?.label ?? v}`}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(v);
                    }}
                    className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-hover hover:text-foreground"
                  >
                    <Icon icon={Cancel01Icon} size={12} />
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span className={cn("truncate", !selected.length && "text-muted-foreground", props.multiple && "pl-2.5")}>
              {selected.length ? byValue(selected[0])?.label : placeholder}
            </span>
          )}
          <Icon icon={ArrowDown01Icon} className="shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent id={listId} align="start" className="w-(--radix-popover-trigger-width) min-w-56 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o.value} value={o.label} disabled={o.disabled} onSelect={() => toggle(o.value)}>
                  {o.icon}
                  <span className="flex-1">{o.label}</span>
                  {selected.includes(o.value) ? <Icon icon={Tick02Icon} className="text-foreground" /> : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
