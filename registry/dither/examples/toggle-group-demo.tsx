import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { ToggleGroup, ToggleGroupItem } from "@/registry/dither/ui/toggle-group";

export default function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
        <ToggleGroupItem value="left" aria-label="Left"><Icon icon={TextAlignLeftIcon} /></ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center"><Icon icon={TextAlignCenterIcon} /></ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Right"><Icon icon={TextAlignRightIcon} /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" variant="outline" defaultValue={["revenue"]} aria-label="Series">
        <ToggleGroupItem value="revenue">Revenue</ToggleGroupItem>
        <ToggleGroupItem value="costs">Costs</ToggleGroupItem>
        <ToggleGroupItem value="margin">Margin</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
