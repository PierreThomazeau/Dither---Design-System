import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import { screens } from "@/components/showcase/screens";
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
              <div className="relative isolate aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-surface)-4px)] border bg-surface">
                {/* Preview of the screen (generated from the live page, light and dark). */}
                <Image
                  src={`/showcase/${s.slug}-light.webp`}
                  alt={`${s.title} screen, light mode`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top-left transition-transform duration-(--duration-liquid) ease-(--ease-out-soft) group-hover:scale-[1.03] dark:hidden"
                />
                <Image
                  src={`/showcase/${s.slug}-dark.webp`}
                  alt={`${s.title} screen, dark mode`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="hidden object-cover object-top-left transition-transform duration-(--duration-liquid) ease-(--ease-out-soft) group-hover:scale-[1.03] dark:block"
                />
                <span className="absolute top-3 left-3 rounded-hairline bg-foreground px-1.5 font-mono text-[10px] text-primary-foreground uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full border bg-surface">
                  <Icon icon={ArrowUpRight01Icon} className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
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
