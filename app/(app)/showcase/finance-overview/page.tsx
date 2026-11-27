import type { Metadata } from "next";
import { Calendar03Icon, CheckmarkCircle01Icon, Wallet01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { lumen } from "@/components/showcase/nav";
import { PageHeader, Panel } from "@/components/showcase/page-header";
import { StatCard } from "@/registry/dither/blocks/stat-card";
import { ChartCard, ChartLegend } from "@/registry/dither/charts/chart-kit";
import { DonutChart } from "@/registry/dither/charts/donut-chart";
import { CashForecast } from "@/components/showcase/client-charts";
import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/dither/ui/table";

export const metadata: Metadata = { title: "Finance overview · Showcase" };

const cash = [3.1, 3.3, 3.2, 3.6, 3.8, 3.7, 4.0, 4.2, 4.1, 4.5, 4.6, 4.8];
const approvals = [
  { who: "SR", title: "Design tools renewal", meta: "Software · €12,400", by: "Sara M." },
  { who: "HL", title: "Offsite Lisbon", meta: "Travel · €8,900", by: "Hugo L." },
  { who: "IM", title: "Contractor: data audit", meta: "Services · €6,200", by: "Inès M." },
];

const transactions = [
  { id: "TX-8841", party: "Acme Corp", date: "Nov 24", amount: "+€126,000", status: "Received" },
  { id: "TX-8839", party: "Cloud hosting", date: "Nov 23", amount: "−€18,450", status: "Paid" },
  { id: "TX-8836", party: "Globex", date: "Nov 22", amount: "+€42,900", status: "Received" },
  { id: "TX-8830", party: "Payroll November", date: "Nov 21", amount: "−€816,000", status: "Scheduled" },
];

export default function FinanceOverview() {
  return (
    <AppShell {...lumen("Overview")} breadcrumb={["Finance", "Overview"]}>
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <PageHeader
          title="Finance overview"
          status="Synced with ledger · 5 min ago"
          people={["A", "S"]}
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>New report</Button>
            </>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Cash balance" value="€4.82M" delta="+€412k" caption="vs October" trend="up" icon={<Icon icon={Wallet01Icon} />} sparkline={cash} />
          <StatCard label="Monthly burn" value="€412k" delta="−4%" caption="vs October" trend="up" icon={<Icon icon={AlertCircleIcon} />} sparkline={[460, 450, 440, 445, 430, 425, 420, 412]} />
          <StatCard label="Runway" value="18 mo" delta="+2 mo" caption="at current burn" trend="up" icon={<Icon icon={Calendar03Icon} />} />
          <StatCard label="Collected on time" value="92%" delta="+3 pts" caption="last 90 days" trend="up" icon={<Icon icon={CheckmarkCircle01Icon} />} sparkline={[86, 87, 88, 88, 90, 89, 91, 92]} />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <ChartCard
            title="Cash balance"
            subtitle="Monthly actuals and 3-month forecast"
            action="Last 12 months"
            legend={<ChartLegend items={[{ label: "Actual", kind: "line" }, { label: "Forecast", kind: "dashed" }, { label: "Confidence range", kind: "dither" }]} />}
          >
            <CashForecast />
          </ChartCard>
          <ChartCard title="Q4 spend" subtitle="By category" action="Q4 2026">
            <DonutChart
              value="€2.4M"
              caption="Q4 budget"
              format={(n) => `€${n}k`}
              size={150}
              segments={[
                { label: "Payroll", value: 816 },
                { label: "Software", value: 576 },
                { label: "Office", value: 432 },
                { label: "Travel", value: 240 },
                { label: "Unallocated", value: 336, unallocated: true },
              ]}
            />
          </ChartCard>
        </div>
        <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
          <Panel title="Pending approvals" subtitle="3 requests · €27,500" action={<Button variant="outline" size="sm">View all</Button>}>
            <ul className="flex flex-col divide-y">
              {approvals.map((a) => (
                <li key={a.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar size="sm">
                    <AvatarFallback>{a.who}</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{a.title}</span>
                    <span className="truncate font-mono text-xs text-muted-foreground">{a.meta}</span>
                  </span>
                  <Button size="sm" variant="outline">Approve</Button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Recent transactions" action={<Button variant="ghost" size="sm">View all</Button>}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                    <TableCell>{t.party}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.date}</TableCell>
                    <TableCell className={`text-right font-mono tabular ${t.amount.startsWith("+") ? "text-positive-ink" : ""}`}>{t.amount}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === "Scheduled" ? "outline" : "secondary"}>{t.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
