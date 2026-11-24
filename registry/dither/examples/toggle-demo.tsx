import { StarIcon, TextBoldIcon, TextItalicIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Toggle } from "@/registry/dither/ui/toggle";

export default function ToggleDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Bold" defaultPressed><Icon icon={TextBoldIcon} /></Toggle>
      <Toggle aria-label="Italic"><Icon icon={TextItalicIcon} /></Toggle>
      <Toggle variant="outline"><Icon icon={StarIcon} />Favourite</Toggle>
      <Toggle variant="outline" size="sm">Small</Toggle>
      <Toggle variant="outline" size="lg">Large</Toggle>
    </div>
  );
}
