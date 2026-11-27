"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { DITHER_CELL, DITHER_DOT } from "@/registry/dither/lib/dither-tile";
import { readColors } from "@/registry/dither/lib/moment-sweep";
import { motionFactor } from "@/registry/dither/lib/moments";
import { cn } from "@/registry/dither/lib/utils";

/* ------------------------------------------------------------------ *
 * Disintegrate: delete as a dither moment. When `gone` turns true the
 * element breaks into 2px dots (its own surface, border and text
 * colours) that drift down and fade, left to right, while its row
 * collapses; then `onGone`. Mounted with `reassemble` (after an undo),
 * the dots rise back into place and the element reappears.
 * Reduced motion: a quick fade and collapse.
 * ------------------------------------------------------------------ */

type Particle = { x: number; y: number; vx: number; vy: number; delay: number; color: string };

export interface DisintegrateProps extends React.ComponentProps<"div"> {
  gone?: boolean;
  onGone?: () => void;
  /** Play the reverse on mount (the item came back from an undo). */
  reassemble?: boolean;
  /** ms at normal motion. */
  duration?: number;
}

function makeParticles(el: HTMLElement, w: number, h: number): Particle[] {
  const cs = getComputedStyle(el);
  const inner = el.firstElementChild as HTMLElement | null;
  const ics = inner ? getComputedStyle(inner) : cs;
  const pick = (c: string) => (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent" ? c : null);
  const surface = pick(ics.backgroundColor) ?? pick(cs.backgroundColor) ?? "var(--surface)";
  const [bg, fg, border] = readColors(el, [surface, ics.color || "--foreground", "--border-strong"]);
  const out: Particle[] = [];
  const cell = DITHER_CELL;
  for (let y = 0; y < h; y += cell)
    for (let x = 0; x < w; x += cell) {
      const r = Math.random();
      if (r > 0.78) continue;
      const edge = x < cell || y < cell || x > w - cell * 2 || y > h - cell * 2;
      const c = edge ? border : r < 0.12 ? fg : bg;
      out.push({
        x,
        y,
        vx: (Math.random() - 0.3) * 40,
        vy: -20 - Math.random() * 40,
        delay: (x / w) * 0.45 + Math.random() * 0.12,
        color: `rgb(${c.join(",")})`,
      });
    }
  return out;
}

function Disintegrate({ gone = false, onGone, reassemble = false, duration = 900, className, children, ...props }: DisintegrateProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [overlay, setOverlay] = React.useState<{ rect: DOMRect; mode: "out" | "in" } | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  // Back from an undo: reopen the row.
  if (!gone && collapsed) setCollapsed(false);
  const goneCb = React.useRef(onGone);
  React.useEffect(() => {
    goneCb.current = onGone;
  });

  // Start: measure and open the overlay.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!gone) {
      el.getAnimations().forEach((a) => a.cancel());
      return;
    }
    {
      if (motionFactor() === 0) {
        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" }).onfinish = () => {
          setCollapsed(true);
          setTimeout(() => goneCb.current?.(), 120);
        };
        return;
      }
      setOverlay({ rect: el.getBoundingClientRect(), mode: "out" });
    }
  }, [gone]);

  React.useEffect(() => {
    const el = ref.current;
    if (!reassemble || !el || motionFactor() === 0) return;
    // Let the row reopen first (it may have collapsed), then gather the dots into place.
    el.style.opacity = "0";
    const t = window.setTimeout(() => setOverlay({ rect: el.getBoundingClientRect(), mode: "in" }), 220);
    return () => window.clearTimeout(t);
  }, [reassemble]);

  // Run the particles.
  React.useEffect(() => {
    const canvas = canvasRef.current, el = ref.current;
    if (!overlay || !canvas || !el) return;
    const { rect, mode } = overlay;
    const pad = 80;
    const w = rect.width, h = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = (w + pad * 2) * dpr;
    canvas.height = (h + pad * 2) * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, pad, pad);
    const parts = makeParticles(el, w, h);
    const total = (duration * motionFactor()) / 1000;
    el.style.opacity = "0";
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const T = mode === "out" ? elapsed : total - elapsed;
      ctx.clearRect(-pad, -pad, w + pad * 2, h + pad * 2);
      for (const p of parts) {
        const t = Math.max(0, T - p.delay * total);
        const life = Math.max(0, 1 - t / (total * 0.55));
        if (life <= 0) continue;
        ctx.globalAlpha = life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + p.vx * t, p.y + p.vy * t + 160 * t * t, DITHER_DOT, DITHER_DOT);
      }
      ctx.globalAlpha = 1;
      if (elapsed < total) raf = requestAnimationFrame(frame);
      else {
        setOverlay(null);
        if (mode === "out") {
          setCollapsed(true);
          setTimeout(() => goneCb.current?.(), 200);
        } else el.style.opacity = "";
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [overlay, duration]);

  return (
    <div
      data-slot="disintegrate"
      data-gone={gone || undefined}
      className={cn("grid transition-[grid-template-rows,opacity] duration-200 ease-(--motion-open-ease)", collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]", className)}
      {...props}
    >
      <div ref={ref} className="min-h-0">
        {children}
      </div>
      {overlay
        ? createPortal(
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="pointer-events-none fixed z-[90]"
              style={{ left: overlay.rect.left - 80, top: overlay.rect.top - 80, width: overlay.rect.width + 160, height: overlay.rect.height + 160 }}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

export { Disintegrate };
