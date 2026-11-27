/* Accessibility check: axe-core (WCAG 2 A / AA) on every page, light and dark.
   Fails on serious or critical violations. Usage: pnpm qa:a11y [--only /docs/components/button,/] */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

import { allPages, BASE, launch, only } from "./shared.mjs";

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const pages = only() ?? allPages();
let failures = 0;
const verbose = process.argv.includes("--verbose");
const summary = new Map();

for (const theme of ["light", "dark"]) {
  const { browser, context } = await launch({ theme, reducedMotion: "reduce", gpu: false });
  const page = await context.newPage();
  for (const path of pages) {
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () => {
      const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] }, resultTypes: ["violations"] });
      return r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
        sample: v.nodes[0]?.target?.join(" "),
        details: v.nodes.map((n) => `${n.html.slice(0, 90)} — ${(n.any[0]?.message ?? n.all[0]?.message ?? "").slice(0, 110)}`),
      }));
    });
    const bad = result.filter((v) => v.impact === "serious" || v.impact === "critical");
    if (verbose) for (const v of bad) for (const d of v.details) console.log(`\n[${theme} ${path}] ${v.id}: ${d}`);
    if (bad.length) failures += bad.length;
    for (const v of result) {
      const k = `${v.impact} · ${v.id}`;
      const s = summary.get(k) ?? { count: 0, pages: new Set(), sample: v.sample };
      s.count += v.nodes;
      s.pages.add(`${theme} ${path}`);
      summary.set(k, s);
    }
    process.stdout.write(bad.length ? "x" : ".");
  }
  await browser.close();
}

console.log("\n");
for (const [k, s] of [...summary].sort((a, b) => b[1].count - a[1].count)) {
  console.log(`${k}: ${s.count} nodes on ${s.pages.size} page(s), e.g. ${[...s.pages][0]} → ${s.sample}`);
}
console.log(failures ? `\n${failures} serious / critical violation(s).` : "\nNo serious or critical violations.");
process.exit(failures ? 1 : 0);
