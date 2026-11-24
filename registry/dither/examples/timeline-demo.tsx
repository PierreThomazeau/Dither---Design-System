import { Timeline, TimelineItem } from "@/registry/dither/blocks/timeline";

export default function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-sm">
      <TimelineItem title="Report created" description="Léa duplicated “Q4 forecast” into a new draft." time="09:12" />
      <TimelineItem status="success" title="Invoice paid" description="INV-2048 from Lumen Finance." time="10:40" />
      <TimelineItem status="warning" title="Usage at 90%" description="API calls on the Pro plan." time="13:05" />
      <TimelineItem status="error" title="Sync failed" description="The Atlas connector timed out." time="16:22" />
    </Timeline>
  );
}
