import { WorkloadTile } from "@/registry/dither/blocks/workload-tile";
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/dither/ui/avatar";

function People({ initials }: { initials: string[] }) {
  return (
    <AvatarGroup>
      {initials.map((i) => (
        <Avatar key={i} size="xs"><AvatarFallback>{i}</AvatarFallback></Avatar>
      ))}
    </AvatarGroup>
  );
}

export default function WorkloadTileDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <WorkloadTile count={7} status="backlog" due="12 items unplanned" assignees={<People initials={["AL"]} />} />
      <WorkloadTile count={4} status="not-started" due="Due Nov 28" assignees={<People initials={["JB", "MK"]} />} />
      <WorkloadTile count={9} status="in-progress" due="Due Dec 4" assignees={<People initials={["SR", "AL"]} />} />
      <WorkloadTile count={23} status="done" due="This sprint" assignees={<People initials={["MK"]} />} />
    </div>
  );
}
