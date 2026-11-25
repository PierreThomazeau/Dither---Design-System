import { DitherFill } from "@/registry/dither/lib/dither";

export default function DitherFieldDemo() {
  return (
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-surface border bg-surface">
      <DitherFill interactive variant="regular" />
      <span className="relative rounded-hairline bg-foreground px-1.5 font-mono text-[10px] text-primary-foreground uppercase">Move your cursor</span>
    </div>
  );
}
