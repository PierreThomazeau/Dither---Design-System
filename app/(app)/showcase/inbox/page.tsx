import type { Metadata } from "next";
import { Archive02Icon, Clock01Icon, MoreHorizontalIcon, Search01Icon, StarIcon } from "@hugeicons/core-free-icons";

import { AppShell } from "@/components/showcase/app-shell";
import { northwind } from "@/components/showcase/nav";
import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { Timeline, TimelineItem } from "@/registry/dither/blocks/timeline";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { Input } from "@/registry/dither/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export const metadata: Metadata = { title: "Inbox · Showcase" };

const threads = [
  { initials: "LD", name: "Léa Dubois", subject: "Sprint 24 review: slides ready", preview: "I added the velocity chart and the risks slide…", time: "09:41", unread: true, tag: "Review" },
  { initials: "HL", name: "Hugo Lambert", subject: "API rate limits", preview: "Can we move the limit to 600 req/min for Teams?", time: "08:12", unread: true },
  { initials: "AR", name: "Antoine Roux", subject: "Q4 budget sign-off", preview: "Finance approved the hiring plan, two roles open.", time: "Yesterday" },
  { initials: "IM", name: "Inès Moreau", subject: "Referral test results", preview: "Variant B converts 14% better on mobile.", time: "Mon", tag: "Growth" },
  { initials: "MB", name: "Malik Benali", subject: "Mobile hiring", preview: "Shortlist of 4 candidates for the iOS role.", time: "Mon" },
];

export default function Inbox() {
  return (
    <AppShell {...northwind("Inbox")} breadcrumb={["Inbox"]}>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[340px_1fr_280px]">
        <section aria-label="Conversations" className="flex min-w-0 flex-col gap-3 border-b p-4 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Inbox</h1>
            <span className="font-mono text-xs text-muted-foreground tabular">2 unread</span>
          </div>
          <div className="relative">
            <Input size="sm" placeholder="Search messages" className="pl-9" aria-label="Search messages" />
            <Icon icon={Search01Icon} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Tabs defaultValue="all">
            <TabsList size="xs" className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              <TabsTrigger value="mentions" className="flex-1">Mentions</TabsTrigger>
            </TabsList>
          </Tabs>
          <ul className="flex flex-col gap-1">
            {threads.map((t, i) => (
              <li key={t.subject}>
                <a
                  href="#"
                  aria-current={i === 0 ? "true" : undefined}
                  className={cn(
                    "flex gap-3 rounded-field p-3 outline-none hover:bg-hover focus-visible:shadow-focus",
                    i === 0 && "bg-background-muted",
                  )}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate text-sm", t.unread ? "font-semibold" : "font-medium")}>{t.name}</span>
                      {t.unread ? <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-label="Unread" /> : null}
                      <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">{t.time}</span>
                    </span>
                    <span className="truncate text-sm">{t.subject}</span>
                    <span className="truncate text-xs text-muted-foreground">{t.preview}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-label="Conversation" className="flex min-w-0 flex-col">
          <header className="flex items-center gap-2 border-b px-5 py-3">
            <div className="flex min-w-0 flex-col">
              <h2 className="truncate text-base font-semibold">Sprint 24 review: slides ready</h2>
              <span className="text-xs text-muted-foreground">Léa Dubois, you · 3 messages</span>
            </div>
            <div className="ml-auto flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Star"><Icon icon={StarIcon} /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Snooze"><Icon icon={Clock01Icon} /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Archive"><Icon icon={Archive02Icon} /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="More"><Icon icon={MoreHorizontalIcon} /></Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-5">
            {[
              { who: "LD", name: "Léa Dubois", time: "Nov 24 · 09:41", body: "Hi Claire, the slides for Friday are ready. I added the velocity chart and a risks slide; the accessibility sign-off is still the main blocker for checkout." },
              { who: "CM", name: "Claire Martin", time: "Nov 24 · 10:02", body: "Great, thanks. Can you add the mobile capacity numbers? Malik shared them in the planning doc." },
              { who: "LD", name: "Léa Dubois", time: "Nov 24 · 10:15", body: "Done. Slide 7 now shows capacity by squad, with the mobile team at 125%." },
            ].map((m) => (
              <article key={m.time} className="flex gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{m.who}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{m.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{m.time}</span>
                  </p>
                  <p className="text-sm leading-6">{m.body}</p>
                </div>
              </article>
            ))}
            <div className="mt-auto">
              <ChatComposer showTools={false} showFooter={false} placeholder="Reply to Léa…" />
            </div>
          </div>
        </section>
        <aside aria-label="Details" className="hidden flex-col gap-5 border-l p-5 xl:flex">
          <div className="flex flex-col items-center gap-2 text-center">
            <Avatar size="xl">
              <AvatarFallback>LD</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">Léa Dubois</span>
            <span className="text-xs text-muted-foreground">Design system lead</span>
            <div className="flex gap-1.5">
              <Badge variant="outline">Design</Badge>
              <Badge variant="brand">Lead</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-medium text-muted-foreground">Related activity</h3>
            <Timeline>
              <TimelineItem status="success" title="Review slides shared" time="10:15" />
              <TimelineItem title="Commented on ATL-142" time="Yesterday" />
              <TimelineItem status="warning" title="Accessibility sign-off pending" time="Mon" />
            </Timeline>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
