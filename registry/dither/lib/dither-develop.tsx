"use client";

import * as React from "react";

import { drawSweep, fitCanvas, readColors } from "@/registry/dither/lib/moment-sweep";
import { emitMoment, motionFactor, SIGNATURE_STOPS, type MomentName } from "@/registry/dither/lib/moments";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * DitherDevelop: content "develops" like a photo. While loading, the
 * area is grey dither (the skeleton). When `ready` turns true, the
 * signature band (chart colours, 2px dots) rises from the bottom; the
 * content appears behind it and the skeleton is eaten ahead of it.
 * Under reduced motion: a plain 200ms fade.
 * ------------------------------------------------------------------ */

export interface DitherDevelopProps extends React.ComponentProps<"div"> {
  ready: boolean;
  /** Shown while loading, over the hidden content (default: the dither skeleton only). */
  placeholder?: React.ReactNode;
  /** ms at normal motion. */
  duration?: number;
  /** Emit a moment when the reveal starts (e.g. "success" or "upload"). */
  moment?: MomentName;
  onRevealed?: () => void;
}

type Phase = "loading" | "revealing" | "done";

function DitherDevelop({ ready, placeholder, duration = 1100, moment, onRevealed, className, children, ...props }: DitherDevelopProps) {
  // Already ready on first render: no animation.
  const [phase, setPhase] = React.useState<Phase>(ready ? "done" : "loading");
  if (!ready && phase !== "loading") setPhase("loading");
  if (ready && phase === "loading") setPhase("revealing");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const revealed = React.useRef(onRevealed);
  React.useEffect(() => {
    revealed.current = onRevealed;
  });

  // Loading: static grey skeleton dots.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (phase !== "loading" || !canvas) return;
    const paint = () => {
      const { ctx, w, h } = fitCanvas(canvas);
      const skeleton = `rgb(${readColors(canvas, ["--border-strong"])[0].join(",")})`;
      drawSweep(ctx, w, h, 0, { colors: readColors(canvas, SIGNATURE_STOPS), skeleton });
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [phase]);

  // Reveal.
  React.useEffect(() => {
    const canvas = canvasRef.current, content = contentRef.current;
    if (phase !== "revealing" || !canvas || !content) return;
    if (moment) emitMoment(moment);
    const factor = motionFactor();
    const finish = () => {
      content.style.maskImage = content.style.webkitMaskImage = "";
      setPhase("done");
      revealed.current?.();
    };
    if (factor === 0) {
      content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" }).onfinish = finish;
      return;
    }
    const { ctx, w, h } = fitCanvas(canvas);
    const colors = readColors(canvas, SIGNATURE_STOPS);
    const skeleton = `rgb(${readColors(canvas, ["--border-strong"])[0].join(",")})`;
    const total = duration * factor;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / total);
      const front = drawSweep(ctx, w, h, p, { dir: "up", colors, skeleton });
      // Content shows behind the band: everything below (front) from the bottom, softly.
      const edge = Math.max(0, front - 8);
      const mask = `linear-gradient(to top, #000 ${edge}px, transparent ${edge + 24}px)`;
      content.style.maskImage = content.style.webkitMaskImage = mask;
      if (p < 1) raf = requestAnimationFrame(frame);
      else finish();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, duration, moment]);

  return (
    <div data-slot="dither-develop" data-phase={phase} aria-busy={phase === "loading" || undefined} className={cn("relative isolate overflow-hidden", className)} {...props}>
      <div ref={contentRef} className={cn(phase === "loading" && "invisible")} style={phase === "revealing" ? { maskImage: "linear-gradient(transparent, transparent)" } : undefined}>
        {children}
      </div>
      {phase === "loading" && placeholder ? <div className="absolute inset-0">{placeholder}</div> : null}
      {phase !== "done" ? <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 size-full" /> : null}
    </div>
  );
}

export { DitherDevelop };
