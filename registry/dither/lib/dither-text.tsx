"use client";

import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * DitherText: streaming text that resolves word by word. Each new word
 * appears as sparse 2px dots (25 %), then 50 %, 75 %, then the letters
 * (masks in styles/motion.css: --dither-resolve-1…3). Words already
 * shown never animate again, so it suits token-by-token streaming.
 * Under reduced motion the words simply appear.
 * ------------------------------------------------------------------ */

export interface DitherTextProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** The text so far (grows while streaming). */
  text: string;
  /** ms per word resolve. */
  duration?: number;
}

function DitherText({ text, duration = 360, className, ...props }: DitherTextProps) {
  const parts = text.split(/(\s+)/);
  return (
    <span data-slot="dither-text" className={cn("whitespace-pre-wrap", className)} {...props}>
      {parts.map((part, i) =>
        /^\s+$/.test(part) || part === "" ? (
          part
        ) : (
          <span
            key={i}
            className="motion-safe:animate-[dither-resolve_var(--dither-text-duration)_steps(1,end)_both]"
            style={{ ["--dither-text-duration" as string]: `${duration}ms`, maskSize: "16px 16px", WebkitMaskSize: "16px 16px" }}
          >
            {part}
          </span>
        ),
      )}
    </span>
  );
}

export { DitherText };
