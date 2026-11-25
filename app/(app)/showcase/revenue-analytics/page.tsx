import type { Metadata } from "next";

import { AppShell } from "@/components/showcase/app-shell";
import { lumen } from "@/components/showcase/nav";
import { PageHeader } from "@/components/showcase/page-header";
import { StatCard } from "@/registry/dither/blocks/stat-card";
import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { CostsMargin, RevenueStreams } from "@/components/showcase/client-charts";
import { FunnelChart } from "@/registry/dither/charts/funnel-chart";
import { RankingChart } from "@/registry/dither/charts/ranking-chart";
import { WaterfallChart } from "@/registry/dither/charts/waterfall-chart";
import { Button } from "@/registry/dither/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export const metadata: Metadata = { title: "Revenue analytics · Showcase" };

export default function RevenueAnalytics() {
  return (
    <AppShell {...lumen("Revenue")} breadcrumb={["Finance", "Revenue"]}>
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <PageHeader
          title="Revenue analytics"
          status="Updated 2 min ago"
          actions={
            <>
              <Tabs defaultValue="q4">
                <TabsList>
                  <TabsTrigger value="q3">Q3</TabsTrigger>
                  <TabsTrigger value="q4">Q4</TabsTrigger>
                  <TabsTrigger value="ytd">YTD</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline">Export</Button>
            </>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Revenue" value="€5.8M" delta="+26%" caption="QoQ" trend="up" sparkline={[4.1, 4.3, 4.6, 4.8, 5.0, 5.3, 5.6, 5.8]} />
          <StatCard label="ARR" value="€22.4M" delta="+18%" caption="YoY" trend="up" sparkline={[18, 18.6, 19.2, 19.9, 20.5, 21.1, 21.8, 22.4]} />
          <StatCard label="Net retention" value="112%" delta="+2 pts" caption="trailing 12 mo" trend="up" />
          <StatCard label="Churn" value="3.4%" delta="+0.2 pts" caption="vs Q3" trend="down" sparkline={[2.9, 3.0, 3.1, 3.0, 3.2, 3.3, 3.3, 3.4]} />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard
            title="Revenue by stream"
            subtitle="Weekly revenue · stacked"
            action="Last 12 weeks"
            legend={<ChartLegend items={[{ label: "Subscriptions" }, { label: "Services", tone: "bg-chart-4" }, { label: "Add-ons", tone: "bg-chart-3" }, { label: "Total", kind: "line", tone: "bg-foreground" }]} />}
          >
            <RevenueStreams />
          </ChartCard>
          <ChartCard
            title="Revenue bridge"
            subtitle="Q3 → Q4 revenue drivers"
            action="Q4 2026"
            legend={<ChartLegend items={[{ label: "Total", tone: "bg-foreground" }, { label: "Increase", tone: "bg-positive" }, { label: "Decrease", tone: "bg-destructive" }, { label: "Headroom", kind: "dither" }]} />}
          >
            <WaterfallChart
              delta="+26% QoQ"
              format={(n) => `€${n.toFixed(1)}M`}
              steps={[
                { label: "Q3", value: 4.6, kind: "total" },
                { label: "New", value: 0.9 },
                { label: "Upsell", value: 0.5 },
                { label: "Churn", value: -0.6 },
                { label: "Pricing", value: 0.4 },
                { label: "Q4", value: 5.8, kind: "total" },
              ]}
            />
          </ChartCard>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <ChartCard
            title="Return by product"
            subtitle="Revenue per € of cost"
            action="Q4 2026"
            legend={<ChartLegend items={[{ label: "Top product" }, { label: "Profitable", tone: "bg-foreground/85" }, { label: "Below break-even", tone: "bg-destructive" }]} />}
          >
            <RankingChart
              max={3}
              breakEven={1}
              data={[
                { label: "Enterprise", value: 2.8 },
                { label: "Pro", value: 2.4 },
                { label: "Teams", value: 2.1 },
                { label: "Starter", value: 1.4 },
                { label: "Legacy", value: 0.8 },
              ]}
            />
          </ChartCard>
          <ChartCard
            title="Costs & margin"
            subtitle="Monthly costs with gross margin"
            action="2026"
            legend={<ChartLegend items={[{ label: "Costs", tone: "bg-border-strong" }, { label: "Margin", kind: "line" }, { label: "Budget cap", kind: "dither" }]} />}
          >
            <CostsMargin />
          </ChartCard>
          <ChartCard
            title="Conversion funnel"
            subtitle="Visit to paid · last 30 days"
            action="30 days"
            legend={<ChartLegend items={[{ label: "Converted", tone: "bg-foreground/85" }, { label: "Paid" }, { label: "Drop-off", kind: "dither" }]} />}
          >
            <FunnelChart
              stages={[
                { label: "Visitors", value: 1_200_000 },
                { label: "Sign-ups", value: 384_000 },
                { label: "Trial", value: 41_000 },
                { label: "Paid", value: 28_000 },
              ]}
            />
          </ChartCard>
        </div>
      </div>
    </AppShell>
  );
}
