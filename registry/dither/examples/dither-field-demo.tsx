import { DitherFill } from "@/registry/dither/lib/dither";
import { Badge } from "@/registry/dither/ui/badge";

export default function DitherFieldDemo() {
  return (
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-surface border bg-surface">
      <DitherFill interactive variant="regular" />
      <Badge variant="tag" className="relative">Move your cursor</Badge>
    </div>
  );
}
