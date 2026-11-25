import { readFile } from "node:fs/promises";
import path from "node:path";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

import { Preview } from "@/components/docs/preview";
import { examples } from "@/registry/dither/examples";

/** Rewrites registry paths to the paths a user gets after `npx shadcn add`. */
function toUserImports(source: string) {
  return source
    .replaceAll("@/registry/dither/ui/", "@/components/ui/")
    .replaceAll("@/registry/dither/blocks/", "@/components/blocks/")
    .replaceAll("@/registry/dither/charts/", "@/components/charts/")
    .replaceAll("@/registry/dither/lib/utils", "@/lib/utils")
    .replaceAll("@/registry/dither/lib/", "@/lib/");
}

/**
 * Live example in a light + dark inset shell, with its source underneath.
 * The code is read from registry/dither/examples/<name>.tsx, so it never drifts from the preview.
 */
export async function ComponentPreview({
  name,
  single,
  className,
  panelClassName,
  hideCode,
  stacked,
}: {
  name: string;
  single?: boolean;
  className?: string;
  panelClassName?: string;
  hideCode?: boolean;
  stacked?: boolean;
}) {
  const Example = examples[name];
  if (!Example) throw new Error(`ComponentPreview: unknown example "${name}"`);

  const source = hideCode
    ? null
    : toUserImports(await readFile(path.join(process.cwd(), "registry/dither/examples", `${name}.tsx`), "utf8"));

  return (
    <div className="not-prose my-6">
      <Preview single={single} stacked={stacked} className="my-0" panelClassName={panelClassName}>
        <Example />
      </Preview>
      {source ? (
        <details className="group mt-2 rounded-surface border bg-surface">
          <summary className="flex h-control cursor-pointer list-none items-center justify-between px-5 text-sm font-medium text-muted-foreground select-none hover:text-foreground">
            Code
            <span className="transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="px-1 pb-1 [&_figure]:my-0">
            <DynamicCodeBlock lang="tsx" code={source.trimEnd()} />
          </div>
        </details>
      ) : null}
    </div>
  );
}
