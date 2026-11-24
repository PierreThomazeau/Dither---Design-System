import { Sparkline } from "@/registry/dither/blocks/sparkline";

export default function SparklineDemo() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Sparkline data={[4, 6, 5, 8, 7, 10, 9, 12]} label="Signups, rising" />
      <Sparkline data={[10, 9, 11, 8, 7, 8, 6, 5]} className="text-destructive" dither label="Errors, falling" />
      <Sparkline data={[5, 7, 6, 9, 8, 7, 9, 8]} className="h-12 text-foreground" area={false} />
    </div>
  );
}
