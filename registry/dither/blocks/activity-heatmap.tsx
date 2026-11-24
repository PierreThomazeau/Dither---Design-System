import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

const LEVEL_CLASS = [
  "bg-background-muted",
  "bg-informative/25",
  "bg-informative/50",
  "bg-informative/75",
  "bg-informative",
] as const;

export interface ActivityHeatmapProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** One value per day, oldest first, starting on a Monday. */
  values: number[];
  /** Date of the first value (a Monday), for month labels and titles. ISO string. */
  start: string;
  /** Upper bounds for levels 1–3; above the last = level 4. Default [1, 3, 6]. */
  thresholds?: [number, number, number];
  /** Unit in cell titles. */
  unit?: string;
}

function level(v: number, [a, b, c]: [number, number, number]) {
  if (v <= 0) return 0;
  if (v <= a) return 1;
  if (v <= b) return 2;
  if (v <= c) return 3;
  return 4;
}

/** Contribution-style grid: weeks as columns, Mon–Sun as rows, five intensity levels. */
function ActivityHeatmap({ values, start, thresholds = [1, 3, 6], unit = "events", className, ...props }: ActivityHeatmapProps) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const weeks = Math.ceil(values.length / 7);
  const day = (i: number) => new Date(startDate.getTime() + i * 86_400_000);
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
  const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  const months: { week: number; label: string }[] = [];
  for (let w = 0; w < weeks; w++) {
    const d = day(w * 7);
    const prev = w > 0 ? day((w - 1) * 7) : null;
    if (!prev || prev.getUTCMonth() !== d.getUTCMonth()) months.push({ week: w, label: monthFmt.format(d) });
  }

  return (
    <div data-slot="activity-heatmap" className={cn("inline-flex flex-col gap-2 font-mono text-xs text-muted-foreground", className)} {...props}>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `28px repeat(${weeks}, 10px)` }}>
        <span />
        {Array.from({ length: weeks }, (_, w) => (
          <span key={w} className="h-4 overflow-visible whitespace-nowrap">
            {months.find((m) => m.week === w)?.label ?? ""}
          </span>
        ))}
        {Array.from({ length: 7 }, (_, row) => (
          <React.Fragment key={row}>
            <span className="h-2.5 leading-[10px]">{row === 0 ? "Mon" : row === 2 ? "Wed" : row === 4 ? "Fri" : ""}</span>
            {Array.from({ length: weeks }, (_, w) => {
              const i = w * 7 + row;
              if (i >= values.length) return <span key={w} />;
              const v = values[i];
              return (
                <span
                  key={w}
                  title={`${v} ${unit} · ${dateFmt.format(day(i))}`}
                  className={cn("size-2.5 rounded-[3px]", LEVEL_CLASS[level(v, thresholds)])}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1">
        <span className="mr-1">Less</span>
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={cn("size-2.5 rounded-[3px]", c)} />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}

export { ActivityHeatmap };
