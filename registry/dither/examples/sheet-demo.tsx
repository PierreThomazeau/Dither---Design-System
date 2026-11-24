"use client";

import { useId } from "react";

import { Button } from "@/registry/dither/ui/button";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/dither/ui/sheet";
import { Switch } from "@/registry/dither/ui/switch";

export default function SheetDemo() {
  const id = useId();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit team</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit team</SheetTitle>
          <SheetDescription>Changes apply to every project of the team.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-team`}>Team name</Label>
            <Input id={`${id}-team`} defaultValue="Revenue" />
          </div>
          <Switch variant="box" placement="end" label="Weekly report" description="Sent every Monday at 9:00." defaultChecked />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
