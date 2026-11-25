/**
 * Shared menu styles (Dropdown Menu, Command, later Context Menu and Menubar):
 * panels are rounded-field, items rounded-control-min, 36px high.
 */
export const menuPanelClass =
  "z-50 min-w-48 overflow-x-hidden overflow-y-auto rounded-field border bg-surface p-1 text-foreground shadow-popover";

export const menuItemClass = [
  "relative flex h-control-sm cursor-default items-center gap-2 rounded-control-min px-3 text-sm outline-none select-none",
  "focus:bg-hover data-[highlighted]:bg-hover data-[selected=true]:bg-hover",
  // Radix sets data-disabled="" when disabled; cmdk sets data-disabled="true" | "false" on every item.
  "data-[disabled]:not-data-[disabled=false]:pointer-events-none data-[disabled]:not-data-[disabled=false]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
  "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:[&_svg]:text-destructive",
].join(" ");

export const menuLabelClass = "px-3 pt-2 pb-1 font-mono text-xs text-muted-foreground uppercase";

export const menuSeparatorClass = "-mx-1 my-1 h-px bg-border";

export const menuShortcutClass = "ml-auto font-mono text-xs tracking-wide text-muted-foreground";
