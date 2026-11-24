import { Archive02Icon, Copy01Icon, MoreHorizontalIcon, Share08Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/registry/dither/ui/button-group";

function Actions() {
  return (
    <>
      <Button variant="ghost" size="sm"><Icon icon={Share08Icon} />Share</Button>
      <ButtonGroupSeparator />
      <Button variant="ghost" size="icon-sm" aria-label="Duplicate"><Icon icon={Copy01Icon} /></Button>
      <ButtonGroupSeparator />
      <Button variant="ghost" size="sm"><Icon icon={Archive02Icon} />Archive</Button>
      <ButtonGroupSeparator />
      <Button variant="ghost" size="icon-sm" aria-label="More"><Icon icon={MoreHorizontalIcon} /></Button>
    </>
  );
}

export default function ButtonGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ButtonGroup aria-label="Report actions"><Actions /></ButtonGroup>
      <ButtonGroup variant="secondary" aria-label="Report actions"><Actions /></ButtonGroup>
      <ButtonGroup variant="default" aria-label="Report actions"><Actions /></ButtonGroup>
    </div>
  );
}
