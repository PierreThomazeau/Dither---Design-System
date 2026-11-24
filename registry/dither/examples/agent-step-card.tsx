import { AgentStep, AgentSteps } from "@/registry/dither/blocks/agent-step";
import { AiGlow } from "@/registry/dither/lib/ai-glow";

export default function AgentStepCard() {
  return (
    <div className="w-full max-w-sm rounded-surface bg-background-muted p-1">
      <div className="relative isolate flex h-9 items-center overflow-hidden rounded-t-[calc(var(--radius-surface)-4px)] px-3 text-sm font-medium">
        <AiGlow />
        Agent run · <span className="ml-1 font-mono text-xs text-muted-foreground tabular">2 of 4</span>
      </div>
      <div className="rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-4 shadow-xs">
        <AgentSteps>
          <AgentStep status="done" title="Fetched usage" detail="api_calls" />
          <AgentStep status="done" title="Compared plans" />
          <AgentStep status="running" title="Drafting summary" />
          <AgentStep status="queued" title="Email the team" />
        </AgentSteps>
      </div>
    </div>
  );
}
