import { DitherFill, type OrganicShape } from "@/registry/dither/lib/dither";

const shapes: OrganicShape[] = ["cloud", "scatter", "halo", "flow"];

export default function DitherOrganic() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {shapes.map((shape) => (
        <figure key={shape} className="flex flex-col gap-1.5">
          <div className="relative h-28 overflow-hidden rounded-control border bg-surface">
            <DitherFill shape={shape} />
          </div>
          <figcaption className="font-mono text-xs text-muted-foreground">{shape}</figcaption>
        </figure>
      ))}
    </div>
  );
}
