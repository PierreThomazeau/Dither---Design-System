import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

/** Docs template §3: `npx shadcn add @dither/<name>`. */
export function InstallCommand({ name }: { name: string }) {
  return <DynamicCodeBlock lang="bash" code={`npx shadcn add @dither/${name}`} />;
}
