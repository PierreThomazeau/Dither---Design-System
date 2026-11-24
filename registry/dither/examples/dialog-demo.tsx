"use client";

import { useId } from "react";

import { Button } from "@/registry/dither/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/dither/ui/dialog";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";

export default function DialogDemo() {
  const id = useId();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rename project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>The new name is visible to everyone in Northwind Studio.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-name`}>Project name</Label>
          <Input id={`${id}-name`} defaultValue="Atlas" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
