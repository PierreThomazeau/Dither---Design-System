"use client";

import { useId } from "react";

import { Button } from "@/registry/dither/ui/button";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/registry/dither/ui/popover";

export default function PopoverDemo() {
  const id = useId();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the chart.</PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-[80px_1fr] items-center gap-2">
          <Label htmlFor={`${id}-w`}>Width</Label>
          <Input id={`${id}-w`} size="sm" defaultValue="100%" className="font-mono" />
          <Label htmlFor={`${id}-h`}>Height</Label>
          <Input id={`${id}-h`} size="sm" defaultValue="320px" className="font-mono" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
