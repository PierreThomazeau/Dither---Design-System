import { AgentStep, AgentSteps } from "@/registry/dither/blocks/agent-step";
import { Bubble, Message } from "@/registry/dither/blocks/message";
import { ReasoningBlock } from "@/registry/dither/blocks/reasoning-block";
import { SourceCard } from "@/registry/dither/blocks/source-card";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";

function Copilot() {
  return (
    <Avatar size="xs">
      <AvatarFallback className="bg-foreground text-primary-foreground">AI</AvatarFallback>
    </Avatar>
  );
}

export default function MessageDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message from="user" meta="Léa · 14:02">
        <Bubble>Which accounts are most likely to churn this month?</Bubble>
      </Message>
      <Message from="assistant" avatar={<Copilot />} meta="Copilot · 14:02">
        <ReasoningBlock label="Thought for 8 seconds">Ranked Starter accounts by days since last login, then by failed payments.</ReasoningBlock>
        <AgentSteps>
          <AgentStep status="done" title="Read accounts" detail="accounts.csv" />
        </AgentSteps>
        <Bubble>
          38 accounts are at risk. Most are on the Starter plan with no login in 14 days.
        </Bubble>
        <SourceCard index={1} title="Accounts export" meta="Nov 24 · 1,204 rows" />
      </Message>
    </div>
  );
}
