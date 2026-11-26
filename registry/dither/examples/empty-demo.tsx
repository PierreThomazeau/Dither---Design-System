import { ArrowUpRight01Icon, Folder01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/registry/dither/ui/empty";

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><Icon icon={Folder01Icon} /></EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>You haven&apos;t created any projects yet. Start by creating your first one.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create project</Button>
          <Button variant="outline">Import</Button>
        </div>
        <Button variant="link" size="sm" className="text-muted-foreground">
          Learn more <Icon icon={ArrowUpRight01Icon} />
        </Button>
      </EmptyContent>
    </Empty>
  );
}
