"use client";

import * as React from "react";
import { Alert02Icon, ChartLineData02Icon, FlashIcon, SparklesIcon } from "@hugeicons/core-free-icons";

import { ChatComposer } from "@/registry/dither/blocks/chat-composer";
import { CompanionAnchor, CompanionLayer, type CompanionPhase, type CompanionStatus } from "@/registry/dither/blocks/companion";
import { Bubble, Message } from "@/registry/dither/blocks/message";
import { StarterPrompt } from "@/registry/dither/blocks/starter-prompt";
import { Icon } from "@/registry/dither/lib/icon";
import { SidePanelContent, SidePanelHeader } from "@/registry/dither/ui/side-panel";

/* ------------------------------------------------------------------ *
 * Simulated assistant for the showcase: no network, canned answers.
 * The prompt picks the scenario: "deep / analysis" = slow (the
 * companion gets bored, then lazy, chrome red), "live / error" =
 * error, anything else = a quick answer.
 * ------------------------------------------------------------------ */

type ChatMessage = {
  id: number;
  from: "user" | "assistant";
  text: string;
  state?: "thinking" | "streaming" | "done" | "error" | "stopped";
  meta?: string;
};

type Scenario = "fast" | "slow" | "error";

const REPLIES: Record<Exclude<Scenario, "error">, string> = {
  fast: "This page tracks delivery across six squads. Velocity is up 8% on last sprint, the review backlog is at 14 items and the Mobile squad is over capacity. Want me to turn the risks into tasks?",
  slow: "Done. I compared the last six sprints: Growth and Design system carry most of the gain, Mobile has been above 110% capacity for three sprints, and review time doubled since accessibility sign-off moved to one person. I'd rebalance two Mobile tasks and add a second reviewer.",
};

function pickScenario(text: string): Scenario {
  const t = text.toLowerCase();
  if (/(live|error|fail|break)/.test(t)) return "error";
  if (/(deep|analy|compare|sprints)/.test(t)) return "slow";
  return "fast";
}

export function useSimulatedAssistant() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [status, setStatus] = React.useState<CompanionStatus>("idle");
  const timers = React.useRef<number[]>([]);
  const nextId = React.useRef(1);

  const clear = React.useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  }, []);
  React.useEffect(() => clear, [clear]);

  const patch = (id: number, p: Partial<ChatMessage>) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...p } : m)));

  const send = (text: string) => {
    clear();
    const scenario = pickScenario(text);
    const userId = nextId.current++;
    const id = nextId.current++;
    setMessages((ms) => [...ms, { id: userId, from: "user", text }, { id, from: "assistant", text: "", state: "thinking" }]);
    setStatus("thinking");
    const started = performance.now();
    const think = scenario === "slow" ? 13000 : scenario === "error" ? 2800 : 1600;
    timers.current.push(
      window.setTimeout(() => {
        if (scenario === "error") {
          patch(id, { state: "error", text: "I couldn't reach the live data source. Try again in a moment." });
          setStatus("error");
          return;
        }
        setStatus("responding");
        const reply = REPLIES[scenario];
        let i = 0;
        const iv = window.setInterval(() => {
          i = Math.min(reply.length, i + 3);
          patch(id, { state: "streaming", text: reply.slice(0, i) });
          if (i >= reply.length) {
            window.clearInterval(iv);
            const secs = Math.round((performance.now() - started) / 1000);
            patch(id, { state: "done", meta: `Atlas 2 · ${secs} s` });
            setStatus("done");
          }
        }, 28);
        timers.current.push(iv);
      }, think),
    );
  };

  const stop = () => {
    clear();
    setMessages((ms) => ms.map((m) => (m.state === "thinking" || m.state === "streaming" ? { ...m, state: "stopped", text: m.text || "Stopped." } : m)));
    setStatus("idle");
  };

  /** Typing puts the companion in "listening" (unless it is busy). */
  const typing = (value: string) =>
    setStatus((s) => (s === "thinking" || s === "responding" ? s : value.trim() ? "listening" : "idle"));

  const busy = status === "thinking" || status === "responding";
  return { messages, status, busy, send, stop, typing };
}

const THINKING_TEXT: Partial<Record<CompanionPhase, string>> = {
  thinking: "Thinking…",
  slow: "Still thinking, this one takes a while…",
  stalled: "Taking longer than usual…",
};

/**
 * The "AI assistant" view of the showcase Side Panel. One companion: big in the middle of the empty chat,
 * then standing on top of the message being written; it glides from one to the next.
 */
export function AssistantPanel() {
  const { messages, status, busy, send, stop, typing } = useSimulatedAssistant();
  const [phase, setPhase] = React.useState<CompanionPhase>("idle");
  const end = React.useRef<HTMLDivElement>(null);
  const lastAssistant = messages.findLast((m) => m.from === "assistant")?.id;

  React.useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <>
      <SidePanelHeader title="AI assistant" description="Atlas 2 · knows this page" />
      <SidePanelContent className="pb-3">
        <CompanionLayer companion={{ status, onPhaseChange: setPhase }} className="flex min-h-full flex-1 flex-col gap-4">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center gap-5 py-6">
              <CompanionAnchor size={128} />
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-lg font-semibold tracking-tight">How can I help?</h3>
                <p className="text-sm text-muted-foreground">Ask about this page, or try one of these.</p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <StarterPrompt icon={<Icon icon={FlashIcon} />} title="Summarize this page" description="Quick answer" onClick={() => send("Summarize this page")} />
                <StarterPrompt
                  icon={<Icon icon={ChartLineData02Icon} />}
                  title="Run a deep analysis"
                  description="Takes a while: watch it turn red"
                  onClick={() => send("Run a deep analysis of the last sprints")}
                />
                <StarterPrompt icon={<Icon icon={Alert02Icon} />} title="Pull live data" description="Fails on purpose" onClick={() => send("Pull live data")} />
              </div>
            </div>
          ) : (
            messages.map((m) =>
              m.from === "user" ? (
                <Message key={m.id} from="user">
                  <Bubble>{m.text}</Bubble>
                </Message>
              ) : (
                <Message key={m.id} from="assistant" meta={m.id === lastAssistant ? undefined : m.meta} className="[&>div]:max-w-full">
                  {m.id === lastAssistant ? <CompanionAnchor size={68} className="-mb-1" /> : null}
                  {m.state === "thinking" ? (
                    <p className="flex items-center gap-1.5 px-1 text-sm text-muted-foreground" aria-live="polite">
                      <Icon icon={SparklesIcon} size={14} />
                      {THINKING_TEXT[phase] ?? "Thinking…"}
                    </p>
                  ) : (
                    <Bubble variant={m.state === "error" ? "error" : undefined}>{m.text}</Bubble>
                  )}
                  {m.id === lastAssistant && m.meta ? <span className="px-1 font-mono text-xs text-muted-foreground tabular">{m.meta}</span> : null}
                </Message>
              ),
            )
          )}
          <div ref={end} />
        </CompanionLayer>
      </SidePanelContent>
      <div className="p-2 pt-0">
        <ChatComposer placeholder="Ask the assistant…" showTools={false} busy={busy} onStop={stop} onSubmit={(v) => send(v)} onValueChange={typing} />
      </div>
    </>
  );
}
