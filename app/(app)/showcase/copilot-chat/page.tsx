import type { Metadata } from "next";
import { File02Icon, SparklesIcon } from "@hugeicons/core-free-icons";

import { DitherFill } from "@/registry/dither/lib/dither";
import { AppShell } from "@/components/showcase/app-shell";
import { atlas } from "@/components/showcase/nav";
import { AgentStep, AgentSteps } from "@/registry/dither/blocks/agent-step";
import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { ContextWindow } from "@/registry/dither/blocks/context-window";
import { Bubble, Message } from "@/registry/dither/blocks/message";
import { ReasoningBlock } from "@/registry/dither/blocks/reasoning-block";
import { ResponseActions } from "@/registry/dither/blocks/response-actions";
import { SourceCard } from "@/registry/dither/blocks/source-card";
import { AiGlow } from "@/registry/dither/lib/ai-glow";
import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Button } from "@/registry/dither/ui/button";

export const metadata: Metadata = { title: "Copilot chat · Showcase" };

function InsetPanel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1 rounded-surface bg-background-muted p-1">
      <div className="flex flex-col gap-0.5 px-3 pt-2 pb-1.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-3 shadow-xs">{children}</div>
    </section>
  );
}

export default function CopilotChat() {
  return (
    <AppShell {...atlas("Q4 delivery report")} breadcrumb={["Q4 delivery report"]}>
      <div className="grid flex-1 gap-5 p-5 md:p-6 xl:grid-cols-[1fr_320px]">
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Today
            <span className="h-px flex-1 bg-border" />
          </div>
          <Message from="user" meta="You · 9:41" avatar={<Avatar size="xs"><AvatarFallback>LD</AvatarFallback></Avatar>}>
            <Bubble>Build the Q4 delivery report: velocity by squad, the review backlog and the top 3 risks. Use the Checkout board and last week’s critique notes.</Bubble>
            <SourceCard icon={<Icon icon={File02Icon} />} title="critique-notes-w46.pdf" meta="PDF · 2.4 MB" />
          </Message>
          <Message from="assistant" meta="Copilot · 9:41" avatar={<Avatar size="xs"><AvatarFallback className="bg-foreground text-primary-foreground">AI</AvatarFallback></Avatar>}>
            <ReasoningBlock label="Thought for 9 seconds">Pulled open tasks from the Checkout board, grouped review items by squad, then ranked risks by blocked specs and capacity.</ReasoningBlock>
            <div className="w-full rounded-field border bg-surface p-3 shadow-xs">
              <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon icon={SparklesIcon} size={12} />
                Worked for 38 s · 4 tools
              </p>
              <AgentSteps>
                <AgentStep status="done" title="Read board" detail="Checkout redesign · 12 open tasks" />
                <AgentStep status="done" title="Parsed critique notes" detail="14 comments · 3 blockers" />
                <AgentStep status="done" title="Computed velocity" detail="6 squads · last 6 sprints" />
                <AgentStep status="running" title="Drafting report" detail="q4-delivery-report.docx" />
              </AgentSteps>
            </div>
            <Bubble>Here’s the Q4 snapshot. Velocity is up 8% overall, driven by Growth and Design system. The review backlog grew to 14 items, mostly checkout specs waiting on accessibility sign-off.</Bubble>
            <Bubble>Top risks: 1. Accessibility sign-off is a bottleneck (5 specs blocked). 2. Mobile squad at 125% capacity. 3. Payment error states not yet tested with users.</Bubble>
            <SourceCard icon={<Icon icon={File02Icon} />} title="q4-delivery-report.docx" meta="Draft · 6 pages · updated just now" />
            <div className="flex flex-wrap items-center gap-2">
              <ResponseActions className="-ml-1.5" />
              <span className="font-mono text-xs text-muted-foreground">Atlas 2 · 38 s · 4 tools · 12.4k tokens</span>
            </div>
          </Message>
          <div className="sticky bottom-3 mt-auto flex flex-col gap-2">
            <ChatComposer placeholder="Ask Copilot to refine, chart or share the report…" mode="Agent" />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Turn risks into tasks</Button>
              <Button variant="outline" size="sm">Add a velocity chart</Button>
              <Button variant="outline" size="sm">Share with the team</Button>
            </div>
          </div>
        </div>
        <aside className="flex flex-col gap-3">
          <InsetPanel title="Plan" subtitle="4 of 5 steps done">
            <span className="relative h-1.5 overflow-hidden rounded-full">
              <DitherFill variant="organic" />
              <span className="absolute inset-y-0 left-0 w-4/5 rounded-full bg-foreground" />
            </span>
            <AgentSteps>
              <AgentStep status="done" title="Read board" detail="12 tasks" />
              <AgentStep status="done" title="Parse notes" detail="14 comments" />
              <AgentStep status="done" title="Compute velocity" detail="6 squads" />
              <AgentStep status="running" title="Draft report" detail="6 pages" />
              <AgentStep status="queued" title="Share to #delivery" detail="Needs approval" />
            </AgentSteps>
          </InsetPanel>
          <InsetPanel title="Sources" subtitle="3 sources used in this answer">
            <SourceCard index={1} title="Checkout redesign" meta="Board · synced 2 min ago" className="max-w-none" />
            <SourceCard index={2} icon={<Icon icon={File02Icon} />} title="critique-notes-w46.pdf" meta="Uploaded by you" className="max-w-none" />
            <SourceCard index={3} title="Checkout flows" meta="Design file · 24 frames" className="max-w-none" />
          </InsetPanel>
          <section className="relative isolate flex flex-col gap-3 overflow-hidden rounded-surface border bg-surface p-4 shadow-xs">
            <AiGlow direction="to-b" className="bottom-1/2" />
            <span className="flex size-8 items-center justify-center rounded-control border bg-surface">
              <Icon icon={SparklesIcon} />
            </span>
            <h2 className="text-base font-semibold tracking-tight">Make it a weekly report</h2>
            <p className="text-sm text-muted-foreground">Turn this run into a scheduled agent that posts every Monday at 9:00.</p>
            <div className="flex gap-2">
              <Button size="sm">Schedule</Button>
              <Button size="sm" variant="ghost">Not now</Button>
            </div>
          </section>
          <ContextWindow
            className="max-w-none"
            max={200000}
            segments={[
              { label: "System", tokens: 4000 },
              { label: "Files", tokens: 38000 },
              { label: "Conversation", tokens: 22000 },
            ]}
          />
        </aside>
      </div>
    </AppShell>
  );
}
