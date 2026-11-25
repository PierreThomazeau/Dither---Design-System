import { cn } from "@/registry/dither/lib/utils";

/* Pierre's Dither mark (public/brand/dither-logo-{dark,light}.svg): a cross with an open centre over
 * a square frame at 50%. Drawn in currentColor so it follows light / dark and any text colour. */
const FRAME = "M34.7196 34.7192H13.2821V13.2817H34.7196V34.7192ZM20.6151 20.6147V27.3843H27.3856V20.6147H20.6151Z";
const CROSS =
  "M27.3848 20.6146H46V27.3842H27.3848V45.9994H20.6152V27.3842H2V20.6146H20.6152V1.99939H27.3848V20.6146ZM20.6152 20.6146V27.3842H27.3848V20.6146H20.6152Z";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-4", className)}>
      <path d={FRAME} fill="currentColor" fillOpacity={0.5} />
      <path d={CROSS} fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark className="size-5" />
      Dither
    </span>
  );
}
