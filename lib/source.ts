import { llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { z } from "zod";

import { docsRoute } from "./shared";

/** Extra frontmatter for component pages (docs template: eyebrow + meta chips). */
export const dsPageSchema = pageSchema.extend({
  status: z.enum(["stable", "beta", "planned"]).optional(),
  variants: z.number().int().optional(),
  props: z.number().int().optional(),
  /** Registry item name, shown as `npx shadcn add @dither/<registry>`. */
  registry: z.string().optional(),
});

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: dsPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
