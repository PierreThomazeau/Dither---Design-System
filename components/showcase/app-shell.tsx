"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft01Icon, Moon02Icon, Notification02Icon, SidebarLeft01Icon, SidebarRight01Icon, SparklesIcon, Sun03Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { LogoMark } from "@/components/site/logo";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Button } from "@/registry/dither/ui/button";
import { SidePanel, SidePanelInset, SidePanelLayout, SidePanelProvider, SidePanelTrigger, useSidePanel } from "@/registry/dither/ui/side-panel";

import { AssistantPanel } from "./assistant-panel";

export interface NavItem {
  label: string;
  icon?: IconSvgElement;
  active?: boolean;
  /** Small mono count on the right. */
  count?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface AppShellProps {
  workspace: string;
  /** Quick actions above the navigation. */
  actions?: NavItem[];
  sections: NavSection[];
  user: { name: string; role: string; initials: string };
  /** Breadcrumb in the top bar. */
  breadcrumb: string[];
  children: React.ReactNode;
  /** Extra content on the right of the top bar. */
  topbarRight?: React.ReactNode;
  /** Right-hand Side Panel content (SidePanelHeader / Content / Footer). Pushes the page when open. */
  panel?: React.ReactNode;
  /** Accessible name of the panel. */
  panelLabel?: string;
  panelDefaultOpen?: boolean;
}

function NavLink({ item }: { item: NavItem }) {
  return (
    <a
      href="#"
      aria-current={item.active ? "page" : undefined}
      className={cn(
        "flex h-control-xs items-center gap-2.5 rounded-control px-2.5 text-sm text-muted-foreground outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus",
        item.active && "bg-surface font-medium text-foreground shadow-xs dark:bg-background-muted",
      )}
    >
      {item.icon ? <Icon icon={item.icon} /> : <span className="size-4" />}
      <span className="flex-1 truncate">{item.label}</span>
      {item.count !== undefined ? <span className="font-mono text-xs tabular">{item.count}</span> : null}
    </a>
  );
}

const noop = () => () => {};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known in the browser: render a neutral state on the server to avoid a hydration mismatch.
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <Button variant="outline" size="icon-sm" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme(dark ? "light" : "dark")}>
      <Icon icon={dark ? Sun03Icon : Moon02Icon} />
    </Button>
  );
}

/**
 * One Side Panel, two views: the screen's own panel ("default") and the AI assistant. The assistant is
 * mounted on first open and kept, so the conversation survives closing the panel.
 */
function ShellPanel({ panel, panelLabel }: { panel?: React.ReactNode; panelLabel: string }) {
  const { open, view } = useSidePanel();
  const assistant = view === "assistant" || !panel;
  const [assistantMounted, setAssistantMounted] = React.useState(false);
  if (open && assistant && !assistantMounted) setAssistantMounted(true);
  return (
    <SidePanel label={assistant ? "AI assistant" : panelLabel} width={assistant ? 400 : 380}>
      {assistantMounted ? (
        <div className={cn("flex min-h-0 flex-1 flex-col", !assistant && "hidden")}>
          <AssistantPanel />
        </div>
      ) : null}
      {panel && !assistant ? panel : null}
    </SidePanel>
  );
}

/**
 * Showcase app shell: sidebar and body on the same background (white cards sit on it), a top bar of
 * floating pills (round sidebar toggle, breadcrumb chip, actions). The top bar stays put and only the
 * content below scrolls; PageHeader sticks to the top of that scroll area.
 */
export function AppShell({ workspace, actions = [], sections, user, breadcrumb, children, topbarRight, panel, panelLabel = "Details", panelDefaultOpen = false }: AppShellProps) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-5 overflow-y-auto px-3 py-4 lg:flex",
          !open && "lg:hidden",
        )}
      >
        <button type="button" className="flex h-control items-center gap-2.5 rounded-control px-1.5 text-left outline-none hover:bg-hover focus-visible:shadow-focus">
          <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-primary-foreground">
            <LogoMark className="size-3.5" />
          </span>
          <span className="flex-1 truncate text-sm font-semibold">{workspace}</span>
          <Icon icon={UnfoldMoreIcon} className="text-muted-foreground" />
        </button>
        {actions.length ? (
          <nav className="flex flex-col gap-0.5" aria-label="Quick actions">
            {actions.map((a) => (
              <NavLink key={a.label} item={a} />
            ))}
          </nav>
        ) : null}
        {sections.map((s, i) => (
          <nav key={i} className="flex flex-col gap-0.5" aria-label={s.title ?? "Main"}>
            {s.title ? <span className="px-2.5 pb-1 text-xs text-muted-foreground">{s.title}</span> : null}
            {s.items.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </nav>
        ))}
        <div className="mt-auto flex items-center gap-2.5 px-1.5">
          <Avatar size="sm">
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.role}</span>
          </span>
          <Button variant="ghost" size="icon-xs" aria-label="Notifications">
            <Icon icon={Notification02Icon} />
          </Button>
        </div>
      </aside>
      <SidePanelProvider defaultOpen={panelDefaultOpen} defaultView={panel ? "default" : "assistant"}>
      <SidePanelLayout>
        <SidePanelInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6">
            <Button variant="outline" size="icon-sm" aria-label={open ? "Hide sidebar" : "Show sidebar"} aria-pressed={!open} className="hidden lg:inline-flex" onClick={() => setOpen((o) => !o)}>
              <Icon icon={SidebarLeft01Icon} />
            </Button>
            <Button asChild variant="outline" size="icon-sm" className="lg:hidden" aria-label="Back to showcase">
              <Link href="/showcase">
                <Icon icon={ArrowLeft01Icon} />
              </Link>
            </Button>
            <nav aria-label="Breadcrumb" className="flex h-control-sm min-w-0 items-center gap-2 rounded-control border bg-surface px-4 text-sm">
              {breadcrumb.map((b, i) => (
                <React.Fragment key={b}>
                  {i > 0 ? <span className="text-muted-foreground">/</span> : null}
                  <span className={cn("truncate", i < breadcrumb.length - 1 ? "text-muted-foreground" : "font-medium")}>{b}</span>
                </React.Fragment>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1.5">
              {topbarRight}
              <ThemeToggle />
              {panel ? (
                <SidePanelTrigger asChild view="default">
                  <Button variant="outline" size="icon-sm" aria-label={`Toggle ${panelLabel.toLowerCase()} panel`}>
                    <Icon icon={SidebarRight01Icon} />
                  </Button>
                </SidePanelTrigger>
              ) : null}
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href="/showcase">All screens</Link>
              </Button>
              <SidePanelTrigger asChild view="assistant">
                <Button variant="outline" size="sm" aria-label="AI assistant" className="aria-expanded:bg-hover">
                  <Icon icon={SparklesIcon} />
                  <span className="hidden sm:inline">AI assistant</span>
                </Button>
              </SidePanelTrigger>
            </div>
          </header>
          <main className="@container flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">{children}</main>
        </SidePanelInset>
        <ShellPanel panel={panel} panelLabel={panelLabel} />
      </SidePanelLayout>
      </SidePanelProvider>
    </div>
  );
}
