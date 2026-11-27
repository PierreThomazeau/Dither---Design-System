import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/registry/dither/lib/utils";

type From = "user" | "assistant";

export interface MessageProps extends React.ComponentProps<"div"> {
  from: From;
  /** Avatar on the assistant side (or the user side, if you want one). */
  avatar?: React.ReactNode;
  /** Name and / or time above the message, in mono. */
  meta?: React.ReactNode;
}

/** A chat message row: user on the right, assistant on the left. */
function Message({ from, avatar, meta, className, children, ...props }: MessageProps) {
  return (
    <div
      data-slot="message"
      data-from={from}
      className={cn("group/message flex w-full gap-2", from === "user" ? "flex-row-reverse items-end" : "flex-row items-start", className)}
      {...props}
    >
      {avatar ? <span className="shrink-0 group-data-[from=assistant]/message:mt-0.5">{avatar}</span> : null}
      <div className={cn("flex max-w-[80%] min-w-0 flex-col gap-1", from === "user" ? "items-end" : "items-start")}>
        {meta ? <span className="px-1 font-mono text-xs text-muted-foreground tabular">{meta}</span> : null}
        {children}
      </div>
    </div>
  );
}

const bubbleVariants = cva("w-fit max-w-full rounded-field px-3.5 py-2 text-sm leading-6 break-words", {
  variants: {
    variant: {
      /** Default for the user: dark fill. */
      primary: "bg-primary text-primary-foreground",
      /** Default for the assistant: muted fill. */
      muted: "bg-background-muted text-foreground",
      outline: "border bg-surface text-foreground",
      /** Assistant answer without a bubble. */
      plain: "rounded-none px-0 py-0",
      error: "border border-destructive/30 bg-destructive/5 text-destructive-ink",
    },
  },
});

/** Message body. Picks a variant from the parent Message if none is given. */
function Bubble({ variant, className, ...props }: React.ComponentProps<"div"> & VariantProps<typeof bubbleVariants>) {
  return (
    <div
      data-slot="bubble"
      className={cn(
        bubbleVariants({ variant }),
        !variant && "group-data-[from=user]/message:bg-primary group-data-[from=user]/message:text-primary-foreground group-data-[from=assistant]/message:bg-background-muted",
        /* Tighter corner on the speaker's side. */
        "group-data-[from=user]/message:rounded-br-micro group-data-[from=assistant]/message:rounded-bl-micro",
        variant === "plain" && "rounded-none!",
        className,
      )}
      {...props}
    />
  );
}

export { Bubble, bubbleVariants, Message };
