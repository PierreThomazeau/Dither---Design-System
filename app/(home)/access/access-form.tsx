"use client";

import * as React from "react";
import { LockKeyIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";

import { unlock, type UnlockState } from "./actions";

export function AccessForm({ next, configured }: { next: string; configured: boolean }) {
  const [state, action, pending] = React.useActionState<UnlockState, FormData>(unlock, {});
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="access-code">Access code</Label>
        <Input
          id="access-code"
          name="code"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "access-error" : undefined}
          placeholder="Your code"
        />
        {state.error ? (
          <p id="access-error" role="alert" className="text-sm text-destructive-ink">
            {state.error}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending} aria-busy={pending || undefined}>
        <Icon icon={LockKeyIcon} />
        {pending ? "Checking…" : "Unlock Dither"}
      </Button>
      {!configured ? (
        <p className="text-sm text-muted-foreground">
          No access code is set on this site yet: add <code className="font-mono text-xs">DITHER_ACCESS_CODE</code> in the hosting settings, then redeploy.
        </p>
      ) : null}
    </form>
  );
}
