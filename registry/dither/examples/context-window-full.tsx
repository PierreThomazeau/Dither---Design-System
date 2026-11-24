import { ContextWindow } from "@/registry/dither/blocks/context-window";

export default function ContextWindowFull() {
  return (
    <ContextWindow
      title="Almost full"
      max={128000}
      segments={[
        { label: "System", tokens: 6000 },
        { label: "Files", tokens: 72000 },
        { label: "Conversation", tokens: 44000 },
      ]}
    />
  );
}
