"use client";

import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Slot } from "radix-ui";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Button } from "@/registry/dither/ui/button";

/* ------------------------------------------------------------------ *
 * Side Panel: a right-hand panel that PUSHES the content (it takes its
 * own column, never floats over the page). Styled as a full-height card
 * with the surface radius on a darker ground. Motion rule: opens in
 * 200ms ease-out, closes in 100ms ease-in (motion-transition).
 * ------------------------------------------------------------------ */

type SidePanelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  /** Which content the panel shows (one panel, several views: e.g. "details" and "assistant"). */
  view: string;
  /** Opens the panel on `view`, or closes it if that view is already open. */
  toggleView: (view: string) => void;
  panelId: string;
};

const SidePanelContext = React.createContext<SidePanelContextValue | null>(null);

function useSidePanel() {
  const ctx = React.useContext(SidePanelContext);
  if (!ctx) throw new Error("useSidePanel must be used inside <SidePanelProvider>.");
  return ctx;
}

function SidePanelProvider({
  defaultOpen = false,
  defaultView = "default",
  open: openProp,
  onOpenChange,
  children,
}: {
  defaultOpen?: boolean;
  defaultView?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const [view, setView] = React.useState(defaultView);
  const open = openProp ?? uncontrolled;
  const panelId = `side-panel-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen(!open),
      view,
      toggleView: (next: string) => {
        if (open && view === next) return setOpen(false);
        setView(next);
        if (!open) setOpen(true);
      },
      panelId,
    }),
    [open, setOpen, view, panelId],
  );
  return <SidePanelContext.Provider value={value}>{children}</SidePanelContext.Provider>;
}

/** Row that holds the content and the panel side by side. The content column shrinks when the panel opens. */
function SidePanelLayout({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-panel-layout" className={cn("flex min-h-0 min-w-0 flex-1", className)} {...props} />;
}

/** The content column next to the panel. */
function SidePanelInset({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-panel-inset" className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)} {...props} />;
}

/**
 * The panel. Its column animates from 0 to `width`, so the content reflows instead of being covered;
 * the card inside keeps its width and fades / slides in with the same timing. Closed: inert.
 */
function SidePanel({
  width = 380,
  label = "Details",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"aside">, "aria-label"> & { width?: number; label?: string }) {
  const { open, setOpen, panelId } = useSidePanel();
  const state = open ? "open" : "closed";

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      // A popover, menu or select open on top handles this Escape: close that, not the panel.
      if (document.querySelector("[data-radix-popper-content-wrapper]")) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <aside
      id={panelId}
      data-slot="side-panel"
      data-state={state}
      aria-label={label}
      aria-hidden={!open}
      inert={!open}
      className={cn("motion-transition relative h-full shrink-0 overflow-hidden transition-[width]", className)}
      style={{ width: open ? width : 0 }}
      {...props}
    >
      <div className="h-full p-2 pl-0" style={{ width }}>
        <div
          data-state={state}
          className={cn(
            "motion-transition flex h-full flex-col overflow-hidden rounded-surface bg-background-muted transition-[opacity,translate] dark:bg-surface",
            "data-[state=closed]:translate-x-4 data-[state=closed]:opacity-0",
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}

function SidePanelHeader({ title, description, className, ...props }: Omit<React.ComponentProps<"div">, "title"> & { title: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div data-slot="side-panel-header" className={cn("flex items-start justify-between gap-3 p-5 pb-3", className)} {...props}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="truncate text-lg leading-7 font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <SidePanelClose />
    </div>
  );
}

function SidePanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-panel-content" className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5", className)} {...props} />;
}

function SidePanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-panel-footer" className={cn("flex items-center justify-end gap-2 border-t p-4", className)} {...props} />;
}

/** Toggles the panel. `view` opens it on that view (or closes it if it is the one showing). `asChild` to use your own Button. */
function SidePanelTrigger({ asChild = false, view, onClick, ...props }: React.ComponentProps<"button"> & { asChild?: boolean; view?: string }) {
  const { open, toggle, toggleView, view: current, panelId } = useSidePanel();
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="side-panel-trigger"
      aria-expanded={view ? open && current === view : open}
      aria-controls={panelId}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (view) toggleView(view);
        else toggle();
      }}
      {...(asChild ? {} : { type: "button" as const })}
      {...props}
    />
  );
}

function SidePanelClose({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { setOpen } = useSidePanel();
  return (
    <Button variant="ghost" size="icon-sm" aria-label="Close panel" className={className} onClick={() => setOpen(false)} {...props}>
      <Icon icon={Cancel01Icon} />
    </Button>
  );
}

export {
  SidePanel,
  SidePanelClose,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelInset,
  SidePanelLayout,
  SidePanelProvider,
  SidePanelTrigger,
  useSidePanel,
};
