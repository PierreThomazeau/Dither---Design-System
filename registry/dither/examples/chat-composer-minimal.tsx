"use client";

import { useState } from "react";

import { ChatComposer } from "@/registry/dither/blocks/chat-composer";

export default function ChatComposerMinimal() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <ChatComposer showTools={false} showFooter={false} placeholder="Reply to Léa…" onSubmit={setLast} />
      <p className="px-1 font-mono text-xs text-muted-foreground">{last ? `Sent: ${last}` : "Press Enter to send, Shift + Enter for a new line."}</p>
    </div>
  );
}
