"use client";

import * as React from "react";

import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { CompanionLayer } from "@/registry/dither/blocks/companion";

import { useSimulatedAssistant } from "./assistant-panel";

type Assistant = ReturnType<typeof useSimulatedAssistant>;
const CopilotContext = React.createContext<Assistant | null>(null);

/** Copilot conversation column: one companion (placed by <CompanionAnchor />), driven by the composer below. */
export function CopilotChat({ className, children }: { className?: string; children: React.ReactNode }) {
  const assistant = useSimulatedAssistant();
  return (
    <CopilotContext.Provider value={assistant}>
      <CompanionLayer companion={{ status: assistant.status }} className={className}>
        {children}
      </CompanionLayer>
    </CopilotContext.Provider>
  );
}

export function CopilotComposer() {
  const a = React.useContext(CopilotContext);
  return (
    <ChatComposer
      placeholder="Ask Copilot to refine, chart or share the report…"
      mode="Agent"
      busy={a?.busy}
      onStop={a?.stop}
      onSubmit={(v) => a?.send(v)}
      onValueChange={a?.typing}
    />
  );
}
