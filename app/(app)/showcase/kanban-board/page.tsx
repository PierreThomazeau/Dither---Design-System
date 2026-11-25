import type { Metadata } from "next";
import { FilterIcon, PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { northwind } from "@/components/showcase/nav";
import { PageHeader } from "@/components/showcase/page-header";
import { KanbanCard, type KanbanCardProps } from "@/registry/dither/blocks/kanban-card";
import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Button } from "@/registry/dither/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export const metadata: Metadata = { title: "Kanban board · Showcase" };

const who = (i: string) => (
  <Avatar size="xs">
    <AvatarFallback className="text-[9px]">{i}</AvatarFallback>
  </Avatar>
);

type Card = Omit<KanbanCardProps, "assignee"> & { a?: string };
const columns: { title: string; tone: string; cards: Card[] }[] = [
  {
    title: "Backlog",
    tone: "border-dashed border-border-strong",
    cards: [
      { id: "ATL-158", tag: "Research", priority: "low", title: "Interview 5 enterprise admins", comments: 2, due: "Dec 8", a: "IM" },
      { id: "ATL-161", tag: "Billing", priority: "medium", title: "Export invoices as CSV", comments: 0, due: "Dec 3" },
    ],
  },
  {
    title: "In progress",
    tone: "border-chart-1",
    cards: [
      { id: "ATL-142", tag: "Design", priority: "high", title: "Checkout redesign: payment step", subtasks: { done: 2, total: 5 }, comments: 4, files: 2, due: "Nov 28", a: "LD" },
      { id: "ATL-149", tag: "Platform", priority: "medium", title: "Rate limits for public API", subtasks: { done: 3, total: 4 }, comments: 7, due: "Nov 30", a: "HL" },
      { id: "ATL-150", tag: "Growth", priority: "low", title: "Referral banner A/B test", subtasks: { done: 1, total: 3 }, comments: 1, due: "Dec 2", a: "IM" },
    ],
  },
  {
    title: "Review",
    tone: "border-informative",
    cards: [{ id: "ATL-137", tag: "Design", priority: "medium", title: "Empty states for Reports", subtasks: { done: 4, total: 4 }, comments: 9, files: 6, due: "Nov 26", a: "LD" }],
  },
  {
    title: "Done",
    tone: "border-positive",
    cards: [
      { id: "ATL-128", tag: "Platform", priority: "high", title: "SSO for Teams plan", subtasks: { done: 6, total: 6 }, comments: 12, due: "Nov 20", a: "MB" },
      { id: "ATL-131", tag: "Docs", priority: "low", title: "Changelog for v4.2", comments: 3, due: "Nov 21", a: "HL" },
    ],
  },
];

export default function KanbanBoard() {
  return (
    <AppShell {...northwind("Board")} breadcrumb={["Projects", "Checkout redesign"]}>
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 md:p-6">
        <PageHeader
          title="Checkout redesign · Sprint 24"
          people={["L", "H", "I", "M"]}
          actions={
            <>
              <Button variant="outline">Share</Button>
              <Button>
                <Icon icon={PlusSignIcon} />
                New task
              </Button>
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <Tabs defaultValue="board">
            <TabsList size="sm">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon-sm" aria-label="Search" className="ml-auto">
            <Icon icon={Search01Icon} />
          </Button>
          <Button variant="outline" size="sm">
            <Icon icon={FilterIcon} />
            Filters
          </Button>
        </div>
        <div className="-mx-5 flex flex-1 gap-3 overflow-x-auto px-5 pb-2 md:-mx-6 md:px-6">
          {columns.map((col) => (
            <section key={col.title} aria-label={col.title} className="flex w-72 shrink-0 flex-col gap-2 rounded-surface bg-background-muted p-2">
              <header className="flex items-center gap-2 px-2 py-1">
                <span className={`size-3 rounded-full border-2 ${col.tone}`} />
                <h2 className="text-sm font-semibold">{col.title}</h2>
                <span className="font-mono text-xs text-muted-foreground tabular">{col.cards.length}</span>
                <Button variant="ghost" size="icon-xs" className="ml-auto" aria-label={`Add to ${col.title}`}>
                  <Icon icon={PlusSignIcon} />
                </Button>
              </header>
              {col.cards.map(({ a, ...card }) => (
                <KanbanCard key={card.id} {...card} assignee={a ? who(a) : undefined} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
