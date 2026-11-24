import { cn } from "@/registry/dither/lib/utils";

/** Dither mark: a pixel cross (from the Figma cover) + wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("size-4", className)}>
      <path fill="currentColor" d="M6 0h4v6h6v4h-6v6H6v-6H0V6h6z" />
      <rect x="6.75" y="6.75" width="2.5" height="2.5" className="fill-background" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark />
      Dither
    </span>
  );
}
