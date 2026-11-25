"use client";

import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

/** Blur radius per layer (px): each one covers a shorter band, so the blur ramps up towards the edge. */
const LAYERS = [0.5, 1, 2, 4, 8, 16];

/**
 * Progressive blur: stacked `backdrop-filter` layers, each masked to a narrower band, so content
 * scrolling under it gets blurrier towards the top edge, with a light background tint on top.
 * Hidden until the nearest scroll container (the shell's <main>, else the window) has scrolled,
 * so nothing under the title is blurred at rest.
 * Place it absolutely (e.g. `absolute inset-x-0 top-full h-10`) under a sticky header.
 */
export function ProgressiveBlur({ className, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const scroller: HTMLElement | null = ref.current?.closest("main") ?? null;
    const target: HTMLElement | Window = scroller ?? window;
    const read = () => setScrolled((scroller ? scroller.scrollTop : window.scrollY) > 4);
    read();
    target.addEventListener("scroll", read, { passive: true });
    return () => target.removeEventListener("scroll", read);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="progressive-blur"
      data-scrolled={scrolled || undefined}
      className={cn("pointer-events-none opacity-0 transition-opacity duration-300 data-scrolled:opacity-100", className)}
      {...props}
    >
      {LAYERS.map((blur, i) => {
        const end = 100 - (i * 100) / LAYERS.length;
        const mask = `linear-gradient(to bottom, #000 ${Math.max(0, end - 35)}%, transparent ${end}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, maskImage: mask, WebkitMaskImage: mask }}
          />
        );
      })}
      <div className="absolute inset-0 bg-linear-to-b from-background/80 to-transparent" />
    </div>
  );
}
