import { Add01Icon, MinusSignIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/registry/dither/ui/button-group";

export default function ButtonGroupVertical() {
  return (
    <div className="flex items-start gap-3">
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="ghost" size="sm"><Icon icon={Add01Icon} />Increase</Button>
        <ButtonGroupSeparator />
        <Button variant="ghost" size="sm"><Icon icon={MinusSignIcon} />Decrease</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" variant="secondary" aria-label="Zoom">
        <Button variant="ghost" size="sm"><Icon icon={Add01Icon} />Increase</Button>
        <ButtonGroupSeparator />
        <Button variant="ghost" size="sm"><Icon icon={MinusSignIcon} />Decrease</Button>
      </ButtonGroup>
    </div>
  );
}
