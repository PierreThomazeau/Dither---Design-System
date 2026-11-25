import { Badge } from "@/registry/dither/ui/badge";

const STATUS_LABEL = { stable: "Stable", beta: "Beta", planned: "Planned" } as const;

/** Docs meta row, built from the Badge component (outline pills). */
export function MetaChips({
  status,
  variants,
  props,
}: {
  status?: keyof typeof STATUS_LABEL;
  variants?: number;
  props?: number;
}) {
  const chips = [
    status ? STATUS_LABEL[status] : null,
    variants !== undefined ? `${variants} variants` : null,
    props !== undefined ? `${props} props` : null,
    "Light & Dark",
  ].filter((c): c is string => Boolean(c));

  return (
    <ul className="not-prose flex flex-wrap gap-1.5">
      {chips.map((chip, i) => (
        <li key={chip}>
          <Badge variant="outline" className="text-muted-foreground">
            {i === 0 && status === "stable" ? <span className="size-1.5 rounded-full bg-positive" /> : null}
            {chip}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
