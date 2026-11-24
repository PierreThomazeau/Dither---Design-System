import { ArrowRight02Icon, SentIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Kbd, KbdGroup } from "@/registry/dither/ui/kbd";

export default function ButtonStates() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline">
        <Icon icon={SentIcon} />
        Send
      </Button>
      <Button variant="outline">
        Learn more
        <Icon icon={ArrowRight02Icon} />
      </Button>
      <Button loading>Please wait</Button>
      <Button disabled>Disabled</Button>
      <Button>
        Save
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </Button>
    </div>
  );
}
