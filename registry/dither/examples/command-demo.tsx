import { Analytics02Icon, File01Icon, Invoice01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/dither/ui/command";

export default function CommandDemo() {
  return (
    <Command className="max-w-sm">
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem><Icon icon={Analytics02Icon} />Revenue analytics</CommandItem>
          <CommandItem><Icon icon={Invoice01Icon} />Invoices</CommandItem>
          <CommandItem><Icon icon={UserGroupIcon} />Teams</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem><Icon icon={File01Icon} />New report<CommandShortcut>⌘N</CommandShortcut></CommandItem>
          <CommandItem><Icon icon={Settings02Icon} />Settings<CommandShortcut>⌘,</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
