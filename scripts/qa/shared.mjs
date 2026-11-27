/* Shared helpers for the QA scripts (a11y, visual, perf).
   QA_URL (default http://localhost:3000) and DITHER_ACCESS_CODE (default "dither", the dev fallback). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

export const BASE = process.env.QA_URL ?? "http://localhost:3000";
export const CODE = process.env.DITHER_ACCESS_CODE ?? "dither";

/** Every docs page (from content/docs), the tokens page, the showcase screens and the landing. */
export function allPages() {
  const pages = ["/", "/tokens", "/showcase"];
  const walk = (dir) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith(".mdx")) pages.push("/" + p.replace(/^content\//, "").replace(/\.mdx$/, "").replace(/\/index$/, ""));
    }
  };
  walk("content/docs");
  const screens = readFileSync("components/showcase/screens.ts", "utf8").matchAll(/slug: "([^"]+)"/g);
  for (const m of screens) pages.push(`/showcase/${m[1]}`);
  return pages;
}

export async function launch({ reducedMotion = "no-preference", theme = "light", gpu = true } = {}) {
  const args = gpu ? ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] : [];
  const browser = await chromium.launch({ args });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: theme,
    reducedMotion,
    extraHTTPHeaders: { authorization: `Bearer ${CODE}` },
  });
  await context.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
      localStorage.removeItem("dither-companion-appearance");
    } catch {}
  }, theme);
  return { browser, context };
}

export function only() {
  const i = process.argv.indexOf("--only");
  return i > 0 ? process.argv[i + 1].split(",") : null;
}
