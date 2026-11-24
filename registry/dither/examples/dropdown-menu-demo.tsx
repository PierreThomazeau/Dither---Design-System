import { CreditCardIcon, Logout01Icon, Settings02Icon, UserAdd01Icon, UserIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/dither/ui/dropdown-menu";

export default function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Lumen Finance</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem><Icon icon={UserIcon} />Profile<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem><Icon icon={CreditCardIcon} />Billing<DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem><Icon icon={Settings02Icon} />Settings<DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Icon icon={UserAdd01Icon} />Invite</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>By email</DropdownMenuItem>
            <DropdownMenuItem>Copy invite link</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive"><Icon icon={Logout01Icon} />Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
