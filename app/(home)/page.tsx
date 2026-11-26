import Link from "next/link";
import { ArrowDown01Icon, ArrowRight01Icon, DollarCircleIcon, Share08Icon, Copy01Icon, Archive02Icon } from "@hugeicons/core-free-icons";

import { faqs } from "@/components/site/faq";
import { LogoMark } from "@/components/site/logo";
import { appDescription } from "@/lib/shared";
import registry from "@/registry.json";
import { StatCard } from "@/registry/dither/blocks/stat-card";
import { Timeline, TimelineItem } from "@/registry/dither/blocks/timeline";
import { UsageMeter } from "@/registry/dither/blocks/usage-meter";
import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { ProgressBars } from "@/registry/dither/charts/progress-bars";
import { AiGlow } from "@/registry/dither/lib/ai-glow";
import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/registry/dither/ui/button-group";
import { Switch } from "@/registry/dither/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

const counts = {
  primitives: registry.items.filter((i) => i.type === "registry:ui").length,
  blocks: registry.items.filter((i) => i.type === "registry:block" && i.files[0].path.includes("/blocks/")).length,
  charts: registry.items.filter((i) => i.files[0]?.path.includes("/charts/") && i.name !== "chart-kit").length,
};

const grammar = [
  { title: "Tactile primary", text: "Gradient overlay and inner shadows. Nothing bleeds outside the box." },
  { title: "Two-tone surfaces", text: "A muted shell around a raised panel: cards, popovers, composers." },
  { title: "One height per size", text: "Buttons, inputs, selects, tabs: 32 · 36 · 40 · 44." },
  { title: "Mono for data", text: "Numbers, IDs and timestamps in Geist Mono with tabular figures." },
  { title: "Dither for the absent", text: "Remaining capacity, forecast ranges, empty states, skeletons." },
  { title: "Light and dark", text: "Every component, block and screen, from the first commit." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted-foreground">{children}</p>;
}

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <DitherFill shape="scatter" fade="bottom" className="inset-auto top-0 left-0 -z-10 h-[480px] w-full" />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 pt-20 pb-16 md:pt-28">
          <Badge variant="tag">v0.1 · {counts.primitives + counts.blocks + counts.charts} components</Badge>
          <h1 className="flex max-w-3xl flex-wrap items-center gap-x-4 font-heading text-5xl leading-[1.05] font-semibold tracking-tight md:text-7xl">
            <LogoMark className="size-10 md:size-14" />
            The design system with a texture.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{appDescription} Free and open source: copy the code, own it, ship it.</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="lg">
              <Link href="/docs">
                Get started
                <Icon icon={ArrowRight01Icon} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/showcase">See the showcase</Link>
            </Button>
          </div>
          <code className="inline-flex h-control items-center gap-3 rounded-control border bg-surface px-4 font-mono text-sm shadow-xs">
            <span className="text-muted-foreground">$</span>
            npx shadcn add @dither/button
          </code>
        </div>
      </section>

      {/* Bento of live components */}
      <section aria-label="Live components" className="mx-auto grid w-full max-w-6xl gap-4 px-4 md:grid-cols-6">
        <div className="md:col-span-4">
          <ChartCard
            title="Lead performance"
            subtitle="Items shipped vs. committed · Sprint 24"
            action="Sprint 24"
            legend={<ChartLegend items={[{ label: "Highlighted lead" }, { label: "Other leads", tone: "bg-border-strong" }, { label: "Remaining", kind: "dither" }]} />}
          >
            <ProgressBars
              highlight={2}
              target={70}
              delta="+12 pts"
              items={[
                { label: "Inès", marker: "I", value: 62 },
                { label: "Hugo", marker: "H", value: 48 },
                { label: "Léa", marker: "L", value: 87 },
                { label: "Malik", marker: "M", value: 34 },
              ]}
            />
          </ChartCard>
        </div>
        <div className="flex flex-col gap-4 md:col-span-2">
          <StatCard label="Revenue" value="€482.9k" delta="+12.4%" caption="vs last month" trend="up" icon={<Icon icon={DollarCircleIcon} />} sparkline={[12, 14, 13, 16, 15, 18, 17, 21, 20, 24]} />
          <div className="flex flex-col gap-4 rounded-surface border bg-surface p-5 shadow-xs">
            <UsageMeter label="API calls" max={10000} segments={[{ label: "Production", value: 4200 }, { label: "Staging", value: 2040 }]} caption="62% used" />
            <Switch variant="box" placement="end" label="Weekly digest" description="Every Monday at 9:00." defaultChecked />
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-surface border bg-surface p-5 shadow-xs md:col-span-3">
          <Tabs defaultValue="week">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <ButtonGroup aria-label="Report actions">
            <Button variant="ghost" size="sm"><Icon icon={Share08Icon} />Share</Button>
            <ButtonGroupSeparator />
            <Button variant="ghost" size="sm"><Icon icon={Copy01Icon} />Duplicate</Button>
            <ButtonGroupSeparator />
            <Button variant="ghost" size="sm"><Icon icon={Archive02Icon} />Archive</Button>
          </ButtonGroup>
          <div className="flex flex-wrap gap-2">
            <Button>Save changes</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="secondary">Draft</Button>
          </div>
        </div>
        <div className="relative isolate flex flex-col gap-3 overflow-hidden rounded-surface border bg-surface p-5 shadow-xs md:col-span-3">
          <AiGlow direction="to-b" className="bottom-1/2" />
          <p className="text-sm font-semibold">Agent run</p>
          <Timeline>
            <TimelineItem status="success" title="Read invoices" description="invoices_2026.csv · 248 rows" time="09:12" />
            <TimelineItem status="success" title="Compared plans" time="09:12" />
            <TimelineItem status="warning" title="Usage at 90%" description="API calls on the Pro plan." time="09:13" />
          </Timeline>
        </div>
      </section>

      {/* Numbers */}
      <section className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-surface border bg-border md:grid-cols-4">
        {[
          [String(counts.primitives), "UI primitives"],
          [String(counts.blocks), "Product & AI blocks"],
          [String(counts.charts), "Signature charts"],
          ["12", "Showcase screens"],
        ].map(([n, label]) => (
          <div key={label} className="flex flex-col gap-1 bg-surface p-6">
            <span className="font-heading text-4xl font-semibold tracking-tight tabular">{n}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </section>

      {/* Grammar */}
      <section className="mx-auto mt-20 flex w-full max-w-6xl flex-col gap-8 px-4">
        <div className="flex flex-col gap-2">
          <Eyebrow>Design grammar</Eyebrow>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Starts from shadcn/ui. Ends up somewhere else.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grammar.map((g, i) => (
            <div key={g.title} className="flex flex-col gap-1 rounded-surface bg-background-muted p-1">
              <div className="relative isolate h-20 overflow-hidden rounded-[calc(var(--radius-surface)-4px)] border bg-surface shadow-xs">
                <DitherFill shape={(["cloud", "scatter", "halo", "flow"] as const)[i % 4]} seed={i + 3} />
              </div>
              <div className="flex flex-col gap-1 px-3 pt-2 pb-3">
                <h3 className="text-sm font-semibold">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-20 grid w-full max-w-6xl scroll-mt-24 gap-8 px-4 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-2">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight">Questions</h2>
          <p className="text-sm text-muted-foreground">
            Dither is free and <Link href="/license" className="underline underline-offset-4">MIT licensed</Link>.
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
                {f.a.split(/(`[^`]+`)/).map((part, i) =>
                  part.startsWith("`") ? (
                    <code key={i} className="rounded-hairline bg-background-muted px-1 font-mono text-[0.85em]">
                      {part.slice(1, -1)}
                    </code>
                  ) : (
                    part
                  ),
                )}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
