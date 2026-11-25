import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

export interface SplitBarDatum {
  label: string;
  value: number;
}

export interface SplitBarProps extends React.ComponentProps<"div"> {
  data: SplitBarDatum[];
  format?: (n: number) => string;
  /** Labels over each side. */
  negativeLabel?: string;
  positiveLabel?: string;
}

/** Diverging bars around a centre line: decreases left in red, increases right in green, tracks in dither. */
export function SplitBar({ data, format = (n) => `${n}`, negativeLabel = "Reduce", positiveLabel = "Increase", className, ...props }: SplitBarProps) {
  const max = Math.max(...data.map((d) => Math.abs(d.value))) * 1.15 || 1;
  return (
    <div data-slot="split-bar" className={cn("grid grid-cols-[auto_1fr_1fr] items-center gap-x-0 gap-y-2", className)} {...props}>
      <span />
      <span className="pr-2 text-left font-mono text-[10px] text-muted-foreground uppercase">{negativeLabel}</span>
      <span className="pl-2 text-right font-mono text-[10px] text-muted-foreground uppercase">{positiveLabel}</span>
      {data.map((d) => {
        const w = `${(Math.abs(d.value) / max) * 100}%`;
        const neg = d.value < 0;
        const label = `${neg ? "−" : "+"}${format(Math.abs(d.value))}`;
        return (
          <React.Fragment key={d.label}>
            <span className="pr-3 text-sm">{d.label}</span>
            <span className="relative h-3 border-r border-foreground" role={neg ? "img" : undefined} aria-label={neg ? `${d.label}: ${label}` : undefined}>
              <span aria-hidden="true" className="bg-dither-organic absolute inset-y-0.5 right-0 left-0" />
              {neg ? (
                <>
                  <span className="absolute inset-y-0 right-0 rounded-l-[3px] bg-destructive" style={{ width: w }} />
                  <span className="absolute top-1/2 -translate-y-1/2 pr-1.5 font-mono text-[11px] font-medium whitespace-nowrap tabular" style={{ right: w }}>
                    {label}
                  </span>
                </>
              ) : null}
            </span>
            <span className="relative h-3" role={!neg ? "img" : undefined} aria-label={!neg ? `${d.label}: ${label}` : undefined}>
              <span aria-hidden="true" className="bg-dither-organic absolute inset-y-0.5 right-0 left-0" />
              {!neg ? (
                <>
                  <span className="absolute inset-y-0 left-0 rounded-r-[3px] bg-positive" style={{ width: w }} />
                  <span className="absolute top-1/2 -translate-y-1/2 pl-1.5 font-mono text-[11px] font-medium tabular" style={{ left: w }}>
                    {label}
                  </span>
                </>
              ) : null}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
