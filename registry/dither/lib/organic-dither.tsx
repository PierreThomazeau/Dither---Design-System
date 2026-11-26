"use client";

import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";
import { ditherTile, type DitherVariant } from "@/registry/dither/lib/dither-tile";
import { bayer, density, fbm, valueNoise, type OrganicShape } from "@/registry/dither/lib/organic-field";

export type { OrganicShape } from "@/registry/dither/lib/organic-field";

export interface OrganicDitherProps extends React.ComponentProps<"canvas"> {
  shape?: OrganicShape;
  /**
   * Animate a tile instead of a shape: the tile's exact geometry (regular, fine, bayer, gradient,
   * organic), brought to life the same way as the shapes: a slowly drifting noise thins and refills
   * it, and the pointer leaves the same organic wake.
   */
  tile?: DitherVariant;
  /** Tile "gradient" only: height over which the density fades (defaults to the element height). */
  gradientHeight?: number;
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
 * (masses, holes, ragged edges; dense areas get bigger dots). Drifts slowly; the pointer leaves an
 * organic wake (noisy edge, the texture thins out and regrows as grain, then heals). Pauses off-screen,
 * static under reduced motion. Fills its `relative` parent.
 * With `tile`, the same motion is applied to a tile's exact geometry, so every DitherFill moves alike.
 * Small data marks drawn with CSS / SVG (tracks, legends) keep the twinkling static tile.
 */
export function OrganicDither({
  shape = "cloud",
  tile,
  gradientHeight,
  cell = 6,
  dot = [2, 4],
  scale = 3,
  seed: seedProp,
  speed = 1,
  interactive = true,
  color,
  tint,
  className,
  ...props
}: OrganicDitherProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  // Tiles get a per-instance seed by default, so neighbouring panels don't drift in lockstep.
  const uid = React.useId();
  const seed = seedProp ?? (tile ? 7 + [...uid].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 0) : 7);
  const [d0, d1] = dot;
  const tintKey = tint ? `${tint.direction ?? "to-r"}:${tint.stops.join(",")}` : "";

  React.useEffect(() => {
    const canvas = ref.current;
    // Listen where the pointer actually lands: DitherFill wraps the canvas in a pointer-events-none
    // layer, so use that layer's parent (the surface the texture decorates).
    const host = (canvas?.closest("[data-slot=dither-fill]")?.parentElement ?? canvas?.parentElement) as HTMLElement | null;
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
    // Pointer trail: each point fades out; together they draw an organic wake, not a round hole.
    const trail: { x: number; y: number; life: number }[] = [];
    let lastPt = { x: -999, y: -999 };
    // Tile mode: every dot of the tile repeated over the canvas, computed on resize.
    let tileDots: { x: number; y: number; s: number }[] = [];
    const buildTile = () => {
      if (!tile) return;
      const t = ditherTile(tile, tile === "gradient" ? (gradientHeight ?? h) : undefined);
      const rows = tile === "gradient" ? 1 : Math.ceil(h / t.height);
      const cols = Math.ceil(w / t.width);
      const out: { x: number; y: number; s: number }[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          for (const d of t.dots) {
            const x = c * t.width + d.x;
            const y = r * t.height + d.y;
            if (x < w && y < h) out.push({ x, y, s: d.size ?? t.dot });
          }
      tileDots = out;
    };

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

    // Shared wake: how strongly the pointer trail stirs the point (x, y), with a frayed edge.
    const wakeAt = (x: number, y: number, t: number, r: number) => {
      let infl = 0;
      for (const pt of trail) {
        const dx = x - pt.x;
        const dy = y - pt.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r * r * 2.6) infl = Math.max(infl, pt.life * (1 - Math.sqrt(d2) / (r * 1.6)));
      }
      if (infl <= 0.02) return 0;
      const wobble = fbm(x * 0.02 + t * 0.4, y * 0.02, seed + 31);
      return Math.min(1, Math.max(0, infl * (0.6 + wobble * 0.9)));
    };

    const drawTile = (t: number) => {
      const r = Math.max(56, Math.min(w, h) * 0.3);
      const active = trail.length > 0;
      for (const d of tileDots) {
        // Two octaves of drifting noise: holes open, travel and close across the tile.
        let n = valueNoise(d.x * 0.03 + t * 0.25, d.y * 0.03 - t * 0.15, seed) * 0.62 + valueNoise(d.x * 0.08 - t * 0.4, d.y * 0.08 + t * 0.2, seed + 5) * 0.38;
        if (active) {
          const k = wakeAt(d.x, d.y, t, r);
          // Inside the wake the tile thins out, a few dots stay as loose grain.
          if (k > 0) n -= k * (0.75 + valueNoise(d.x * 0.2 - t, d.y * 0.2, seed + 9) * 0.5);
        }
        if (n < 0.32) continue;
        ctx.fillRect(d.x, d.y, d.s, d.s);
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;
      if (tile) {
        drawTile(t);
        paintTint();
        return;
      }
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const aspect = w / h;
      const r = Math.max(56, Math.min(w, h) * 0.3);
      const active = trail.length > 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cell;
          const y = row * cell;
          let dens = density(shape, { u: (x + cell / 2) / w, v: (y + cell / 2) / h, aspect, t, seed, scale });
          if (active) {
            // Influence of the wake, with a noisy radius so its edge frays like the texture.
            let infl = 0;
            for (const pt of trail) {
              const dx = x - pt.x;
              const dy = y - pt.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < r * r * 2.6) infl = Math.max(infl, pt.life * (1 - Math.sqrt(d2) / (r * 1.6)));
            }
            if (infl > 0.02) {
              const wobble = fbm(x * 0.02 + t * 0.4, y * 0.02, seed + 31);
              const k = Math.min(1, Math.max(0, infl * (0.6 + wobble * 0.9)));
              // Inside the wake the texture is stirred: it thins out and regrows as loose grain.
              const grain = fbm(x * 0.05 - t * 0.8, y * 0.05 + t * 0.5, seed + 53) * 0.55;
              dens = dens * (1 - k) + grain * k * (1 - k * 0.6);
            }
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
      for (const pt of trail) pt.life *= 0.965;
      while (trail.length && trail[0].life < 0.03) trail.shift();
      if (now - last > 33) {
        last = now;
        draw(((now - start) / 1000) * speed);
      }
      const moving = speed > 0 || trail.length > 0;
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
      buildTile();
      draw(((performance.now() - start) / 1000) * speed);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (Math.hypot(x - lastPt.x, y - lastPt.y) < 10) return;
      lastPt = { x, y };
      trail.push({ x, y, life: 1 });
      if (trail.length > 28) trail.shift();
      wake();
    };
    const onLeave = () => {
      lastPt = { x: -999, y: -999 };
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
  }, [shape, tile, gradientHeight, cell, d0, d1, scale, seed, speed, interactive, color, tintKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} {...props} />;
}
