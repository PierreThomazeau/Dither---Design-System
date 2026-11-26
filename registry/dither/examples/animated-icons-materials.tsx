"use client";

import { AnimatedIcon } from "@/registry/dither/lib/animated-icon";
import { Button } from "@/registry/dither/ui/button";

const names = ["bell", "download", "search", "lock", "sparkles", "upload"];

/** Line in controls, dither for spot moments. Hover a tile or a button: the whole control plays the icon. */
export default function AnimatedIconsMaterials() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {names.map((n) => (
          <span key={n} className="di-trigger flex size-20 items-center justify-center rounded-surface border bg-surface" tabIndex={0}>
            <AnimatedIcon name={n} size={48} />
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button>
          <AnimatedIcon name="download" />
          Download report
        </Button>
        <Button variant="outline">
          <AnimatedIcon name="copy" />
          Copy link
        </Button>
        <Button variant="outline" size="icon" aria-label="Notifications">
          <AnimatedIcon name="bell" />
        </Button>
        <Button variant="ghost">
          <AnimatedIcon name="settings" />
          Settings
        </Button>
      </div>
    </div>
  );
}
