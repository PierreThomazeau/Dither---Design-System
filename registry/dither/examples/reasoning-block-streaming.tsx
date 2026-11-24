import { ReasoningBlock } from "@/registry/dither/blocks/reasoning-block";

export default function ReasoningBlockStreaming() {
  return (
    <ReasoningBlock label="Thinking…" streaming defaultOpen className="w-full max-w-md">
      Comparing November revenue by team with the same month last year…
    </ReasoningBlock>
  );
}
