const STATUS_LABEL = { stable: "Stable", beta: "Beta", planned: "Planned" } as const;

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
  ].filter(Boolean);

  return (
    <ul className="not-prose flex flex-wrap gap-1.5">
      {chips.map((chip, i) => (
        <li
          key={chip}
          className="inline-flex h-6 items-center gap-1.5 rounded-micro border bg-surface px-2 font-mono text-xs text-muted-foreground"
        >
          {i === 0 && status === "stable" ? <span className="size-1.5 rounded-[1px] bg-positive" /> : null}
          {chip}
        </li>
      ))}
    </ul>
  );
}
