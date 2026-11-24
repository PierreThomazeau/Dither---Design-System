import * as React from "react";

import { fieldVariants, type ControlSize } from "@/registry/dither/lib/control";
import { cn } from "@/registry/dither/lib/utils";

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & { size?: ControlSize }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldVariants({ size }),
        "file:mr-3 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
