import { ContextWindow } from "@/registry/dither/blocks/context-window";

export default function ContextWindowDemo() {
  return (
    <ContextWindow
      max={200000}
      segments={[
        { label: "System", tokens: 4000 },
        { label: "Files", tokens: 38000 },
        { label: "Conversation", tokens: 22000 },
      ]}
    />
  );
}
