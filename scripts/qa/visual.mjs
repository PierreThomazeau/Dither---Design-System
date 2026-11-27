/* Visual regression: screenshots of key pages in light and dark (reduced motion, so the dither is still),
   compared with tests/visual/baseline. Usage: pnpm qa:visual [--update] */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { BASE, launch, only } from "./shared.mjs";

const KEY = [
  "/",
  "/tokens",
  "/docs/components/button",
  "/docs/components/toast",
  "/docs/components/data-table",
  "/docs/blocks/stat-card",
  "/docs/charts/donut-chart",
  "/docs/foundations/moments",
  "/showcase/team-overview",
  "/showcase/revenue-analytics",
  "/showcase/settings",
];
const update = process.argv.includes("--update");
const pages = only() ?? KEY;
const dir = (d) => (mkdirSync(`tests/visual/${d}`, { recursive: true }), `tests/visual/${d}`);
let changed = 0;

for (const theme of ["light", "dark"]) {
  const { browser, context } = await launch({ theme, reducedMotion: "reduce", gpu: false });
  const page = await context.newPage();
  for (const path of pages) {
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(600);
    // 3D and live charts move: hide the companion canvas.
    await page.addStyleTag({ content: "[data-slot=companion] canvas{visibility:hidden!important}" });
    const name = `${theme}${path.replace(/\//g, "_") || "_home"}.png`;
    const shot = PNG.sync.read(await page.screenshot({ fullPage: false }));
    const base = `${dir("baseline")}/${name}`;
    if (update || !existsSync(base)) {
      writeFileSync(base, PNG.sync.write(shot));
      process.stdout.write("u");
      continue;
    }
    const ref = PNG.sync.read(readFileSync(base));
    if (ref.width !== shot.width || ref.height !== shot.height) {
      changed++;
      console.log(`\nsize changed: ${name}`);
      continue;
    }
    const diff = new PNG({ width: ref.width, height: ref.height });
    const n = pixelmatch(ref.data, shot.data, diff.data, ref.width, ref.height, { threshold: 0.15 });
    const ratio = n / (ref.width * ref.height);
    if (ratio > 0.002) {
      changed++;
      writeFileSync(`${dir("diff")}/${name}`, PNG.sync.write(diff));
      console.log(`\n${name}: ${(ratio * 100).toFixed(2)} % changed → tests/visual/diff/${name}`);
    } else process.stdout.write(".");
  }
  await browser.close();
}
console.log(changed ? `\n${changed} screen(s) changed. Check the diffs, then run with --update if intended.` : "\nNo visual changes.");
process.exit(changed ? 1 : 0);
