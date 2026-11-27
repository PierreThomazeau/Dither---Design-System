import type { Metadata } from "next";
import Link from "next/link";

import { licenseText } from "@/components/site/license-text";

export const metadata: Metadata = {
  title: "License",
  description: "Dither is free to use, but not open source: access with a code.",
};

export default function LicensePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Dither / License</p>
        <h1 className="text-4xl font-semibold tracking-tight">License</h1>
        <p className="text-muted-foreground">Dither is free to use, but not open source. The docs, components and registry open with an access code.</p>
      </header>

      <section className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">In short</h2>
        <ul>
          <li><strong>Free</strong>, in <strong>personal and commercial</strong> projects, for you or your clients.</li>
          <li>Copy components into your projects, change them and ship them.</li>
          <li><strong>Don&apos;t redistribute</strong> Dither itself (as a library, kit, template, registry or Figma file), and don&apos;t share your access code.</li>
          <li>Keep the notice in the files you copy. The software is provided as is, without warranty.</li>
        </ul>
        <p>Parts based on shadcn/ui stay under their MIT license.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Dither License</h2>
        <pre className="overflow-x-auto rounded-surface border bg-surface p-5 font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground shadow-xs">{licenseText}</pre>
        <p className="text-sm text-muted-foreground">
          Have a code? <Link className="underline underline-offset-4" href="/access">Unlock Dither</Link>.
        </p>
      </section>
    </main>
  );
}
