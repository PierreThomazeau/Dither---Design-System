import { Button } from "@/registry/dither/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverInset, PopoverTitle, PopoverTrigger } from "@/registry/dither/ui/popover";

export default function PopoverInsetDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Usage</Button>
      </PopoverTrigger>
      <PopoverContent variant="inset">
        <PopoverHeader>
          <PopoverTitle>API calls</PopoverTitle>
          <PopoverDescription>Resets on December 1</PopoverDescription>
        </PopoverHeader>
        <PopoverInset>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-2xl font-semibold tabular">2.2M</span>
            <span className="font-mono text-xs text-muted-foreground tabular">of 2.4M</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full">
            <span className="bg-dither-fine absolute inset-0" />
            <span className="absolute inset-y-0 left-0 w-[92%] rounded-full bg-chart-1" />
          </div>
        </PopoverInset>
      </PopoverContent>
    </Popover>
  );
}
