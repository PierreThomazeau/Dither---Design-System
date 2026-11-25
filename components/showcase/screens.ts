/** The showcase screens, in display order. */
export const screens = [
  { slug: "team-overview", title: "Team overview", description: "KPIs, workload, lead performance, rituals and an AI recap.", workspace: "Northwind Studio" },
  { slug: "finance-overview", title: "Finance overview", description: "Cash forecast, spend breakdown, approvals and transactions.", workspace: "Lumen Finance" },
  { slug: "revenue-analytics", title: "Revenue analytics", description: "Streams, bridge, ranking, costs and conversion funnel.", workspace: "Lumen Finance" },
  { slug: "kanban-board", title: "Kanban board", description: "Sprint board with task cards, priorities and subtasks.", workspace: "Northwind Studio" },
  { slug: "copilot-chat", title: "Copilot chat", description: "Agent run with reasoning, steps, sources and the composer.", workspace: "Atlas Copilot" },
  { slug: "settings", title: "Settings", description: "Workspace form, preferences, notifications, plan and danger zone.", workspace: "Northwind Studio" },
  { slug: "invoices", title: "Invoices", description: "Table with filters, selection, pagination and bulk actions.", workspace: "Lumen Finance" },
  { slug: "inbox", title: "Inbox", description: "Three panes: conversations, thread and contact details.", workspace: "Northwind Studio" },
  { slug: "command-palette", title: "Command palette", description: "The ⌘K palette open over the dashboard.", workspace: "Northwind Studio" },
  { slug: "planning", title: "Planning", description: "Week calendar of rituals and time in meetings.", workspace: "Northwind Studio" },
  { slug: "live-analytics", title: "Live analytics", description: "Live visitors, health gauges, quotas, heatmap and event stream.", workspace: "Lumen Finance" },
  { slug: "onboarding", title: "Onboarding", description: "Setup wizard with box choices and a checklist.", workspace: "Northwind Studio" },
] as const;
