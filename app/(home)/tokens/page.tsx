import type { Metadata } from "next";
import type { ReactNode } from "react";

import tokens from "@/styles/tokens.json";
import { DITHER_VARIANTS } from "@/registry/dither/lib/dither-tile";
import { DitherFill } from "@/registry/dither/lib/dither";
import { cn } from "@/registry/dither/lib/utils";

export const metadata: Metadata = {
  title: "Tokens",
  description: "Colours, radius, sizes, spacing, type, elevation and dither variants.",
};

type Mode = "light" | "dark";
const colorEntries = Object.entries(tokens.color) as [string, Record<Mode, string>][];

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      {children}
    </section>
  );
}

/** Inset shell (grammar 2). */
function Inset({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="rounded-surface bg-background-muted p-1">
      <div className={cn("rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-6 shadow-xs", className)}>{children}</div>
    </div>
  );
}

function ColorPanel({ mode }: { mode: Mode }) {
  return (
    <div className={cn(mode, "rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-4 text-foreground shadow-xs")}>
      <p className="mb-3 font-mono text-xs uppercase text-muted-foreground">{mode}</p>
      <ul className="grid gap-1">
        {colorEntries.map(([name, value]) => (
          <li key={name} className="flex items-center gap-3 rounded-control px-1 py-1">
            <span className="size-8 shrink-0 rounded-micro border" style={{ background: `var(--${name})` }} />
            <span className="flex-1 truncate text-sm font-medium">{name}</span>
            <code className="font-mono text-xs tabular text-muted-foreground">{value[mode]}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

const nav = [
  ["colors", "Colours"],
  ["palette", "Woodsmoke"],
  ["radius", "Radius"],
  ["sizes", "Control heights"],
  ["spacing", "Spacing"],
  ["type", "Typography"],
  ["shadows", "Elevation"],
  ["dither", "Dither"],
] as const;

export default function TokensPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 md:py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Dither / Foundations</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Tokens</h1>
        <p className="max-w-2xl text-muted-foreground">
          Exported from the Figma variables on {tokens.$meta.exported}. Every component reads these CSS variables, never raw
          values.
        </p>
        <nav className="flex flex-wrap gap-1.5 pt-2">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="inline-flex h-control-xs items-center rounded-control border bg-surface px-3 text-sm hover:bg-hover">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Section id="colors" title="Colours" description="Semantic colours, light and dark side by side.">
        <div className="rounded-surface bg-background-muted p-1">
          <div className="grid gap-1 md:grid-cols-2">
            <ColorPanel mode="light" />
            <ColorPanel mode="dark" />
          </div>
        </div>
      </Section>

      <Section id="palette" title="Woodsmoke" description="The neutral scale: a true grey, not zinc.">
        <Inset>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {Object.entries(tokens.palette.woodsmoke).map(([step, hex]) => (
              <div key={step} className="flex flex-col gap-1.5">
                <span className="aspect-square rounded-control border" style={{ background: hex }} />
                <span className="text-xs font-medium">{step}</span>
                <code className="font-mono text-xs text-muted-foreground">{hex}</code>
              </div>
            ))}
          </div>
        </Inset>
      </Section>

      <Section id="radius" title="Radius" description="Named by role: controls, fields, surfaces, sheets.">
        <Inset>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(tokens.radius)
              .filter(([name]) => name !== "full" && name !== "none" && name !== "min")
              .map(([name, px]) => (
                <div key={name} className="flex flex-col gap-2">
                  <span className="h-20 border-t-2 border-l-2 border-foreground bg-background-muted" style={{ borderTopLeftRadius: `var(--dither-radius-${name})` }} />
                  <span className="text-sm font-medium">{name}</span>
                  <code className="font-mono text-xs text-muted-foreground">rounded-{name} · {px}px</code>
                </div>
              ))}
          </div>
        </Inset>
      </Section>

      <Section id="sizes" title="Control heights" description="Every control has the same height at the same size.">
        <Inset className="flex flex-col gap-3">
          {Object.entries(tokens.size).map(([name, px]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="w-36 shrink-0 font-mono text-xs text-muted-foreground">h-{name}</code>
              <span className="flex flex-1 items-center rounded-control border bg-background-muted px-4 text-sm" style={{ height: `var(--dither-size-${name})` }}>
                {px}px
              </span>
            </div>
          ))}
        </Inset>
      </Section>

      <Section id="spacing" title="Spacing" description="Inset (padding) and gap scales, in px.">
        <div className="grid gap-4 md:grid-cols-2">
          {(["inset", "gap"] as const).map((group) => (
            <Inset key={group} className="flex flex-col gap-2">
              <p className="mb-1 font-mono text-xs uppercase text-muted-foreground">{group}</p>
              {Object.entries(tokens.space[group]).map(([name, px]) => (
                <div key={name} className="flex items-center gap-3">
                  <code className="w-20 shrink-0 font-mono text-xs text-muted-foreground">{name}</code>
                  <span className="h-3 rounded-[2px] bg-brand" style={{ width: `var(--dither-${group}-${name})` }} />
                  <code className="font-mono text-xs tabular text-muted-foreground">{px}</code>
                </div>
              ))}
            </Inset>
          ))}
        </div>
      </Section>

      <Section id="type" title="Typography" description="Manrope for text and headings, Geist Mono for data.">
        <Inset className="flex flex-col divide-y">
          {Object.entries(tokens.text)
            .reverse()
            .map(([name, t]) => (
              <div key={name} className="flex items-baseline gap-6 py-3">
                <code className="w-28 shrink-0 font-mono text-xs text-muted-foreground">
                  text-{name}
                  <br />
                  {t.size}/{t.lineHeight}
                </code>
                <span
                  className="truncate font-semibold tracking-tight"
                  style={{ fontSize: t.size, lineHeight: `${t.lineHeight}px` }}
                >
                  Revenue grew 24%
                </span>
              </div>
            ))}
          <div className="flex items-baseline gap-6 py-3">
            <code className="w-28 shrink-0 font-mono text-xs text-muted-foreground">font-mono</code>
            <span className="font-mono text-sm tabular">INV-2048 · €48,200.00 · 2026-11-24 14:02</span>
          </div>
        </Inset>
      </Section>

      <Section id="shadows" title="Elevation" description="Shadows, the tactile primary button and the focus ring.">
        <Inset className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "popover", "tabs-active"].map((name) => (
            <div key={name} className="flex flex-col gap-2">
              <span className="h-16 rounded-control border bg-surface" style={{ boxShadow: `var(--dither-shadow-${name})` }} />
              <code className="font-mono text-xs text-muted-foreground">shadow-{name}</code>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <span className="flex h-16 items-center justify-center rounded-control bg-primary bg-linear-to-b from-white/8 to-white/0 text-sm font-medium text-primary-foreground shadow-button-primary">
              Primary
            </span>
            <code className="font-mono text-xs text-muted-foreground">shadow-button-primary</code>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex h-16 items-center justify-center rounded-control border bg-surface text-sm shadow-focus">Focus</span>
            <code className="font-mono text-xs text-muted-foreground">shadow-focus</code>
          </div>
        </Inset>
      </Section>

      <Section id="dither" title="Dither" description="The signature texture, in --border-strong: organic shapes for surfaces, the tile for data marks. Light and dark.">
        <div className="rounded-surface bg-background-muted p-1">
          <div className="grid gap-1 md:grid-cols-2">
            {(["light", "dark"] as const).map((mode) => (
              <div key={mode} className={cn(mode, "grid grid-cols-2 gap-3 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-4 text-foreground shadow-xs")}>
                {(["cloud", "scatter", "halo", "flow"] as const).map((shape) => (
                  <figure key={shape} className="flex flex-col gap-1.5">
                    <div className="relative h-28 overflow-hidden rounded-control border">
                      <DitherFill shape={shape} />
                    </div>
                    <figcaption className="font-mono text-xs text-muted-foreground">
                      {mode} · {shape}
                    </figcaption>
                  </figure>
                ))}
                {DITHER_VARIANTS.map((variant) => (
                  <figure key={variant} className="flex flex-col gap-1.5">
                    <div className="relative h-20 overflow-hidden rounded-control border">
                      <DitherFill variant={variant} />
                    </div>
                    <figcaption className="font-mono text-xs text-muted-foreground">
                      {mode} · tile · {variant}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
