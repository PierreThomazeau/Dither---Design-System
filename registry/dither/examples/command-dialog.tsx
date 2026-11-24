"use client";

import { useEffect, useState } from "react";
import { Analytics02Icon, Invoice01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/dither/ui/command";
import { Kbd, KbdGroup } from "@/registry/dither/ui/kbd";

export default function CommandDialogDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search
        <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        footer={<><span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span><span><Kbd>↵</Kbd> open</span><span className="ml-auto"><Kbd>Esc</Kbd> close</span></>}
      >
        <CommandInput placeholder="Search or jump to…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem><Icon icon={Analytics02Icon} />Revenue analytics</CommandItem>
            <CommandItem><Icon icon={Invoice01Icon} />Invoices</CommandItem>
            <CommandItem><Icon icon={UserGroupIcon} />Teams</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
