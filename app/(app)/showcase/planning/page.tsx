import type { Metadata } from "next";
import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { northwind } from "@/components/showcase/nav";
import { PageHeader } from "@/components/showcase/page-header";
import { CapacityBar } from "@/registry/dither/charts/capacity-bar";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Button } from "@/registry/dither/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export const metadata: Metadata = { title: "Planning · Showcase" };

const days = ["Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27"];
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
type Ev = { day: number; start: number; end: number; title: string; meta: string; tone: string };
const events: Ev[] = [
  { day: 0, start: 9.5, end: 10, title: "Standup", meta: "All squads", tone: "border-border-strong bg-background-muted" },
  { day: 0, start: 14, end: 15, title: "Sprint planning", meta: "Growth", tone: "border-chart-1 bg-chart-1/10" },
  { day: 1, start: 9.5, end: 10, title: "Standup", meta: "All squads", tone: "border-border-strong bg-background-muted" },
  { day: 1, start: 11, end: 12.5, title: "Design critique", meta: "Design system", tone: "border-informative bg-informative/10" },
  { day: 2, start: 9.5, end: 10, title: "Standup", meta: "All squads", tone: "border-border-strong bg-background-muted" },
  { day: 2, start: 13, end: 14, title: "1:1 Hugo", meta: "Core platform", tone: "border-chart-4 bg-chart-4/10" },
  { day: 2, start: 15, end: 16.5, title: "Roadmap review", meta: "Leads", tone: "border-chart-1 bg-chart-1/10" },
  { day: 3, start: 9.5, end: 10, title: "Standup", meta: "All squads", tone: "border-border-strong bg-background-muted" },
  { day: 3, start: 10.5, end: 12, title: "Accessibility audit", meta: "Checkout", tone: "border-destructive bg-destructive/10" },
  { day: 4, start: 9.5, end: 10, title: "Standup", meta: "All squads", tone: "border-border-strong bg-background-muted" },
  { day: 4, start: 14, end: 15, title: "Sprint 24 review", meta: "All squads", tone: "border-chart-1 bg-chart-1/10" },
  { day: 4, start: 16, end: 17, title: "Retro", meta: "All squads", tone: "border-positive bg-positive/10" },
];
const HOUR = 52;

export default function Planning() {
  return (
    <AppShell {...northwind("Planning")} breadcrumb={["Planning", "Week 48"]}>
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <PageHeader
          title="Rituals · Week 48"
          actions={
            <>
              <Tabs defaultValue="week">
                <TabsList size="sm">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button>
                <Icon icon={PlusSignIcon} />
                New event
              </Button>
            </>
          }
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
          <section className="min-w-0 overflow-x-auto rounded-surface border bg-surface shadow-xs">
            <div className="flex items-center gap-2 border-b px-4 py-2.5">
              <Button variant="ghost" size="icon-xs" aria-label="Previous week"><Icon icon={ArrowLeft01Icon} /></Button>
              <Button variant="ghost" size="icon-xs" aria-label="Next week"><Icon icon={ArrowRight01Icon} /></Button>
              <span className="text-sm font-medium">November 23 – 27, 2026</span>
              <Button variant="outline" size="xs" className="ml-auto">Today</Button>
            </div>
            <div className="grid min-w-[640px]" style={{ gridTemplateColumns: `48px repeat(${days.length}, 1fr)` }}>
              <span />
              {days.map((d, i) => (
                <span key={d} className={cn("border-b border-l px-2 py-2 font-mono text-xs text-muted-foreground", i === 2 && "font-medium text-foreground")}>
                  {d}
                  {i === 2 ? <span className="ml-1.5 rounded-hairline bg-foreground px-1 text-[10px] text-primary-foreground uppercase">Today</span> : null}
                </span>
              ))}
              <div className="relative" style={{ height: hours.length * HOUR }}>
                {hours.map((h, i) => (
                  <span key={h} className="absolute right-2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground" style={{ top: i * HOUR }}>
                    {i ? `${h}:00` : ""}
                  </span>
                ))}
              </div>
              {days.map((d, di) => (
                <div key={d} className="relative border-l" style={{ height: hours.length * HOUR }}>
                  {hours.map((h, i) => (
                    <span key={h} aria-hidden="true" className="absolute inset-x-0 border-t border-dotted border-border" style={{ top: i * HOUR }} />
                  ))}
                  {events
                    .filter((e) => e.day === di)
                    .map((e) => (
                      <div
                        key={e.title + e.start}
                        className={cn("absolute inset-x-1 overflow-hidden rounded-[8px] border-l-2 px-2 py-1", e.tone)}
                        style={{ top: (e.start - 9) * HOUR + 1, height: (e.end - e.start) * HOUR - 2 }}
                      >
                        <p className="truncate text-xs font-medium">{e.title}</p>
                        {e.end - e.start > 0.5 ? <p className="truncate font-mono text-[10px] text-muted-foreground">{e.meta}</p> : null}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </section>
          <aside className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 rounded-surface border bg-surface p-5 shadow-xs">
              <h2 className="text-base font-semibold tracking-tight">Time in meetings</h2>
              <CapacityBar
                total={40}
                display="14h"
                caption="of 40h this week"
                format={(n) => `${n}h`}
                segments={[{ label: "Rituals", value: 9 }, { label: "1:1s", value: 5 }]}
              />
            </section>
            <section className="flex flex-col gap-3 rounded-surface border bg-surface p-5 shadow-xs">
              <h2 className="text-base font-semibold tracking-tight">Squads</h2>
              {[
                ["Growth", "bg-chart-1"],
                ["Design system", "bg-informative"],
                ["Core platform", "bg-chart-4"],
                ["Checkout", "bg-destructive"],
              ].map(([name, tone]) => (
                <label key={name} className="flex items-center gap-2 text-sm">
                  <span className={cn("size-2.5 rounded-[2px]", tone)} />
                  {name}
                </label>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
