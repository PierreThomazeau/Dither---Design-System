import { KanbanCard } from "@/registry/dither/blocks/kanban-card";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";

export default function KanbanCardDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <KanbanCard
        id="ATL-142"
        tag="Design"
        priority="high"
        title="Checkout redesign: payment step"
        subtasks={{ done: 2, total: 5 }}
        comments={4}
        files={2}
        due="Nov 28"
        assignee={<Avatar size="xs"><AvatarFallback>LM</AvatarFallback></Avatar>}
      />
      <KanbanCard id="ATL-151" tag="Billing" priority="low" title="Export invoices as CSV" comments={0} due="Dec 3" />
    </div>
  );
}
