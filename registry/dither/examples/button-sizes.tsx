import { Add01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";

export default function ButtonSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="icon-xs" variant="outline" aria-label="Add"><Icon icon={Add01Icon} /></Button>
        <Button size="icon-sm" variant="outline" aria-label="Add"><Icon icon={Add01Icon} /></Button>
        <Button size="icon" variant="outline" aria-label="Add"><Icon icon={Add01Icon} /></Button>
        <Button size="icon-lg" variant="outline" aria-label="Add"><Icon icon={Add01Icon} /></Button>
      </div>
    </div>
  );
}
