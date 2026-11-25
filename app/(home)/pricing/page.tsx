import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown01Icon, MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";

import { comparison, faqs, plans } from "@/components/site/plans";
import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/dither/ui/table";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free foundations under MIT. Pro adds blocks, signature charts, showcase screens and the Figma library.",
};

/** Renders `code` spans written with backticks in the FAQ data. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") ? (
          <code key={i} className="rounded-hairline bg-background-muted px-1 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Icon icon={Tick02Icon} className="text-positive" aria-label="Included" />;
  if (value === false) return <Icon icon={MinusSignIcon} className="text-muted-foreground" aria-label="Not included" />;
  return <span className="font-mono text-xs tabular">{value}</span>;
}

export default function PricingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden">
        <DitherFill variant="gradient" gradientHeight={280} className="inset-auto top-0 left-0 -z-10 h-[280px] w-full" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-16 pb-10 md:pt-20">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Dither / Pricing</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Simple pricing</h1>
          <p className="max-w-2xl text-muted-foreground">The foundations are free and MIT licensed. Pro unlocks the blocks, charts, screens and Figma library. Prices exclude VAT.</p>
        </div>
      </section>

      <section aria-label="Plans" className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.id} className={cn("flex flex-col gap-1 rounded-surface p-1", p.highlight ? "bg-brand/10" : "bg-background-muted")}>
            <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
              <h2 className="text-sm font-semibold">{p.name}</h2>
              {p.highlight ? <Badge variant="brand">Most popular</Badge> : null}
            </div>
            <div className="flex flex-1 flex-col gap-5 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-5 shadow-xs">
              <div className="flex flex-col gap-1">
                <span className="flex items-baseline gap-1.5">
                  <span className="font-heading text-4xl font-semibold tracking-tight tabular">{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.cadence}</span>
                </span>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
              {p.id === "free" ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/docs/installation">{p.cta}</Link>
                </Button>
              ) : (
                <Button variant={p.highlight ? "default" : "outline"} className="w-full" disabled aria-describedby="checkout-note">
                  {p.cta}
                </Button>
              )}
              <ul className="flex flex-col gap-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Icon icon={Tick02Icon} className="mt-0.5 text-positive" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
      <p id="checkout-note" className="mx-auto mt-3 w-full max-w-6xl px-4 text-xs text-muted-foreground">
        Checkout opens with the Pro release. Free components are available now.
      </p>

      <section className="mx-auto mt-16 flex w-full max-w-6xl flex-col gap-4 px-4">
        <h2 className="text-2xl font-semibold tracking-tight">Compare plans</h2>
        <div className="rounded-surface border bg-surface p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-1/3">Feature</TableHead>
                {plans.map((p) => (
                  <TableHead key={p.id} className="text-center">{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison.map(([label, ...values]) => (
                <TableRow key={label}>
                  <TableCell>{label}</TableCell>
                  {values.map((v, i) => (
                    <TableCell key={i} className="text-center [&_svg]:mx-auto">
                      <Cell value={v} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="faq" className="mx-auto mt-16 grid w-full max-w-6xl scroll-mt-24 gap-8 px-4 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">FAQ</p>
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <p className="text-sm text-muted-foreground">
            Read the <Link href="/license" className="underline underline-offset-4">license</Link> for the details.
          </p>
        </div>
        <div className="flex flex-col divide-y rounded-surface border bg-surface shadow-xs">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold outline-none focus-visible:underline">
                {f.q}
                <Icon icon={ArrowDown01Icon} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm text-muted-foreground">
                <RichText text={f.a} />
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
