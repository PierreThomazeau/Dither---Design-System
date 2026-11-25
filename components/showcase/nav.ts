import {
  Analytics01Icon,
  Calendar01Icon,
  ChartHistogramIcon,
  DashboardSquare01Icon,
  Folder02Icon,
  Home01Icon,
  Invoice03Icon,
  KanbanIcon,
  Mail01Icon,
  Message01Icon,
  Note01Icon,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  SparklesIcon,
  Target02Icon,
  UserMultiple02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

import type { AppShellProps, NavItem } from "@/components/showcase/app-shell";

type Shell = Omit<AppShellProps, "children" | "breadcrumb">;

const mark = (items: NavItem[], active: string) => items.map((i) => ({ ...i, active: i.label === active }));

/** Northwind Studio: product & delivery team. */
export function northwind(active: string): Shell {
  return {
    workspace: "Northwind Studio",
    actions: [
      { label: "New initiative", icon: PlusSignIcon },
      { label: "Ask Copilot", icon: SparklesIcon },
    ],
    sections: [
      {
        items: mark(
          [
            { label: "Overview", icon: DashboardSquare01Icon },
            { label: "Board", icon: KanbanIcon },
            { label: "Planning", icon: Calendar01Icon },
            { label: "Inbox", icon: Mail01Icon, count: 4 },
            { label: "Reports", icon: Analytics01Icon },
            { label: "Settings", icon: Settings01Icon },
          ],
          active,
        ),
      },
      {
        title: "Squads",
        items: [
          { label: "Growth", icon: Target02Icon },
          { label: "Core platform", icon: Target02Icon },
          { label: "Design system", icon: Target02Icon },
        ],
      },
      {
        title: "Recents",
        items: [
          { label: "Q4 capacity plan", icon: Note01Icon },
          { label: "Sprint 24 retro", icon: Note01Icon },
        ],
      },
    ],
    user: { name: "Claire Martin", role: "Head of Delivery", initials: "CM" },
  };
}

/** Lumen Finance: finance team. */
export function lumen(active: string): Shell {
  return {
    workspace: "Lumen Finance",
    actions: [
      { label: "New expense", icon: PlusSignIcon },
      { label: "Ask Copilot", icon: SparklesIcon },
    ],
    sections: [
      {
        items: mark(
          [
            { label: "Overview", icon: DashboardSquare01Icon },
            { label: "Revenue", icon: ChartHistogramIcon },
            { label: "Cash flow", icon: Wallet01Icon },
            { label: "Invoices", icon: Invoice03Icon, count: 31 },
            { label: "Live", icon: Analytics01Icon },
          ],
          active,
        ),
      },
      {
        title: "Saved views",
        items: [
          { label: "Overdue > 30 days", icon: Folder02Icon },
          { label: "Enterprise customers", icon: UserMultiple02Icon },
        ],
      },
    ],
    user: { name: "Antoine Roux", role: "Chief Financial Officer", initials: "AR" },
  };
}

/** Atlas Copilot: AI workspace. */
export function atlas(active: string): Shell {
  return {
    workspace: "Atlas Copilot",
    actions: [
      { label: "New chat", icon: PlusSignIcon },
      { label: "Search chats", icon: Search01Icon },
    ],
    sections: [
      {
        items: mark(
          [
            { label: "Home", icon: Home01Icon },
            { label: "Agents", icon: SparklesIcon },
            { label: "Library", icon: Folder02Icon },
          ],
          active,
        ),
      },
      {
        title: "Today",
        items: mark(
          [
            { label: "Q4 delivery report", icon: Message01Icon },
            { label: "Checkout research synthesis", icon: Message01Icon },
            { label: "Draft hiring brief", icon: Message01Icon },
          ],
          active,
        ),
      },
    ],
    user: { name: "Léa Dubois", role: "Pro plan", initials: "LD" },
  };
}
