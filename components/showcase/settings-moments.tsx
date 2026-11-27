"use client";

import * as React from "react";
import { Delete02Icon } from "@hugeicons/core-free-icons";

import { FileDrop } from "@/registry/dither/blocks/file-drop";
import { Disintegrate } from "@/registry/dither/lib/disintegrate";
import { Icon } from "@/registry/dither/lib/icon";
import { MomentSweep } from "@/registry/dither/lib/moment-sweep";
import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { toast } from "@/registry/dither/ui/toast";

/** Save with the success signature: loading, then the sweep through the button and a success toast. */
export function SaveButton() {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(0);
  return (
    <Button
      loading={saving}
      onClick={() => {
        setSaving(true);
        window.setTimeout(() => {
          setSaving(false);
          setSaved((n) => n + 1);
          toast.success("Settings saved", { description: "Northwind Studio is up to date." });
        }, 900);
      }}
    >
      <MomentSweep play={saved} direction="right" />
      Save changes
    </Button>
  );
}

export function BrandAssets() {
  return <FileDrop accept="image/*,application/pdf" hint="Logos and brand files · PNG, SVG or PDF up to 10 MB" />;
}

const KEYS = [
  { id: "k1", name: "Production", key: "nw_live_4f9a…c21e", used: "2 min ago" },
  { id: "k2", name: "Staging", key: "nw_test_88b0…a07d", used: "yesterday" },
  { id: "k3", name: "Zapier export", key: "nw_live_19cc…5f42", used: "3 weeks ago" },
];

/** API keys: revoking disintegrates the row, with an undo toast. */
export function ApiKeys() {
  const [state, setState] = React.useState(KEYS.map((k) => ({ ...k, gone: false, back: false })));
  return (
    <div className="flex flex-col gap-2">
      {state.map((k) => (
        <Disintegrate key={k.id} gone={k.gone} reassemble={k.back}>
          <div className="flex items-center gap-3 rounded-field border bg-surface py-2 pr-2 pl-3.5 shadow-xs">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-2 text-sm font-medium">
                {k.name}
                {k.name === "Production" ? <Badge variant="outline">Live</Badge> : null}
              </span>
              <span className="truncate font-mono text-xs text-muted-foreground">{k.key} · used {k.used}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setState((l) => l.map((x) => (x.id === k.id ? { ...x, gone: true, back: false } : x)));
                toast.undo(`Revoked “${k.name}”`, { onUndo: () => setState((l) => l.map((x) => (x.id === k.id ? { ...x, gone: false, back: true } : x))) });
              }}
            >
              <Icon icon={Delete02Icon} />
              Revoke
            </Button>
          </div>
        </Disintegrate>
      ))}
    </div>
  );
}
