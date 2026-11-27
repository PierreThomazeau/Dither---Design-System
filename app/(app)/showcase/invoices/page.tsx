import type { Metadata } from "next";
import { Calendar03Icon, CheckmarkCircle01Icon, FilterIcon, MoreHorizontalIcon, Search01Icon, Wallet01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { lumen } from "@/components/showcase/nav";
import { PageHeader } from "@/components/showcase/page-header";
import { Chip } from "@/registry/dither/blocks/chip";
import { StatCard } from "@/registry/dither/blocks/stat-card";
import { PeriodButton } from "@/registry/dither/charts/chart-kit";
import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { Checkbox } from "@/registry/dither/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/dither/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export const metadata: Metadata = { title: "Invoices · Showcase" };

type Status = "Paid" | "Pending" | "Overdue" | "Draft";
const rows: { id: string; customer: string; initials: string; issued: string; due: string; amount: string; status: Status; selected?: boolean }[] = [
  { id: "INV-2026-0412", customer: "Acme Corp", initials: "AC", issued: "Nov 02", due: "Dec 02", amount: "€126,000", status: "Paid" },
  { id: "INV-2026-0411", customer: "Globex", initials: "GL", issued: "Nov 01", due: "Dec 01", amount: "€18,450", status: "Pending" },
  { id: "INV-2026-0409", customer: "Initech", initials: "IN", issued: "Oct 28", due: "Nov 27", amount: "€42,900", status: "Overdue", selected: true },
  { id: "INV-2026-0407", customer: "Umbrella Health", initials: "UH", issued: "Oct 25", due: "Nov 24", amount: "€9,300", status: "Overdue", selected: true },
  { id: "INV-2026-0405", customer: "Stark Studio", initials: "ST", issued: "Oct 21", due: "Nov 20", amount: "€61,200", status: "Paid" },
  { id: "INV-2026-0404", customer: "Wayne Retail", initials: "WR", issued: "Oct 18", due: "Nov 17", amount: "€27,750", status: "Paid" },
  { id: "INV-2026-0402", customer: "Hooli", initials: "HO", issued: "Oct 15", due: "Nov 14", amount: "€14,000", status: "Draft" },
  { id: "INV-2026-0401", customer: "Soylent Foods", initials: "SF", issued: "Oct 12", due: "Nov 11", amount: "€33,480", status: "Paid" },
];

const statusVariant: Record<Status, "secondary" | "outline" | "destructive"> = {
  Paid: "secondary",
  Pending: "outline",
  Overdue: "destructive",
  Draft: "outline",
};

export default function Invoices() {
  return (
    <AppShell {...lumen("Invoices")} breadcrumb={["Finance", "Invoices"]}>
      <div className="relative flex flex-col gap-5 p-5 pb-24 md:p-6 md:pb-24">
        <PageHeader
          title="Invoices"
          status="Synced with ledger · 5 min ago"
          people={["I", "H", "L"]}
          live
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>New invoice</Button>
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Search">
            <Icon icon={Search01Icon} />
          </Button>
          <Button variant="outline" size="sm">
            <Icon icon={FilterIcon} />
            Filters
          </Button>
          <PeriodButton className="ml-auto">Due date</PeriodButton>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Outstanding" value="€48,200" delta="+€4.1k" caption="vs last month" trend="up" icon={<Icon icon={Wallet01Icon} />} sparkline={[38, 40, 39, 42, 44, 43, 46, 48]} />
          <StatCard label="Overdue" value="€6,750" delta="3" caption="invoices late" trend="down" icon={<Icon icon={AlertCircleIcon} />} sparkline={[9, 8, 8, 7, 8, 7, 7, 6.7]} />
          <StatCard label="Paid this month" value="€112,400" delta="+18%" caption="vs October" trend="up" icon={<Icon icon={CheckmarkCircle01Icon} />} sparkline={[80, 85, 84, 92, 96, 101, 106, 112]} />
          <StatCard label="Avg. days to pay" value="21 d" delta="−2 d" caption="vs Q3" trend="neutral" icon={<Icon icon={Calendar03Icon} />} sparkline={[23, 23, 22, 22, 22, 21, 21, 21]} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs defaultValue="all" className="max-w-full min-w-0">
            <TabsList size="sm" className="max-w-full overflow-x-auto">
              <TabsTrigger value="all">All · 248</TabsTrigger>
              <TabsTrigger value="paid">Paid · 196</TabsTrigger>
              <TabsTrigger value="pending">Pending · 31</TabsTrigger>
              <TabsTrigger value="overdue">Overdue · 14</TabsTrigger>
              <TabsTrigger value="draft">Draft · 7</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap gap-1.5">
            <Chip selected>Due: this month</Chip>
            <Chip>Enterprise</Chip>
            <Chip>Amount &gt; €10k</Chip>
          </div>
        </div>
        <div className="min-w-0 rounded-surface border bg-surface p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <Checkbox aria-label="Select all" checked="indeterminate" />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} data-state={r.selected ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox aria-label={`Select ${r.id}`} defaultChecked={r.selected} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Avatar size="xs">
                        <AvatarFallback className="text-[9px]">{r.initials}</AvatarFallback>
                      </Avatar>
                      {r.customer}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.issued}</TableCell>
                  <TableCell className={`font-mono text-xs ${r.status === "Overdue" ? "text-destructive-ink" : "text-muted-foreground"}`}>{r.due}</TableCell>
                  <TableCell className="text-right font-mono tabular">{r.amount}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${r.id}`}>
                      <Icon icon={MoreHorizontalIcon} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 pb-1">
            <span className="text-sm text-muted-foreground">Showing 1–8 of 248 invoices</span>
            <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
              <Button variant="ghost" size="sm">Previous</Button>
              {["1", "2", "3", "…", "31"].map((p) => (
                <Button key={p} variant={p === "1" ? "outline" : "ghost"} size="icon-sm" aria-current={p === "1" ? "page" : undefined} className="font-mono text-xs">
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm">Next</Button>
            </nav>
          </div>
        </div>
        <div role="toolbar" aria-label="Bulk actions" className="sticky bottom-4 mx-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-field bg-foreground p-1 pl-4 text-primary-foreground shadow-xl">
          <span className="mr-2 font-mono text-xs tabular">2 selected</span>
          <Button size="sm" variant="secondary">Send reminder</Button>
          <Button size="sm" variant="secondary">Download PDF</Button>
          <Button size="sm" variant="secondary">Mark as paid</Button>
        </div>
      </div>
    </AppShell>
  );
}
