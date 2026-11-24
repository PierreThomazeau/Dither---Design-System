import { AgentStep, AgentSteps } from "@/registry/dither/blocks/agent-step";

export default function AgentStepDemo() {
  return (
    <AgentSteps className="w-full max-w-sm">
      <AgentStep status="done" title="Read invoices" detail="invoices_2026.csv" />
      <AgentStep status="done" title="Searched the web" detail="“SaaS churn benchmark 2026”" />
      <AgentStep status="running" title="Building report" detail="revenue_by_team" />
      <AgentStep status="queued" title="Share with Finance" />
    </AgentSteps>
  );
}
