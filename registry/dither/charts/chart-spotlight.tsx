"use client";

import * as React from "react";

/**
 * Pointer spotlight for chart cards: a blurred chart-1 light and an organic dither tinted in
 * chart-1 follow the cursor, under the plot (the solid marks stay on top). It listens on its
 * parent, which needs `group/chart relative isolate overflow-hidden` (ChartCard sets it).
 * Follows the pointer only: no animation of its own, so it is fine under reduced motion.
 */
export function ChartSpotlight() {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      host.style.setProperty("--sx", `${e.clientX - rect.left}px`);
      host.style.setProperty("--sy", `${e.clientY - rect.top}px`);
    };
    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="chart-spotlight"
      className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/chart:opacity-100"
    >
      <span
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle 220px at var(--sx, 50%) var(--sy, 50%), color-mix(in oklab, var(--chart-1) 14%, transparent), transparent 70%)" }}
      />
      <span
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(circle 150px at var(--sx, 50%) var(--sy, 50%), #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle 150px at var(--sx, 50%) var(--sy, 50%), #000, transparent 75%)",
        }}
      >
        <span className="bg-dither-organic absolute inset-0 [--dither-color:color-mix(in_oklab,var(--chart-1)_50%,transparent)]" />
      </span>
    </span>
  );
}
