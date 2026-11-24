"use client";

import { useState } from "react";

import { Button } from "@/registry/dither/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/dither/ui/dropdown-menu";

export default function DropdownMenuCheckboxes() {
  const [columns, setColumns] = useState({ status: true, owner: true, amount: false });
  const [sort, setSort] = useState("newest");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        {(Object.keys(columns) as (keyof typeof columns)[]).map((key) => (
          <DropdownMenuCheckboxItem
            key={key}
            className="capitalize"
            checked={columns[key]}
            onCheckedChange={(checked) => setColumns((c) => ({ ...c, [key]: checked === true }))}
          >
            {key}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
