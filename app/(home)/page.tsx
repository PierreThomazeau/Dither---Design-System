import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { appDescription } from "@/lib/shared";
import { LogoMark } from "@/components/site/logo";

/** Placeholder landing — the real marketing site comes in batch 8. */
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-16 md:py-24">
      <section className="relative overflow-hidden rounded-display bg-background-muted p-1">
        <div className="relative overflow-hidden rounded-[calc(var(--radius-display)-4px)] border bg-surface px-6 py-16 shadow-xs md:px-16 md:py-24">
          <span className="bg-dither-gradient absolute inset-0" aria-hidden="true" />
          <div className="relative flex max-w-2xl flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-hairline bg-foreground px-1.5 font-mono text-xs uppercase text-primary-foreground">
              v0.1 · Setup
            </span>
            <h1 className="flex items-center gap-4 font-heading text-5xl font-semibold tracking-tight md:text-7xl">
              <LogoMark className="size-10 md:size-14" />
              Dither
            </h1>
            <p className="text-lg text-muted-foreground">{appDescription}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/docs"
                className="inline-flex h-control items-center gap-2 rounded-control bg-primary bg-linear-to-b from-white/8 to-white/0 px-4 text-sm font-medium text-primary-foreground shadow-button-primary"
              >
                Read the docs
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} />
              </Link>
              <Link
                href="/tokens"
                className="inline-flex h-control items-center rounded-control border bg-surface px-4 text-sm font-medium shadow-xs hover:bg-hover"
              >
                Browse tokens
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
