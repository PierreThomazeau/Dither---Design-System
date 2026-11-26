"use client";

import * as React from "react";

import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { CompanionAnchor, CompanionLayer, type CompanionStatus } from "@/registry/dither/blocks/companion";
import { Bubble, Message } from "@/registry/dither/blocks/message";

/* One companion: in the middle while the chat is empty, then on top of the answer being written.
   Simulated answers; type "deep" for a long wait. */
export default function CompanionChat() {
  const [status, setStatus] = React.useState<CompanionStatus>("idle");
  const [turns, setTurns] = React.useState<{ q: string; a: string }[]>([]);
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const send = (q: string) => {
    const think = /deep/i.test(q) ? 12000 : 1800;
    setTurns((t) => [...t, { q, a: "" }]);
    setStatus("thinking");
    timers.current.push(
      window.setTimeout(() => {
        setStatus("responding");
        setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, a: "Revenue is up 12% this quarter, led by the Pro plan." } : x)));
      }, think),
      window.setTimeout(() => setStatus("done"), think + 2400),
    );
  };

  return (
    <div className="flex h-[420px] w-full max-w-xl flex-col gap-3">
      <CompanionLayer companion={{ status }} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {turns.length === 0 ? (
          <div className="m-auto flex flex-col items-center gap-3">
            <CompanionAnchor size={120} />
            <p className="text-sm text-muted-foreground">How can I help?</p>
          </div>
        ) : (
          turns.map((t, i) => (
            <React.Fragment key={i}>
              <Message from="user">
                <Bubble>{t.q}</Bubble>
              </Message>
              <Message from="assistant">
                {i === turns.length - 1 ? <CompanionAnchor size={64} className="-mb-1" /> : null}
                {t.a ? <Bubble>{t.a}</Bubble> : <p className="px-1 text-sm text-muted-foreground">Thinking…</p>}
              </Message>
            </React.Fragment>
          ))
        )}
      </CompanionLayer>
      <ChatComposer
        showTools={false}
        busy={status === "thinking" || status === "responding"}
        onStop={() => (timers.current.forEach((t) => window.clearTimeout(t)), setStatus("idle"))}
        onSubmit={send}
        onValueChange={(v) => setStatus((s) => (s === "thinking" || s === "responding" ? s : v ? "listening" : "idle"))}
      />
    </div>
  );
}
