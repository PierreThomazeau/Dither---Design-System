/* Performance budget: frames per second, long tasks and canvas count per page, GPU vs CPU dither.
   Budgets (env): QA_MIN_FPS (default 50), QA_MAX_LONG_MS (default 400), QA_MAX_CANVAS (default 80).
   Headless software rendering is slower than a real browser: run against a real GPU for absolute numbers,
   use it here to compare and catch regressions. Usage: pnpm qa:perf [--only /,/tokens] [--cpu] */
import { BASE, launch, only } from "./shared.mjs";

const MIN_FPS = Number(process.env.QA_MIN_FPS ?? 50);
const MAX_LONG = Number(process.env.QA_MAX_LONG_MS ?? 400);
const MAX_CANVAS = Number(process.env.QA_MAX_CANVAS ?? 80);
const PAGES = only() ?? ["/", "/tokens", "/docs/foundations/dither-pattern", "/docs/charts/heatmap-chart", "/docs/foundations/abstract-images", "/showcase/team-overview", "/showcase/live-analytics"];
const forceCpu = process.argv.includes("--cpu");

const { browser, context } = await launch({ gpu: true });
if (forceCpu) await context.addInitScript(() => (window.__ditherForceCpu = true));
const page = await context.newPage();
let broken = 0;
console.log(`dither renderer: ${forceCpu ? "CPU (forced)" : "GPU when available"}`);
console.log("page".padEnd(40), "fps".padStart(5), "long ms".padStart(9), "canvas".padStart(8));
for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(800);
  const m = await page.evaluate(async () => {
    let long = 0;
    const obs = new PerformanceObserver((l) => l.getEntries().forEach((e) => (long += e.duration)));
    obs.observe({ type: "longtask", buffered: false });
    const t0 = performance.now();
    let frames = 0;
    await new Promise((r) => {
      const f = () => {
        frames++;
        if (performance.now() - t0 < 2000) requestAnimationFrame(f);
        else r();
      };
      requestAnimationFrame(f);
    });
    obs.disconnect();
    return { fps: Math.round(frames / ((performance.now() - t0) / 1000)), long: Math.round(long), canvas: document.querySelectorAll("canvas").length };
  });
  const bad = m.fps < MIN_FPS || m.long > MAX_LONG || m.canvas > MAX_CANVAS;
  if (bad) broken++;
  console.log(path.padEnd(40), String(m.fps).padStart(5), String(m.long).padStart(9), String(m.canvas).padStart(8), bad ? "  over budget" : "");
}
await browser.close();
console.log(broken ? `\n${broken} page(s) over budget.` : "\nAll pages within budget.");
process.exit(broken ? 1 : 0);
