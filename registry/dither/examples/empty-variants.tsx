import { CloudUploadIcon, Notification01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/registry/dither/ui/empty";

export default function EmptyVariants() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <Empty variant="outline">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Icon icon={CloudUploadIcon} /></EmptyMedia>
          <EmptyTitle>Storage empty</EmptyTitle>
          <EmptyDescription>Upload files to access them anywhere.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button variant="outline" size="sm">Upload files</Button></EmptyContent>
      </Empty>
      <Empty variant="muted">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Icon icon={Notification01Icon} /></EmptyMedia>
          <EmptyTitle>All caught up</EmptyTitle>
          <EmptyDescription>New notifications will appear here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button variant="outline" size="sm"><Icon icon={RefreshIcon} />Refresh</Button></EmptyContent>
      </Empty>
      <Empty variant="dither">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Icon icon={RefreshIcon} /></EmptyMedia>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyDescription>Reports appear after the first sync.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
