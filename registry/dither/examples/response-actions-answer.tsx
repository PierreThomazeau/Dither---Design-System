"use client";

import { ResponseActions } from "@/registry/dither/blocks/response-actions";
import { Bubble, Message } from "@/registry/dither/blocks/message";

const answer = "Revenue grew 12% in November, driven by the Pro plan in EMEA. Churn stayed at 3.4%.";

export default function ResponseActionsAnswer() {
  return (
    <Message from="assistant" className="max-w-md">
      <Bubble variant="plain">{answer}</Bubble>
      <ResponseActions className="-ml-1.5" copyText={answer} onRegenerate={() => {}} onShare={() => {}} />
    </Message>
  );
}
