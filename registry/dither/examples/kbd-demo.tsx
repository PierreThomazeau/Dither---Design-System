import { CommandIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Kbd, KbdGroup } from "@/registry/dither/ui/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <KbdGroup>
        <Kbd><Icon icon={CommandIcon} /></Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <p>
        Press <Kbd>Esc</Kbd> to close, <KbdGroup><Kbd>Ctrl</Kbd><Kbd>Enter</Kbd></KbdGroup> to send.
      </p>
    </div>
  );
}
