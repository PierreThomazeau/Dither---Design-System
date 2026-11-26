"use client";

import * as React from "react";

import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { Companion, type CompanionStatus } from "@/registry/dither/blocks/companion";

/* Simulated answer: thinks, talks, then the one-shot multicolour sweep. Type "deep" for a long wait. */
export default function CompanionComposer() {
  const [status, setStatus] = React.useState<CompanionStatus>("idle");
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const send = (message: string) => {
    const think = /deep/i.test(message) ? 12000 : 1800;
    setStatus("thinking");
    timers.current.push(
      window.setTimeout(() => setStatus("responding"), think),
      window.setTimeout(() => setStatus("done"), think + 2600),
    );
  };

  return (
    <ChatComposer
      className="max-w-xl"
      showTools={false}
      busy={status === "thinking" || status === "responding"}
      onStop={() => (timers.current.forEach((t) => window.clearTimeout(t)), setStatus("idle"))}
      onSubmit={send}
      onValueChange={(v) => setStatus((s) => (s === "thinking" || s === "responding" ? s : v ? "listening" : "idle"))}
      companion={<Companion status={status} />}
    />
  );
}
