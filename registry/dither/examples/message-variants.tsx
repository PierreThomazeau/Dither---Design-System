import { Bubble, Message } from "@/registry/dither/blocks/message";

export default function MessageVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Message from="assistant"><Bubble variant="plain">A plain answer, without a bubble, reads like a document.</Bubble></Message>
      <Message from="assistant"><Bubble variant="outline">An outlined bubble.</Bubble></Message>
      <Message from="assistant"><Bubble variant="error">The Atlas connector timed out. Try again in a minute.</Bubble></Message>
      <Message from="user"><Bubble variant="muted">A muted user bubble.</Bubble></Message>
    </div>
  );
}
