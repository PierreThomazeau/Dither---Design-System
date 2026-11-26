"use client";

import * as React from "react";
import { DitherIcon } from "@unlocalhosted/dither-icons";

import { cn } from "@/registry/dither/lib/utils";

/**
 * Animated icons from Dither Icons (@unlocalhosted/dither-icons, MIT), set up the Dither way.
 *
 * - `line` (default up to 24px): the package's outline, a stroke close to Hugeicons' 1.5.
 * - `solid`: the filled silhouette, for tiny or high-contrast spots.
 * - `dither` (default from 32px): the package's outline over its silhouette filled with Dither's
 *   own organic grain (`mask-dither-organic`, 1.25 → 2px dots, twinkling). The package's built-in
 *   dither material is a 0.5px grain, finer than the rest of Dither, so it is not used.
 *
 * Every icon plays its own one-shot gesture on hover, focus or tap of the closest `.di-trigger`
 * (Button, nav links and Side Panel triggers carry it), and stays still under reduced motion.
 * Without `title` the icon is decorative; name icon-only buttons with `aria-label`.
 *
 * Rendered on the client only: the package computes some paths and keyframes with trigonometry,
 * whose last digits differ between Node and the browser, which would break hydration. The server
 * renders an empty box of the same size, so nothing shifts.
 */
export type AnimatedIconMaterial = "line" | "solid" | "dither";

export interface AnimatedIconProps extends Omit<React.ComponentProps<typeof DitherIcon>, "texture" | "name" | "size"> {
  /** A name from the package's icons.json (`bell`, `download`, `search`…). Invalid names throw. */
  name: string;
  /** px. 16 in controls (the Hugeicons size), 20–24 in toolbars, 48+ for spot moments. */
  size?: number;
  material?: AnimatedIconMaterial;
}

const subscribe = () => () => {};

function AnimatedIcon({ name, size = 16, material, className, title, ...props }: AnimatedIconProps) {
  const mounted = React.useSyncExternalStore(subscribe, () => true, () => false);
  const m = material ?? (size >= 32 ? "dither" : "line");
  if (!mounted) {
    return <span data-slot="animated-icon" aria-hidden="true" className={cn("inline-block shrink-0", className)} style={{ width: size, height: size }} />;
  }
  if (m !== "dither") {
    return (
      <DitherIcon
        data-slot="animated-icon"
        name={name}
        size={size}
        texture={m === "solid" ? "solid" : "outline"}
        title={title}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  }
  return (
    <span data-slot="animated-icon" className={cn("relative inline-grid shrink-0", className)} style={{ width: size, height: size }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <DitherIcon name={name} size={size} texture="solid" className="mask-dither-organic [grid-area:1/1]" {...props} />
      <DitherIcon name={name} size={size} texture="outline" className="[grid-area:1/1]" {...props} />
    </span>
  );
}

export { AnimatedIcon };
