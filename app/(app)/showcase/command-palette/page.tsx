import type { Metadata } from "next";
import { Analytics02Icon, File01Icon, Invoice01Icon, Moon02Icon, PlusSignIcon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { northwind } from "@/components/showcase/nav";
import { PageHeader } from "@/components/showcase/page-header";
import { StatCard } from "@/registry/dither/blocks/stat-card";
import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/registry/dither/ui/command";
import { Kbd } from "@/registry/dither/ui/kbd";

export const metadata: Metadata = { title: "Command palette · Showcase" };

/** The palette rendered open over a dimmed dashboard (static, so it can be reviewed). */
export default function CommandPaletteScreen() {
  return (
    <AppShell {...northwind("Overview")} breadcrumb={["Overview"]}>
      <div className="relative flex flex-1 flex-col">
        <div inert className="pointer-events-none flex flex-col gap-5 p-5 select-none md:p-6">
          <PageHeader title="Team overview" actions={<Button>Plan sprint</Button>} />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Delivery velocity" value="42 pts" delta="+8%" trend="up" sparkline={[30, 32, 31, 35, 34, 38, 37, 42]} />
            <StatCard label="Capacity used" value="86%" delta="+3 pts" sparkline={[80, 82, 81, 84, 83, 85, 84, 86]} />
            <StatCard label="Open blockers" value="7" delta="+3" trend="down" sparkline={[3, 4, 4, 5, 4, 6, 6, 7]} />
            <StatCard label="Team health" value="8.2/10" delta="+0.4" trend="up" sparkline={[7.4, 7.5, 7.7, 7.6, 7.9, 8, 8.1, 8.2]} />
          </div>
          <div className="h-72 rounded-surface border bg-surface" />
        </div>
        <div className="absolute inset-0 flex items-start justify-center rounded-b-body bg-woodsmoke-950/40 px-4 pt-[12vh] backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-body border bg-surface shadow-xl">
            <Command className="rounded-none border-0 shadow-none">
              <CommandInput placeholder="Search or jump to…" />
              <CommandList className="max-h-96">
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem><Icon icon={PlusSignIcon} />New initiative<CommandShortcut>⌘N</CommandShortcut></CommandItem>
                  <CommandItem><Icon icon={File01Icon} />New report<CommandShortcut>⌘R</CommandShortcut></CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Pages">
                  <CommandItem><Icon icon={Analytics02Icon} />Revenue analytics</CommandItem>
                  <CommandItem><Icon icon={Invoice01Icon} />Invoices</CommandItem>
                  <CommandItem><Icon icon={UserGroupIcon} />Teams</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem><Icon icon={Moon02Icon} />Toggle dark mode<CommandShortcut>⌘D</CommandShortcut></CommandItem>
                  <CommandItem><Icon icon={Settings02Icon} />Workspace settings<CommandShortcut>⌘,</CommandShortcut></CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="flex h-control items-center gap-3 border-t bg-background-muted px-4 font-mono text-xs text-muted-foreground">
              <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span>
              <span><Kbd>↵</Kbd> open</span>
              <span className="ml-auto"><Kbd>Esc</Kbd> close</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
