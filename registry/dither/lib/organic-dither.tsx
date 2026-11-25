"use client";

import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";
import { bayer, density, type OrganicShape } from "@/registry/dither/lib/organic-field";

export type { OrganicShape } from "@/registry/dither/lib/organic-field";

export interface OrganicDitherProps extends React.ComponentProps<"canvas"> {
  shape?: OrganicShape;
  /** Grid cell in px (6 = the Dither grid). */
  cell?: number;
  /** Dot side range in px: dense areas get bigger dots (squares almost touch at full density). */
  dot?: [number, number];
  /** Noise scale (higher = smaller clumps). */
  scale?: number;
  seed?: number;
  /** Drift speed (0 = still). */
  speed?: number;
  /** Cursor clears a soft hole in the field. */
  interactive?: boolean;
  /** CSS colour, defaults to --dither-color then --border-strong. */
  color?: string;
  /**
   * Tint the dots with a gradient instead of one colour. Stops are custom property names
   * (e.g. "--brand") or "transparent", read from the canvas so they follow the theme.
   */
  tint?: { stops: string[]; direction?: "to-r" | "to-l" | "to-b" };
}

function readVar(el: HTMLElement, name: string) {
  if (!name.startsWith("--")) return name;
  return getComputedStyle(el).getPropertyValue(name).trim() || "transparent";
}

function readColor(el: HTMLElement, fallback?: string) {
  if (fallback) return fallback;
  const cs = getComputedStyle(el);
  return cs.getPropertyValue("--dither-color").trim() || cs.getPropertyValue("--border-strong").trim() || "#d3d3d3";
}

/**
 * Organic dither: a pixel grid whose density follows a noise field instead of a repeating tile
 * (masses, holes, ragged edges; dense areas get bigger dots). Drifts slowly, the pointer clears a
 * soft hole, pauses off-screen, static under reduced motion. Fills its `relative` parent.
 * Use it for surfaces (heroes, cards, empty states, AI headers). For data marks (tracks,
 * remaining capacity, legends) keep the regular tile: <DitherPattern> / bg-dither-*.
 */
export function OrganicDither({
  shape = "cloud",
  cell = 6,
  dot = [2, 4],
  scale = 3,
  seed = 7,
  speed = 1,
  interactive = true,
  color,
  tint,
  className,
  ...props
}: OrganicDitherProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [d0, d1] = dot;
  const tintKey = tint ? `${tint.direction ?? "to-r"}:${tint.stops.join(",")}` : "";

  React.useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let fill = readColor(canvas, color);
    let raf = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();
    // Eased pointer + hole strength, so the hole opens and closes softly.
    const p = { x: -999, y: -999, tx: -999, ty: -999, k: 0, tk: 0 };

    const paintTint = () => {
      if (!tint) return;
      const dir = tint.direction ?? "to-r";
      const g = dir === "to-b" ? ctx.createLinearGradient(0, 0, 0, h) : dir === "to-l" ? ctx.createLinearGradient(w, 0, 0, 0) : ctx.createLinearGradient(0, 0, w, 0);
      tint.stops.forEach((name, i) => g.addColorStop(i / Math.max(1, tint.stops.length - 1), readVar(canvas, name)));
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const aspect = w / h;
      const r = Math.max(56, Math.min(w, h) * 0.32);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cell;
          const y = row * cell;
          let dens = density(shape, { u: (x + cell / 2) / w, v: (y + cell / 2) / h, aspect, t, seed, scale });
          if (p.k > 0.01) {
            const dx = x - p.x;
            const dy = y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < r) dens *= 1 - p.k * (1 - (dist / r) ** 2);
          }
          if (dens <= bayer(col, row)) continue;
          const s = Math.round((d0 + (d1 - d0) * dens * dens) * 2) / 2;
          const o = (cell - s) / 2;
          ctx.fillRect(x + o, y + o, s, s);
        }
      }
      paintTint();
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      p.x += (p.tx - p.x) * 0.18;
      p.y += (p.ty - p.y) * 0.18;
      p.k += (p.tk - p.k) * 0.12;
      if (now - last > 33) {
        last = now;
        draw(((now - start) / 1000) * speed);
      }
      const moving = speed > 0 || Math.abs(p.tk - p.k) > 0.01 || Math.abs(p.tx - p.x) > 0.5;
      if (moving) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fill = readColor(canvas, color);
      draw(((performance.now() - start) / 1000) * speed);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      p.tx = e.clientX - rect.left;
      p.ty = e.clientY - rect.top;
      if (p.k < 0.01) {
        p.x = p.tx;
        p.y = p.ty;
      }
      p.tk = 1;
      wake();
    };
    const onLeave = () => {
      p.tk = 0;
      wake();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      fill = readColor(canvas, color);
      draw(((performance.now() - start) / 1000) * speed);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    if (interactive && !reduce) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }
    wake();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [shape, cell, d0, d1, scale, seed, speed, interactive, color, tintKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} {...props} />;
}
