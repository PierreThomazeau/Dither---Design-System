import { Search01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/registry/dither/ui/button-group";
import { Input } from "@/registry/dither/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/dither/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";
import { Toggle } from "@/registry/dither/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/dither/ui/toggle-group";

const SIZES = [
  { size: "xs", px: 32 },
  { size: "sm", px: 36 },
  { size: "default", px: 40 },
  { size: "lg", px: 44 },
] as const;

/** Every control at the same size has the same height. A dashed guide marks the expected height. */
export default function HeightRule() {
  return (
    <div className="flex w-full flex-col gap-6">
      {SIZES.map(({ size, px }) => {
        const toggleSize = size === "xs" ? "sm" : size;
        return (
          <div key={size} className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              {size} · {px}px
            </p>
            <div className="relative flex flex-wrap items-center gap-2" data-height-row={px}>
              <Button size={size}>Button</Button>
              <Button size={size} variant="outline">Outline</Button>
              <Input size={size} placeholder="Input" className="w-32" />
              <Select>
                <SelectTrigger size={size} className="min-w-28" aria-label="Select">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="a">
                <TabsList size={size}>
                  <TabsTrigger value="a">Tabs</TabsTrigger>
                  <TabsTrigger value="b">List</TabsTrigger>
                </TabsList>
              </Tabs>
              <ButtonGroup size={size} aria-label="Group">
                <Button variant="ghost" size="sm">Group</Button>
                <ButtonGroupSeparator />
                <Button variant="ghost" size="sm">Item</Button>
              </ButtonGroup>
              {size !== "xs" ? (
                <>
                  <Toggle size={toggleSize} variant="outline" aria-label="Search"><Icon icon={Search01Icon} /></Toggle>
                  <ToggleGroup type="single" size={toggleSize} defaultValue="a" aria-label="Toggle group">
                    <ToggleGroupItem value="a">On</ToggleGroupItem>
                    <ToggleGroupItem value="b">Off</ToggleGroupItem>
                  </ToggleGroup>
                </>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
