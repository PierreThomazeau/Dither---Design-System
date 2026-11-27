"use client";

import * as React from "react";

import { MomentSweep } from "@/registry/dither/lib/moment-sweep";
import { Button } from "@/registry/dither/ui/button";
import { toast } from "@/registry/dither/ui/toast";

export default function SweepButtonDemo() {
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");
  const [played, setPlayed] = React.useState(0);
  return (
    <Button
      loading={state === "loading"}
      onClick={() => {
        setState("loading");
        window.setTimeout(() => {
          setState("done");
          setPlayed((p) => p + 1);
          toast.success("Release published", { description: "v2.4.0 is live.", moment: true });
        }, 1100);
      }}
    >
      <MomentSweep play={played} direction="right" />
      {state === "done" ? "Published" : "Publish release"}
    </Button>
  );
}
