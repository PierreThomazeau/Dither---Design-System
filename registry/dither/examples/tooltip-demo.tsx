import { Add01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Kbd } from "@/registry/dither/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/dither/ui/tooltip";

export default function TooltipDemo() {
  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="New project"><Icon icon={Add01Icon} /></Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          New project <Kbd>N</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
