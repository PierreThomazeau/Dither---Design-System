"use client";

import * as React from "react";

import { Slider } from "@/registry/dither/ui/slider";

export default function SliderDemo() {
  const [v, setV] = React.useState([40]);
  const [range, setRange] = React.useState([20, 70]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm"><span>Volume</span><span className="font-mono text-muted-foreground tabular">{v[0]}%</span></div>
        <Slider value={v} onValueChange={setV} aria-label="Volume" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm"><span>Price</span><span className="font-mono text-muted-foreground tabular">€{range[0]} – €{range[1]}</span></div>
        <Slider value={range} onValueChange={setRange} step={5} />
      </div>
    </div>
  );
}
