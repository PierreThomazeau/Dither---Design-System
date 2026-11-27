"use client";

import * as React from "react";
import { Alert02Icon, ArrowTurnBackwardIcon, Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Toast as ToastPrimitive } from "radix-ui";

import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";
import { MomentSweep } from "@/registry/dither/lib/moment-sweep";
import { emitMoment, type MomentName } from "@/registry/dither/lib/moments";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * Toast: one store, `toast()` from anywhere, <Toaster /> once.
 *  - toast.success: the signature sweep runs through it, moment "success"
 *  - toast.error:   short pulse, moment "error"
 *  - toast.undo:    "Deleted · Undo" with a dither countdown that drains;
 *                   moment "delete", then "undo" if the action is used
 * Radix Toast gives the live region, swipe to dismiss, pause on hover
 * and focus (F8 jumps to the toasts).
 * ------------------------------------------------------------------ */

export type ToastVariant = "default" | "success" | "error" | "undo";

export type ToastOptions = {
  description?: React.ReactNode;
  /** ms before it closes (default 5000; undo 6000). Infinity keeps it. */
  duration?: number;
  action?: { label: string; onClick: () => void };
  /** Emit the matching moment (companion, sound, haptics). Default true. */
  moment?: boolean;
};

type ToastItem = ToastOptions & { id: number; title: React.ReactNode; variant: ToastVariant; open: boolean };

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function push(variant: ToastVariant, title: React.ReactNode, opts: ToastOptions = {}, moment?: MomentName) {
  const id = nextId++;
  items = [...items, { id, title, variant, open: true, ...opts }];
  emit();
  if (moment && opts.moment !== false) emitMoment(moment, typeof title === "string" ? title : undefined);
  return id;
}

function dismiss(id?: number) {
  items = items.map((t) => (id === undefined || t.id === id ? { ...t, open: false } : t));
  emit();
  // Remove after the close animation.
  setTimeout(() => {
    items = items.filter((t) => t.open);
    emit();
  }, 300);
}

/** Show a toast. `toast.success / error / undo` add the matching look and moment. */
export const toast = Object.assign((title: React.ReactNode, opts?: ToastOptions) => push("default", title, opts), {
  success: (title: React.ReactNode, opts?: ToastOptions) => push("success", title, opts, "success"),
  error: (title: React.ReactNode, opts?: ToastOptions) => push("error", title, opts, "error"),
  /** "Deleted" with an Undo action and a draining countdown. */
  undo: (title: React.ReactNode, { onUndo, ...opts }: ToastOptions & { onUndo: () => void }) =>
    push(
      "undo",
      title,
      {
        duration: 6000,
        ...opts,
        action: {
          label: "Undo",
          onClick: () => {
            onUndo();
            emitMoment("undo");
          },
        },
      },
      "delete",
    ),
  dismiss,
});

function useToasts() {
  return React.useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => items,
    () => items,
  );
}

const ICONS = {
  default: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  error: Alert02Icon,
  undo: ArrowTurnBackwardIcon,
} as const;

function ToastCard({ item }: { item: ToastItem }) {
  const duration = item.duration ?? 5000;
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={item.variant}
      open={item.open}
      duration={duration}
      onOpenChange={(open) => !open && dismiss(item.id)}
      className={cn(
        "group/toast relative isolate flex w-full items-start gap-3 overflow-hidden rounded-field border bg-surface p-4 pr-10 shadow-popover outline-none focus-visible:shadow-focus",
        "motion-overlay data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-4",
        "data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full",
        item.variant === "error" && "border-destructive/30 motion-safe:animate-[moment-error_360ms_ease-in-out]",
      )}
    >
      {item.variant === "success" ? <MomentSweep play={item.id} direction="right" /> : null}
      <Icon
        icon={ICONS[item.variant]}
        className={cn(
          "mt-0.5 shrink-0",
          item.variant === "success" && "text-positive-ink",
          item.variant === "error" && "text-destructive-ink",
          (item.variant === "default" || item.variant === "undo") && "text-muted-foreground",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <ToastPrimitive.Title className="text-sm font-medium">{item.title}</ToastPrimitive.Title>
        {item.description ? <ToastPrimitive.Description className="text-sm text-muted-foreground">{item.description}</ToastPrimitive.Description> : null}
      </div>
      {item.action ? (
        <ToastPrimitive.Action
          altText={item.action.label}
          onClick={item.action.onClick}
          className="inline-flex h-control-xs shrink-0 items-center rounded-control border bg-surface px-3 text-xs font-medium outline-none hover:bg-hover focus-visible:shadow-focus"
        >
          {item.action.label}
        </ToastPrimitive.Action>
      ) : null}
      <ToastPrimitive.Close
        aria-label="Close"
        className="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus"
      >
        <Icon icon={Cancel01Icon} size={14} />
      </ToastPrimitive.Close>
      {Number.isFinite(duration) ? (
        /* Countdown: a dither strip that drains, paused while hovered or focused (as is the timer). */
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 origin-left overflow-hidden group-hover/toast:[animation-play-state:paused] group-focus-within/toast:[animation-play-state:paused] motion-safe:animate-[toast-countdown_linear_forwards]"
          style={{ animationDuration: `${duration}ms` }}
        >
          <DitherFill variant="organic" />
        </span>
      ) : null}
    </ToastPrimitive.Root>
  );
}

/** Mount once (root layout). Toasts stack bottom-right; F8 focuses them. */
function Toaster({ className }: { className?: string }) {
  const list = useToasts();
  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
      {list.map((t) => (
        <ToastCard key={t.id} item={t} />
      ))}
      <ToastPrimitive.Viewport
        data-slot="toaster"
        className={cn("fixed right-0 bottom-0 z-[100] m-0 flex w-full max-w-sm list-none flex-col gap-2 p-4 outline-none", className)}
      />
    </ToastPrimitive.Provider>
  );
}

export { Toaster };
