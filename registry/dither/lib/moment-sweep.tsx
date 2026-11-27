"use client";

import * as React from "react";

import { BAYER_4, DITHER_CELL, DITHER_DOT } from "@/registry/dither/lib/dither-tile";
import { valueNoise } from "@/registry/dither/lib/organic-field";
import { motionFactor, SIGNATURE_STOPS } from "@/registry/dither/lib/moments";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * The success signature: a band of 2px dots in the chart colours that
 * travels once across a surface (up for areas, right for buttons and
 * toasts). Shared by MomentSweep, DitherDevelop and FileDrop.
 * ------------------------------------------------------------------ */

export type SweepDirection = "up" | "right";
type RGB = [number, number, number];

const norm = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;

/** Reads CSS custom properties (or colours) from `el` as RGB triples. */
export function readColors(el: Element, names: readonly string[]): RGB[] {
  const cs = getComputedStyle(el);
  return names.map((n) => {
    const raw = n.startsWith("--") ? cs.getPropertyValue(n).trim() : n;
    if (!norm) return [128, 128, 128];
    norm.fillStyle = "#808080";
    if (raw) norm.fillStyle = raw;
    const hex = String(norm.fillStyle);
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (m) {
      const v = parseInt(m[1], 16);
      return [v >> 16, (v >> 8) & 255, v & 255];
    }
    const r = /rgba?\(([^)]+)\)/.exec(hex);
    return r ? (r[1].split(",").slice(0, 3).map(Number) as RGB) : [128, 128, 128];
  });
}

function lerpPalette(p: RGB[], u: number): string {
  const x = ((u % 1) + 1) % 1 * (p.length - 1);
  const i = Math.floor(x), f = x - i;
  const a = p[i], b = p[Math.min(p.length - 1, i + 1)];
  return `rgb(${a[0] + (b[0] - a[0]) * f | 0},${a[1] + (b[1] - a[1]) * f | 0},${a[2] + (b[2] - a[2]) * f | 0})`;
}

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Draws one frame of the sweep at progress `p` (0 → 1) into `ctx` (CSS px).
 * `skeleton`: grey organic dots ahead of the band (DitherDevelop); behind the band is left clear.
 */
export function drawSweep(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  { dir = "up", colors, skeleton, band }: { dir?: SweepDirection; colors: RGB[]; skeleton?: string; band?: number },
) {
  ctx.clearRect(0, 0, w, h);
  const L = dir === "up" ? h : w;
  const B = band ?? Math.max(24, L * 0.32);
  const front = -B + (L + 2 * B) * easeInOut(Math.min(1, Math.max(0, p)));
  const cell = DITHER_CELL, dot = DITHER_DOT, o = (cell - dot) / 2;
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell, y = r * cell;
      const t = dir === "up" ? h - y : x;
      const th = (BAYER_4[r & 3][c & 3] + 0.5) / 16;
      const k = 1 - Math.abs(t - front) / B;
      if (k > th) {
        const u = dir === "up" ? x / w : y / h;
        ctx.fillStyle = lerpPalette(colors, u * 0.85 + p * 0.5 + (t - front) / (B * 6));
        ctx.fillRect(x + o, y + o, dot, dot);
      } else if (skeleton && t > front) {
        if (valueNoise(c * 0.09, r * 0.09, 3) * 0.6 + 0.2 > th) {
          ctx.fillStyle = skeleton;
          ctx.fillRect(x + o, y + o, dot, dot);
        }
      }
    }
  }
  return front;
}

/** Sizes a canvas to its box at device pixel ratio; returns CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

export interface MomentSweepProps extends Omit<React.ComponentProps<"canvas">, "children"> {
  /** Plays the sweep each time this value changes to something truthy (a counter, a status, true). */
  play: unknown;
  direction?: SweepDirection;
  /** Duration in ms at normal motion (scaled by the viewer's motion intensity). */
  duration?: number;
  onDone?: () => void;
}

/** Overlay for any `relative overflow-hidden` surface: plays the signature sweep once per `play` change. */
function MomentSweep({ play, direction = "right", duration = 900, onDone, className, ...props }: MomentSweepProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const done = React.useRef(onDone);
  React.useEffect(() => {
    done.current = onDone;
  });

  React.useEffect(() => {
    const canvas = ref.current;
    if (!play || !canvas) return;
    const factor = motionFactor();
    if (factor === 0) {
      done.current?.();
      return;
    }
    const { ctx, w, h } = fitCanvas(canvas);
    const colors = readColors(canvas, SIGNATURE_STOPS);
    const total = duration * factor;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const p = (now - t0) / total;
      drawSweep(ctx, w, h, p, { dir: direction, colors, band: direction === "right" ? Math.max(20, w * 0.22) : undefined });
      if (p < 1) raf = requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, w, h);
        done.current?.();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [play, direction, duration]);

  return <canvas ref={ref} aria-hidden="true" data-slot="moment-sweep" className={cn("pointer-events-none absolute inset-0 z-10 size-full", className)} {...props} />;
}

export { MomentSweep };
