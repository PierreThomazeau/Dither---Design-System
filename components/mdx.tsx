import defaultMdxComponents from "fumadocs-ui/mdx";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import type { MDXComponents } from "mdx/types";

import { ComponentPreview } from "@/components/docs/component-preview";
import { InstallCommand } from "@/components/docs/install-command";
import { Preview } from "@/components/docs/preview";
import { DitherTrackDemo, DitherVariantsDemo } from "@/components/docs/dither-demo";
import { DitherFill } from "@/registry/dither/lib/dither";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    TypeTable,
    Preview,
    ComponentPreview,
    InstallCommand,
    DitherFill,
    DitherVariantsDemo,
    DitherTrackDemo,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
