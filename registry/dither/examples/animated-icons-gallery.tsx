"use client";

import { definitions } from "@unlocalhosted/dither-icons";

import { AnimatedIcon } from "@/registry/dither/lib/animated-icon";

/** Every icon in the line material, each in a focusable tile that plays its gesture on hover or focus. */
export default function AnimatedIconsGallery() {
  return (
    <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
      {definitions.map((icon) => (
        <li key={icon.name}>
          <button
            type="button"
            className="di-trigger flex w-full flex-col items-center gap-2 rounded-control-min border bg-surface px-2 py-4 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:shadow-focus"
          >
            <AnimatedIcon name={icon.name} size={24} />
            <span className="max-w-full truncate">{icon.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
