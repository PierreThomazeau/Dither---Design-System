import type { Metadata } from "next";
import { Analytics01Icon, Calendar03Icon, FilterIcon, PieChartIcon, AlertCircleIcon, Search01Icon, SmileIcon, SparklesIcon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { northwind } from "@/components/showcase/nav";
import { PageHeader, Panel } from "@/components/showcase/page-header";
import { StatCard } from "@/registry/dither/blocks/stat-card";
import { WorkloadTile } from "@/registry/dither/blocks/workload-tile";
import { ChartCard, ChartLegend, PeriodButton } from "@/registry/dither/charts/chart-kit";
import { ProgressBars } from "@/registry/dither/charts/progress-bars";
import { AiGlow } from "@/registry/dither/lib/ai-glow";
import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/dither/ui/avatar";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { SidePanelContent, SidePanelFooter, SidePanelHeader, SidePanelTrigger } from "@/registry/dither/ui/side-panel";
import { Timeline, TimelineItem } from "@/registry/dither/blocks/timeline";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export const metadata: Metadata = { title: "Team overview · Showcase" };

const squads = [
  { name: "Growth", done: 18, total: 24 },
  { name: "Core platform", done: 11, total: 22 },
  { name: "Design system", done: 16, total: 16 },
  { name: "Mobile app", done: 5, total: 20 },
];

const leads = [
  { initials: "IM", name: "Inès Moreau", focus: "Growth · 3 initiatives" },
  { initials: "HL", name: "Hugo Lambert", focus: "Core platform · on call" },
  { initials: "LD", name: "Léa Dubois", focus: "Design system · v4 release" },
  { initials: "MB", name: "Malik Benali", focus: "Mobile app · hiring 2" },
];

const rituals = [
  { title: "Growth · Sprint review", when: "Today · 14:00 · 45 min", primary: true },
  { title: "Design critique", when: "Today · 16:30 · 30 min" },
  { title: "Core platform · Planning", when: "Tomorrow · 10:00 · 1 h" },
];

const activity = [
  { who: "H", text: "Hugo L. assigned Malik to OKR-39 Capacity forecast", meta: "5 minutes ago · Core platform", tag: "Assigned", variant: "outline" as const },
  { who: "J", text: "Jon D. commented on SPR-41 Onboarding empty state", meta: "32 minutes ago · Growth", tag: "Comment", variant: "outline" as const },
  { who: "B", text: "Ben K. completed HIR-27 Hiring pipeline review", meta: "1 hour ago · Hiring", tag: "Done", variant: "default" as const },
  { who: "S", text: "Sara M. moved Retention objective to At risk", meta: "Yesterday · OKRs Q4", tag: "At risk", variant: "destructive" as const },
];

function People({ list }: { list: string[] }) {
  return (
    <AvatarGroup>
      {list.map((p) => (
        <Avatar key={p} size="xs">
          <AvatarFallback>{p}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

/** Right-hand Side Panel: pushes the overview to the left when "Details" is pressed. */
function SprintPanel() {
  return (
    <>
      <SidePanelHeader title="Sprint 24" description="Nov 18 – Nov 29 · 4 squads" />
      <SidePanelContent>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="positive">On track</Badge>
          <Badge variant="outline">50 / 82 pts</Badge>
          <Badge variant="destructive">2 blockers</Badge>
        </div>
        <section className="flex flex-col gap-1.5 rounded-[calc(var(--radius-surface)-8px)] border bg-surface p-4">
          <h3 className="text-sm font-semibold">Goal</h3>
          <p className="text-sm leading-6 text-muted-foreground">Ship the checkout redesign to 50% of traffic and close the accessibility sign-off.</p>
        </section>
        <section className="flex flex-col gap-3 rounded-[calc(var(--radius-surface)-8px)] border bg-surface p-4">
          <h3 className="text-sm font-semibold">Activity</h3>
          <Timeline>
            <TimelineItem status="success" title="Payment step merged" description="Growth · ATL-142" time="10:42" />
            <TimelineItem status="warning" title="Mobile app at 125% capacity" description="Two tasks moved to Sprint 25" time="09:15" />
            <TimelineItem status="error" title="Accessibility sign-off blocked" description="5 specs waiting on review" time="Yesterday" />
            <TimelineItem title="Sprint started" description="82 points committed" time="Nov 18" />
          </Timeline>
        </section>
      </SidePanelContent>
      <SidePanelFooter>
        <Button variant="outline">Open board</Button>
        <Button>Plan Sprint 25</Button>
      </SidePanelFooter>
    </>
  );
}

export default function TeamOverview() {
  return (
    <AppShell {...northwind("Overview")} breadcrumb={["Overview"]} panel={<SprintPanel />} panelLabel="Sprint details">
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <PageHeader
          title="Team overview"
          status="Updated just now"
          people={["I", "H", "L"]}
          live
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>Plan sprint</Button>
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Search">
            <Icon icon={Search01Icon} />
          </Button>
          <Button variant="outline" size="sm">
            <Icon icon={FilterIcon} />
            All squads
          </Button>
          <PeriodButton className="ml-auto">Sprint 24</PeriodButton>
        </div>

        <div className="grid gap-3 @xl:grid-cols-2 @5xl:grid-cols-4">
          <StatCard label="Delivery velocity" value="42 pts" delta="+8%" caption="vs last sprint" trend="up" icon={<Icon icon={Analytics01Icon} />} sparkline={[30, 32, 31, 35, 34, 38, 37, 42]} />
          <StatCard label="Capacity used" value="86%" delta="+3 pts" caption="across 6 squads" trend="neutral" icon={<Icon icon={PieChartIcon} />} sparkline={[80, 82, 81, 84, 83, 85, 84, 86]} />
          <StatCard label="Open blockers" value="7" delta="+3" caption="since Monday" trend="down" icon={<Icon icon={AlertCircleIcon} />} sparkline={[3, 4, 4, 5, 4, 6, 6, 7]} />
          <StatCard label="Team health" value="8.2/10" delta="+0.4" caption="pulse survey" trend="up" icon={<Icon icon={SmileIcon} />} sparkline={[7.4, 7.5, 7.7, 7.6, 7.9, 8, 8.1, 8.2]} />
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold tracking-tight">Workload</h2>
            <span className="text-xs text-muted-foreground">12 open items across 4 squads</span>
          </div>
          <div className="grid gap-2 @xl:grid-cols-2 @5xl:grid-cols-4">
            <WorkloadTile count={2} status="backlog" due="Due 12 Nov" assignees={<People list={["M", "J"]} />} />
            <WorkloadTile count={1} status="not-started" due="Due 14 Nov" assignees={<People list={["J"]} />} />
            <WorkloadTile count={3} status="in-progress" title="Working on" due="Due 12 Nov" assignees={<People list={["F", "M"]} />} />
            <WorkloadTile count={4} status="done" title="Completed" due="Due 12 Nov" assignees={<People list={["F", "J"]} />} />
          </div>
        </section>

        <div className="grid gap-4 @5xl:grid-cols-[1.6fr_1fr]">
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
              height={200}
              items={[
                { label: "Inès", marker: "I", value: 62 },
                { label: "Hugo", marker: "H", value: 48 },
                { label: "Léa", marker: "L", value: 87 },
                { label: "Malik", marker: "M", value: 34 },
              ]}
            />
          </ChartCard>
          <section className="flex flex-col gap-1 rounded-surface bg-background-muted p-1">
            <div className="flex items-start justify-between gap-3 px-3 pt-2 pb-1.5">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-semibold tracking-tight">Sprint 24 progress</h2>
                <p className="text-sm text-muted-foreground">Ends Friday · 4 days left</p>
              </div>
              <SidePanelTrigger asChild>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </SidePanelTrigger>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-4 shadow-xs">
              {squads.map((s) => (
                <div key={s.name} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="font-mono text-xs text-muted-foreground tabular">
                      {s.done} / {s.total} pts
                    </span>
                  </div>
                  <span className="relative h-1.5 overflow-hidden rounded-full">
                    <span className="bg-dither-organic absolute inset-0" />
                    <span className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: `${(s.done / s.total) * 100}%` }} />
                  </span>
                </div>
              ))}
              <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t pt-3 text-sm">
                <dt className="text-muted-foreground">Shipped</dt>
                <dd className="text-right font-mono text-xs tabular">50 / 82 pts</dd>
                <dt className="text-muted-foreground">Forecast</dt>
                <dd className="text-right">On track for 3 of 4 squads</dd>
                <dt className="text-muted-foreground">At risk</dt>
                <dd className="text-right text-destructive">Mobile app · 2 blockers</dd>
              </dl>
            </div>
          </section>
        </div>

        <div className="grid gap-4 @3xl:grid-cols-2">
          <Panel title="Squad leads" subtitle="Load and focus this sprint">
            <ul className="flex flex-col gap-3">
              {leads.map((l) => (
                <li key={l.name} className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{l.initials}</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{l.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{l.focus}</span>
                  </span>
                  <Button variant="outline" size="sm">View</Button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Upcoming rituals" subtitle="Today and tomorrow">
            <ul className="flex flex-col gap-2">
              {rituals.map((r) => (
                <li key={r.title} className="flex items-center gap-3 rounded-field border p-2.5 pl-3">
                  <span className="flex size-8 items-center justify-center rounded-control border text-muted-foreground">
                    <Icon icon={Calendar03Icon} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{r.title}</span>
                    <span className="truncate font-mono text-xs text-muted-foreground">{r.when}</span>
                  </span>
                  <Button size="sm" variant={r.primary ? "default" : "outline"}>Join</Button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid gap-4 @5xl:grid-cols-[1.6fr_1fr]">
          <Panel
            title="Recent activity"
            action={
              <Tabs defaultValue="all">
                <TabsList size="xs">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="mentions">Mentions</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          >
            <ul className="flex flex-col divide-y">
              {activity.map((a) => (
                <li key={a.text} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar size="xs">
                    <AvatarFallback>{a.who}</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm">{a.text}</span>
                    <span className="truncate text-xs text-muted-foreground">{a.meta}</span>
                  </span>
                  <Badge variant={a.variant}>{a.tag}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <section className="relative isolate flex flex-col gap-3 overflow-hidden rounded-surface border bg-surface p-5 shadow-xs">
            <AiGlow direction="to-b" className="bottom-1/2" />
            <span className="flex size-8 items-center justify-center rounded-control border bg-surface">
              <Icon icon={SparklesIcon} />
            </span>
            <h2 className="mt-auto text-lg font-semibold tracking-tight">Your week, summarised</h2>
            <p className="text-sm text-muted-foreground">6 items closed and 2 due today. Get a quick recap before the Sprint 24 review.</p>
            <div className="flex gap-2">
              <Button>
                <Icon icon={SparklesIcon} />
                Generate recap
              </Button>
              <Button variant="ghost">Later</Button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
