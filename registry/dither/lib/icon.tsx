import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

/** Hugeicons with Dither defaults: 16px, stroke 1.5. */
export function Icon({ size = 16, strokeWidth = 1.5, ...props }: HugeiconsIconProps) {
  return <HugeiconsIcon size={size} strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
}
