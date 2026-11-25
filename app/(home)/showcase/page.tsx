import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import { screens } from "@/components/showcase/screens";
import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";

export const metadata: Metadata = {
  title: "Showcase",
  description: "Twelve product screens built only with Dither components.",
};

export default function ShowcaseIndex() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Dither / Showcase</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Showcase</h1>
        <p className="max-w-2xl text-muted-foreground">
          Twelve product screens assembled only from Dither components, blocks and charts. Every screen works in light and dark.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {screens.map((s, i) => (
          <li key={s.slug}>
            <Link
              href={`/showcase/${s.slug}`}
              className="group flex h-full flex-col gap-1 rounded-surface bg-background-muted p-1 outline-none focus-visible:shadow-focus"
            >
              <div className="relative isolate h-36 overflow-hidden rounded-[calc(var(--radius-surface)-4px)] border bg-surface shadow-xs">
                <DitherFill variant={i % 3 === 0 ? "gradient" : i % 3 === 1 ? "fine" : "bayer"} gradientHeight={144} />
                <span className="absolute top-3 left-3 rounded-hairline bg-foreground px-1.5 font-mono text-[10px] text-primary-foreground uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon icon={ArrowUpRight01Icon} className="absolute top-3 right-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="flex flex-col gap-0.5 px-3 pt-2 pb-3">
                <span className="text-sm font-semibold">{s.title}</span>
                <span className="text-sm text-muted-foreground">{s.description}</span>
                <span className="mt-1 font-mono text-xs text-muted-foreground">{s.workspace}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
