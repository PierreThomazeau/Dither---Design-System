import type { Metadata } from "next";

import { OrganicDither } from "@/components/lab/organic-dither";
import type { OrganicShape } from "@/components/lab/organic-field";
import { DitherFill } from "@/registry/dither/lib/dither";
import { Button } from "@/registry/dither/ui/button";

export const metadata: Metadata = {
  title: "Organic dither (proposal)",
  description: "A less linear dither: density driven by a noise field, in clumps, wisps and holes.",
  robots: { index: false },
};

const shapes: { shape: OrganicShape; name: string; note: string; scale: number }[] = [
  { shape: "cloud", name: "Cloud", note: "Fractal noise with a slow warp: soft masses and holes. Backgrounds, heroes.", scale: 2.4 },
  { shape: "scatter", name: "Scatter", note: "Dense on top, breaking into a ragged edge and loose grain. Replaces the linear gradient.", scale: 3 },
  { shape: "halo", name: "Halo", note: "A granular cloud around the content, empty in the middle. Empty states, titles.", scale: 3.2 },
  { shape: "flow", name: "Flow", note: "Warped bands, like contour lines. Charts backdrops, AI surfaces.", scale: 1.6 },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{children}</p>;
}

export default function OrganicDitherLab() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16">
      <header className="flex max-w-2xl flex-col gap-3">
        <Label>Dither / Lab / Proposal</Label>
        <h1 className="text-4xl font-semibold tracking-tight">Organic dither</h1>
        <p className="text-muted-foreground">
          Same dots and same grid as before (2px squares on 6px, odd rows offset by 3px): a full area is exactly the regular tile. A noise field decides which dots stay, so the density
          clumps, frays and drifts slowly instead of fading in a straight line. Move the pointer over a panel: it clears a soft hole.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Before / after</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="flex flex-col gap-2">
            <div className="relative h-56 overflow-hidden rounded-surface border bg-surface">
              <DitherFill variant="gradient" gradientHeight={224} />
            </div>
            <figcaption><Label>Today: linear gradient tile</Label></figcaption>
          </figure>
          <figure className="flex flex-col gap-2">
            <div className="relative h-56 overflow-hidden rounded-surface border bg-surface">
              <OrganicDither shape="scatter" scale={3} />
            </div>
            <figcaption><Label>Proposal: scatter</Label></figcaption>
          </figure>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Four shapes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {shapes.map((s) => (
            <figure key={s.shape} className="flex flex-col gap-2">
              <div className="relative h-64 overflow-hidden rounded-surface border bg-surface">
                <OrganicDither shape={s.shape} scale={s.scale} />
              </div>
              <figcaption className="flex flex-col gap-0.5">
                <Label>{s.name}</Label>
                <p className="text-sm text-muted-foreground">{s.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">In context</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative flex h-72 flex-col items-center justify-center gap-3 overflow-hidden rounded-surface border bg-surface p-6 text-center">
            <OrganicDither shape="halo" scale={3.2} />
            <div className="relative flex flex-col items-center gap-2">
              <p className="text-lg font-semibold">No reports yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">Create your first report to track revenue across teams.</p>
              <Button className="mt-2">New report</Button>
            </div>
          </div>

          <div className="dark relative flex h-72 items-center justify-center overflow-hidden rounded-surface border bg-surface text-foreground">
            <OrganicDither shape="cloud" scale={2.4} className="[--dither-color:var(--brand)]" />
            <p className="relative rounded-control bg-surface/80 px-4 py-2 text-4xl font-semibold tracking-tight backdrop-blur-sm">Atlas 2</p>
          </div>

          <div className="relative flex h-72 flex-col justify-end overflow-hidden rounded-surface border bg-surface p-6">
            <OrganicDither shape="flow" scale={1.6} />
            <div className="relative w-fit rounded-control border bg-surface px-4 py-3 shadow-xs">
              <Label>Revenue</Label>
              <p className="font-mono text-2xl tabular-nums">$48,210</p>
            </div>
          </div>

          <div className="dark relative flex h-72 flex-col justify-end overflow-hidden rounded-surface border bg-surface p-6 text-foreground">
            <OrganicDither shape="scatter" scale={3} />
            <div className="relative flex flex-col gap-1">
              <Label>Dark</Label>
              <p className="text-sm text-muted-foreground">Scatter on a dark surface, in border-strong.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
