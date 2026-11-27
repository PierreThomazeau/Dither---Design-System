"use client";

import * as React from "react";

import { applyMotionAttribute, getMomentPrefs, setMomentPrefs, type MomentPrefs } from "@/registry/dither/lib/moments";
import { Switch } from "@/registry/dither/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/registry/dither/ui/toggle-group";

/** Mount once (root layout): applies the viewer's motion intensity to <html data-motion>. */
export function MomentPrefsInit() {
  React.useEffect(() => applyMotionAttribute(), []);
  return null;
}

/** Viewer preferences for moments: sound (off by default), haptics, motion intensity. */
export function MomentSettings({ className }: { className?: string }) {
  const [prefs, setPrefs] = React.useState<MomentPrefs>(getMomentPrefs);
  const update = (patch: Partial<MomentPrefs>) => setPrefs(setMomentPrefs(patch));
  return (
    <div className={className ?? "flex flex-col gap-4"}>
      <Switch label="Sound" description="Short tones for success, delete, undo and errors." checked={prefs.sound} onCheckedChange={(v) => update({ sound: v })} />
      <Switch label="Haptics" description="A light vibration on phones that support it." checked={prefs.haptics} onCheckedChange={(v) => update({ haptics: v })} />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Motion</span>
        <ToggleGroup type="single" variant="outline" size="sm" value={prefs.motion} onValueChange={(v) => v && update({ motion: v as MomentPrefs["motion"] })} aria-label="Motion intensity">
          <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
          <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
          <ToggleGroupItem value="expressive">Expressive</ToggleGroupItem>
        </ToggleGroup>
        <span className="text-xs text-muted-foreground">Your system&apos;s &quot;Reduce motion&quot; setting always wins.</span>
      </div>
    </div>
  );
}
