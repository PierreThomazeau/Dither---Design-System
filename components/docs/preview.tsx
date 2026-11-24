import type { ReactNode } from "react";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Docs preview (template §2): an inset shell (grammar 2) holding a light and a dark panel
 * side by side, each rendering the same live children, whatever the site theme.
 */
export function Preview({
  children,
  className,
  panelClassName,
  single = false,
  stacked = false,
}: {
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  /** Render one panel following the site theme instead of light + dark. */
  single?: boolean;
  /** Light panel above the dark one, for wide components. */
  stacked?: boolean;
}) {
  const panel = (mode: "light" | "dark" | null) => (
    <div
      className={cn(
        mode,
        "relative flex min-h-48 items-center justify-center overflow-hidden rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-8 text-foreground shadow-xs",
        panelClassName,
      )}
    >
      {mode ? (
        <span className="absolute top-3 left-3 font-mono text-xs uppercase text-muted-foreground">{mode}</span>
      ) : null}
      {children}
    </div>
  );

  return (
    <div className={cn("not-prose my-6 rounded-surface bg-background-muted p-1", className)}>
      {single ? panel(null) : <div className={cn("grid gap-1", !stacked && "md:grid-cols-2")}>{panel("light")}{panel("dark")}</div>}
    </div>
  );
}
