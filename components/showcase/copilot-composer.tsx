"use client";

import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { Companion } from "@/registry/dither/blocks/companion";

import { useSimulatedAssistant } from "./assistant-panel";

/** Copilot screen composer: the companion stands on it and reacts to typing and (simulated) answers. */
export function CopilotComposer() {
  const { status, busy, send, stop, typing } = useSimulatedAssistant();
  return (
    <ChatComposer
      placeholder="Ask Copilot to refine, chart or share the report…"
      mode="Agent"
      busy={busy}
      onStop={stop}
      onSubmit={(v) => send(v)}
      onValueChange={typing}
      companion={<Companion status={status} size={88} />}
    />
  );
}
