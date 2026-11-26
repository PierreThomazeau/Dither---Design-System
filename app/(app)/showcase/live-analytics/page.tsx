import type { Metadata } from "next";
import { SparklesIcon } from "@hugeicons/core-free-icons";

import { DitherFill } from "@/registry/dither/lib/dither";
import { AppShell } from "@/components/showcase/app-shell";
import { lumen } from "@/components/showcase/nav";
import { PageHeader, Panel } from "@/components/showcase/page-header";
import { ActivityHeatmap } from "@/registry/dither/blocks/activity-heatmap";
import { AnnouncementBar } from "@/registry/dither/blocks/announcement-bar";
import { Gauge } from "@/registry/dither/blocks/gauge";
import { Sparkline } from "@/registry/dither/blocks/sparkline";
import { Timeline, TimelineItem } from "@/registry/dither/blocks/timeline";
import { UsageMeter } from "@/registry/dither/blocks/usage-meter";
import { Icon } from "@/registry/dither/lib/icon";
import { Badge } from "@/registry/dither/ui/badge";

export const metadata: Metadata = { title: "Live analytics · Showcase" };

const heat = Array.from({ length: 20 * 7 }, (_, i) => {
  const weekday = i % 7;
  const wave = Math.sin(i / 9) * 3 + Math.cos(i / 4) * 2;
  return weekday > 4 ? Math.max(0, Math.round(wave / 2)) : Math.max(0, Math.round(wave + 3));
});

const pages = [
  { path: "/pricing", visitors: 412, share: 32 },
  { path: "/docs/getting-started", visitors: 286, share: 22 },
  { path: "/blog/q4-update", visitors: 198, share: 15 },
  { path: "/signup", visitors: 151, share: 12 },
];

export default function LiveAnalytics() {
  return (
    <AppShell {...lumen("Live")} breadcrumb={["Analytics", "Live"]}>
      <AnnouncementBar variant="promo" icon={<Icon icon={SparklesIcon} />} action={<a href="#">See what’s new →</a>} className="rounded-t-[calc(var(--radius-body)-1px)]">
        Live analytics now refreshes every 5 seconds.
      </AnnouncementBar>
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <PageHeader title="Live analytics" status="Streaming · 5 s refresh" live />
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          <Panel title="Visitors right now" subtitle="Across all properties">
            <div className="flex items-end justify-between gap-4">
              <span className="font-heading text-5xl leading-none font-semibold tracking-tight tabular">1,284</span>
              <Badge variant="positive">+12% vs 1 h ago</Badge>
            </div>
            <Sparkline data={[820, 880, 910, 940, 1010, 1080, 1060, 1150, 1190, 1240, 1220, 1284]} dither className="h-16 text-chart-1" label="Visitors, rising over the last hour" />
          </Panel>
          <Panel title="Site health" subtitle="Uptime, errors and latency">
            <div className="flex flex-wrap items-end justify-around gap-4">
              <Gauge value={94} label="Health score" status="good" className="w-32" />
              <Gauge value={68} label="Latency score" status="warning" className="w-32" />
            </div>
          </Panel>
          <Panel title="Quotas" subtitle="Resets Dec 1">
            <UsageMeter label="Events" max={5_000_000} segments={[{ label: "Tracked", value: 3_100_000 }, { label: "Replays", value: 600_000 }]} caption="74% used" format={(n) => `${(n / 1_000_000).toFixed(1)}M`} />
            <UsageMeter label="Seats" max={25} segments={[{ label: "Members", value: 24 }]} status="critical" caption="1 seat left" />
          </Panel>
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Panel title="Daily activity" subtitle="Sessions per day · last 20 weeks">
            <div className="overflow-x-auto">
              <ActivityHeatmap values={heat} start="2026-07-06" unit="sessions" />
            </div>
          </Panel>
          <Panel title="Top pages" subtitle="Live visitors by page">
            <ul className="flex flex-col gap-3">
              {pages.map((p) => (
                <li key={p.path} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="truncate font-mono text-xs">{p.path}</span>
                    <span className="font-mono text-xs text-muted-foreground tabular">{p.visitors}</span>
                  </div>
                  <span className="relative h-1.5 overflow-hidden rounded-full">
                    <DitherFill variant="organic" />
                    <span className="absolute inset-y-0 left-0 rounded-full bg-chart-1" style={{ width: `${p.share * 3}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel title="Event stream" subtitle="Most recent first">
          <Timeline>
            <TimelineItem status="success" title="Plan upgraded" description="Northwind Studio moved to Teams." time="14:02:11" />
            <TimelineItem title="Report shared" description="“Q4 revenue” shared with 12 people." time="14:01:47" />
            <TimelineItem status="warning" title="Slow page" description="/docs/api p95 over 1.2 s." time="14:00:58" />
            <TimelineItem status="error" title="Webhook failed" description="Delivery to the billing endpoint timed out." time="13:59:30" />
          </Timeline>
        </Panel>
      </div>
    </AppShell>
  );
}
