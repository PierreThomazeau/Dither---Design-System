import type { Metadata } from "next";
import Link from "next/link";

import { LogoMark } from "@/components/site/logo";
import { accessCode, safeNext } from "@/lib/access";
import { DitherFill } from "@/registry/dither/lib/dither";

import { AccessForm } from "./access-form";

export const metadata: Metadata = {
  title: "Access",
  description: "Dither is free to use, by access code.",
  robots: { index: false },
};

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-24">
      <DitherFill shape="halo" className="-z-10 opacity-70" />
      <div className="flex w-full max-w-sm flex-col gap-1 rounded-surface bg-background-muted p-1">
        <div className="flex flex-col gap-6 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-6 shadow-xs">
          <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-primary-foreground">
            <LogoMark className="size-5" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Enter your access code</h1>
            <p className="text-sm text-muted-foreground">
              Dither is free to use, but not open source: the docs, components and registry open with a code.
            </p>
          </div>
          <AccessForm next={safeNext(next)} configured={accessCode() !== null} />
        </div>
        <p className="px-4 py-2.5 text-xs text-muted-foreground">
          No code yet? Ask the person who shared Dither with you. <Link href="/license" className="underline underline-offset-4">License</Link>
        </p>
      </div>
    </main>
  );
}
