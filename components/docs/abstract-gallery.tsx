"use client";

import * as React from "react";
import { Download04Icon } from "@hugeicons/core-free-icons";

import {
  abstractPresetNames,
  abstractPresets,
  DitherImage,
  renderDitherImage,
  type AbstractPresetName,
  type DitherImageGround,
  type DitherImageMode,
} from "@/registry/dither/lib/dither-image";
import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/registry/dither/ui/toggle-group";

async function download(el: Element, name: string, opts: Parameters<typeof renderDitherImage>[3]) {
  const canvas = await renderDitherImage(el, 1600, 1200, opts);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `dither-${name}.png`;
  a.click();
}

/** The abstract image library: every preset, with mode and ground pickers and a PNG download (1600 × 1200). */
export function AbstractGallery() {
  const [mode, setMode] = React.useState<DitherImageMode>("dots");
  const [ground, setGround] = React.useState<DitherImageGround>("dark");
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="not-prose my-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup type="single" variant="outline" size="sm" value={mode} onValueChange={(v) => v && setMode(v as DitherImageMode)} aria-label="Mode">
          <ToggleGroupItem value="dots">Dots</ToggleGroupItem>
          <ToggleGroupItem value="pixel">Pixel</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" variant="outline" size="sm" value={ground} onValueChange={(v) => v && setGround(v as DitherImageGround)} aria-label="Ground">
          <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {abstractPresetNames.map((name: AbstractPresetName) => (
          <figure key={name} className="flex flex-col gap-1 rounded-surface bg-background-muted p-1">
            <DitherImage preset={name} mode={mode} ground={ground} className="aspect-[4/3] rounded-[calc(var(--radius-surface)-4px)]" />
            <figcaption className="flex items-center justify-between gap-2 py-1 pr-1 pl-3">
              <span className="text-sm font-medium">{abstractPresets[name].label}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Download ${abstractPresets[name].label} as PNG`}
                onClick={() => ref.current && download(ref.current, name, { preset: name, mode, ground })}
              >
                <Icon icon={Download04Icon} />
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Your own image through the grid: the original next to dots and pixel. */
export function DitherImageSourceDemo() {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-3">
      {(["original", "dots", "pixel"] as const).map((m) => (
        <figure key={m} className="flex flex-col gap-1 rounded-surface bg-background-muted p-1">
          {m === "original" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/abstract/sample.webp" alt="Original abstract photo" className="aspect-[4/3] w-full rounded-[calc(var(--radius-surface)-4px)] object-cover" />
          ) : (
            <DitherImage src="/abstract/sample.webp" mode={m} className="aspect-[4/3] rounded-[calc(var(--radius-surface)-4px)]" />
          )}
          <figcaption className="px-3 py-1.5 text-sm text-muted-foreground">{m === "original" ? "Original" : m === "dots" ? "Dots" : "Pixel"}</figcaption>
        </figure>
      ))}
    </div>
  );
}
