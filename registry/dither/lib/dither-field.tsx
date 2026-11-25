"use client";

import * as React from "react";

import { ditherTile, type DitherVariant } from "@/registry/dither/lib/dither-tile";
import { cn } from "@/registry/dither/lib/utils";

export interface DitherFieldProps extends React.ComponentProps<"canvas"> {
  variant?: DitherVariant;
  /** Gradient variant: height (px) over which the density fades out. */
  gradientHeight?: number;
  /** Radius of the cursor's influence, in px. */
  radius?: number;
  /** How far dots are pushed away (1 = default). */
  strength?: number;
}

type Dot = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

const STIFFNESS = 0.08;
const DAMPING = 0.82;
const REST = 0.02;

function readColor(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return cs.getPropertyValue("--dither-color").trim() || cs.getPropertyValue("--border-strong").trim() || "#d3d3d3";
}

function buildDots(variant: DitherVariant, w: number, h: number, gradientHeight?: number): { dots: Dot[]; size: number } {
  const tile = ditherTile(variant, gradientHeight ?? Math.max(64, h));
  const dots: Dot[] = [];
  const rows = variant === "gradient" ? 1 : Math.ceil(h / tile.height);
  const cols = Math.ceil(w / tile.width);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const d of tile.dots) {
        const x = c * tile.width + d.x;
        const y = r * tile.height + d.y;
        if (x < w && y < h) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      }
    }
  }
  return { dots, size: tile.dot };
}

/**
 * Interactive dither: the same dot geometry as <DitherPattern>, drawn on a canvas.
 * Dots are pushed away from the pointer and spring back. It listens on its parent, so it works
 * under content. Static when the user prefers reduced motion.
 * Place it as the first child of a `relative` element (it fills it, like DitherFill).
 */
export function DitherField({ variant = "regular", gradientHeight, radius = 72, strength = 1, className, ...props }: DitherFieldProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let size = 2;
    let color = readColor(canvas);
    let w = 0;
    let h = 0;
    let frame = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const d of dots) ctx.fillRect(d.x, d.y, size, size);
    };

    const step = () => {
      let energy = 0;
      const r2 = radius * radius;
      for (const d of dots) {
        let ax = (d.ox - d.x) * STIFFNESS;
        let ay = (d.oy - d.y) * STIFFNESS;
        if (pointer.active) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < r2 && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / radius) ** 2 * 2.4 * strength;
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
          }
        }
        d.vx = (d.vx + ax) * DAMPING;
        d.vy = (d.vy + ay) * DAMPING;
        d.x += d.vx;
        d.y += d.vy;
        energy += Math.abs(d.vx) + Math.abs(d.vy) + Math.abs(d.x - d.ox) + Math.abs(d.y - d.oy);
      }
      draw();
      frame = pointer.active || energy > REST * dots.length ? requestAnimationFrame(step) : 0;
    };

    const wake = () => {
      if (!frame && !reduce) frame = requestAnimationFrame(step);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ({ dots, size } = buildDots(variant, w, h, gradientHeight));
      color = readColor(canvas);
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      wake();
    };
    const onLeave = () => {
      pointer.active = false;
      wake();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    // Theme changes (class on <html>) change --border-strong: redraw with the new colour.
    const mo = new MutationObserver(() => {
      color = readColor(canvas);
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    if (!reduce) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [variant, gradientHeight, radius, strength]);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} {...props} />;
}
