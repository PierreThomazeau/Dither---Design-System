"use client";

import * as React from "react";

import { ditherTile, periodicNoise, type DitherVariant } from "@/registry/dither/lib/dither-tile";
import { runDitherStep, stopDitherStep } from "@/registry/dither/lib/organic-dither";

const DOT_FILL = "var(--dither-color, var(--border-strong))";
/** The animated pattern repeats every SIZE user units (a multiple of every tile size). */
const SIZE = 192;
/** Noise cells across SIZE for the two octaves (integers, so the noise tiles seamlessly). */
const P1 = 6;
const P2 = 16;

export interface DitherPatternProps {
  /** id referenced by `fill="url(#id)"`. Must be unique on the page. */
  id: string;
  variant?: DitherVariant;
  /** Height of the gradient tile in px (gradient variant only). */
  gradientHeight?: number;
}

/**
 * SVG `<pattern>` of the Dither texture, alive like every other dither: the tile's geometry,
 * thinned and refilled by slowly drifting noise, and stirred by the pointer (the same wake as
 * DitherFill). Place it inside `<defs>` and fill shapes with `url(#id)`. Dots use
 * `--dither-color`, falling back to `--border-strong`.
 *
 * The dots keep their on-screen size whatever the SVG's viewBox: a stretched SVG (a 100-unit
 * donut drawn at 180px) scales the pattern back, so a 2px dot stays 2px. Still under reduced motion.
 */
export function DitherPattern({ id, variant = "regular", gradientHeight }: DitherPatternProps) {
  const ref = React.useRef<SVGPatternElement>(null);
  const [scale, setScale] = React.useState(1);

  // One SIZE x SIZE block of the tile (gradient: one tile tall, SIZE wide).
  const { width, height, dots } = React.useMemo(() => {
    const t = ditherTile(variant, gradientHeight);
    const w = SIZE;
    const h = variant === "gradient" ? t.height : SIZE;
    const out: { x: number; y: number; s: number }[] = [];
    for (let ty = 0; ty < h; ty += t.height)
      for (let tx = 0; tx < w; tx += t.width) for (const d of t.dots) out.push({ x: tx + d.x, y: ty + d.y, s: d.size ?? t.dot });
    return { width: w, height: h, dots: out };
  }, [variant, gradientHeight]);

  React.useEffect(() => {
    const pattern = ref.current;
    const svg = pattern?.ownerSVGElement;
    if (!pattern || !svg) return;
    const rects = Array.from(pattern.children) as SVGRectElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seed = 7 + [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 0);
    let s = 1;
    let visible = true;
    let last = 0;
    const start = performance.now();
    const trail: { x: number; y: number; life: number }[] = [];

    const measure = () => {
      const vb = svg.viewBox.baseVal;
      const w = svg.getBoundingClientRect().width;
      s = vb && vb.width > 0 && w > 0 ? Math.round((vb.width / w) * 1000) / 1000 : 1;
      setScale(s);
    };

    const draw = (t: number) => {
      const r = 40;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let n = periodicNoise(((d.x + t * 8) / SIZE) * P1, ((d.y - t * 5) / SIZE) * P1, P1, seed) * 0.62 + periodicNoise(((d.x - t * 13) / SIZE) * P2, ((d.y + t * 6) / SIZE) * P2, P2, seed + 5) * 0.38;
        for (const pt of trail) {
          const dx = ((d.x - pt.x + SIZE * 1.5) % SIZE) - SIZE / 2;
          const dy = ((d.y - pt.y + SIZE * 1.5) % SIZE) - SIZE / 2;
          const dist = Math.hypot(dx, dy);
          if (dist < r) n -= pt.life * (1 - dist / r) * 0.9;
        }
        const on = n >= 0.32;
        const el = rects[i];
        if (el && (el.dataset.on === "1") !== on) {
          el.dataset.on = on ? "1" : "0";
          el.style.visibility = on ? "visible" : "hidden";
        }
      }
    };

    const step = (now: number) => {
      if (!visible) return false;
      for (const pt of trail) pt.life *= 0.965;
      while (trail.length && trail[0].life < 0.03) trail.shift();
      if (now - last > 33) {
        last = now;
        draw((now - start) / 1000);
      }
      return true;
    };
    const wake = () => {
      if (!reduce) runDitherStep(step);
    };

    const onMove = (e: PointerEvent) => {
      const m = svg.getScreenCTM();
      if (!m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      // Into pattern space (patternTransform scales by s), wrapped to one block.
      const x = (((p.x / s) % SIZE) + SIZE) % SIZE;
      const y = (((p.y / s) % (variant === "gradient" ? height : SIZE)) + SIZE) % SIZE;
      const lastPt = trail[trail.length - 1];
      if (lastPt && Math.hypot(lastPt.x - x, lastPt.y - y) < 6) return;
      trail.push({ x, y, life: 1 });
      if (trail.length > 24) trail.shift();
      wake();
    };

    measure();
    draw(0);
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(svg);
    const host = svg.parentElement ?? svg;
    if (!reduce) host.addEventListener("pointermove", onMove as EventListener);
    wake();
    return () => {
      stopDitherStep(step);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove as EventListener);
    };
  }, [id, dots, height, variant]);

  return (
    <pattern ref={ref} id={id} width={width} height={height} patternUnits="userSpaceOnUse" patternTransform={scale !== 1 ? `scale(${scale})` : undefined}>
      {dots.map((d) => (
        <rect key={`${d.x}-${d.y}`} x={d.x} y={d.y} width={d.s} height={d.s} style={{ fill: DOT_FILL }} />
      ))}
    </pattern>
  );
}
