import { Loading03Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";

function Spinner({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <span role="status" aria-label="Loading" className={cn("inline-flex", className)}>
      <Icon icon={Loading03Icon} size={size} className="animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]" />
    </span>
  );
}

export { Spinner };
