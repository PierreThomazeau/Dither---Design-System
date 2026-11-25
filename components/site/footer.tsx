import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { DitherFill } from "@/registry/dither/lib/dither";
import { gitConfig, version } from "@/lib/shared";

const columns = [
  {
    title: "Product",
    links: [
      ["Docs", "/docs"],
      ["Components", "/docs/components/button"],
      ["Charts", "/docs/charts"],
      ["Showcase", "/showcase"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Tokens", "/tokens"],
      ["Installation", "/docs/installation"],
      ["MCP server", "/docs/mcp"],
      ["llms.txt", "/llms.txt"],
    ],
  },
  {
    title: "Project",
    links: [
      ["License", "/license"],
      ["GitHub", `https://github.com/${gitConfig.user}/${gitConfig.repo}`],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-16 overflow-hidden border-t">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-24 opacity-70">
        <DitherFill shape="cloud" seed={11} fade="top" />
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">A React + Tailwind design system with a pixel dither texture as its signature.</p>
          <span className="font-mono text-xs text-muted-foreground">v{version}</span>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="flex flex-col gap-2 text-sm">
            <span className="font-mono text-xs text-muted-foreground uppercase">{c.title}</span>
            {c.links.map(([label, href]) => (
              <Link key={href} href={href} className="w-fit text-muted-foreground hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
