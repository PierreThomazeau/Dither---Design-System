"use client";

import * as React from "react";
import { Delete02Icon } from "@hugeicons/core-free-icons";

import { Companion } from "@/registry/dither/blocks/companion";
import { Disintegrate } from "@/registry/dither/lib/disintegrate";
import { Icon } from "@/registry/dither/lib/icon";
import { emitMoment } from "@/registry/dither/lib/moments";
import { Button } from "@/registry/dither/ui/button";
import { toast } from "@/registry/dither/ui/toast";

const START = ["Q4 delivery report", "Checkout research", "Hiring brief", "Pricing page copy"];

export default function MomentsDemo() {
  const [items, setItems] = React.useState(START.map((t, i) => ({ id: i, title: t, gone: false, back: false })));
  const remove = (id: number, title: string) => {
    setItems((l) => l.map((x) => (x.id === id ? { ...x, gone: true, back: false } : x)));
    toast.undo(`Deleted “${title}”`, { onUndo: () => setItems((l) => l.map((x) => (x.id === id ? { ...x, gone: false, back: true } : x))) });
  };
  return (
    <div className="grid w-full items-center gap-6 sm:grid-cols-[140px_1fr]">
      <Companion size={128} className="mx-auto" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Published", { description: "Visible to the whole team." })}>Success</Button>
          <Button size="sm" variant="outline" onClick={() => emitMoment("upload")}>Upload</Button>
          <Button size="sm" variant="outline" onClick={() => toast.error("Couldn't save", { description: "Check your connection." })}>Error</Button>
          <Button size="sm" variant="outline" onClick={() => setItems(START.map((t, i) => ({ id: i, title: t, gone: false, back: false })))}>Reset list</Button>
        </div>
        <div className="flex flex-col gap-1.5">
          {items.map((it) => (
            <Disintegrate key={it.id} gone={it.gone} reassemble={it.back}>
              <div className="flex items-center justify-between gap-2 rounded-field border bg-surface py-1.5 pr-1.5 pl-3 text-sm shadow-xs">
                {it.title}
                <Button size="icon-sm" variant="ghost" aria-label={`Delete ${it.title}`} onClick={() => remove(it.id, it.title)}>
                  <Icon icon={Delete02Icon} />
                </Button>
              </div>
            </Disintegrate>
          ))}
        </div>
      </div>
    </div>
  );
}
