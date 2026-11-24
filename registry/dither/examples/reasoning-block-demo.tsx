import { ReasoningBlock } from "@/registry/dither/blocks/reasoning-block";

const thought =
  "The user wants churn under 3%. Current churn is 3.4%, so I need to find about 40 at-risk accounts. Starter plan accounts with no login in 14 days are the strongest signal, then failed payments. I will rank both lists and check the total.";

export default function ReasoningBlockDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ReasoningBlock label="Thought for 12 seconds">{thought}</ReasoningBlock>
      <ReasoningBlock label="Thought for 12 seconds" defaultOpen>{thought}</ReasoningBlock>
    </div>
  );
}
