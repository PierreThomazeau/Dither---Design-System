import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { Logo } from "@/components/site/logo";
import { gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    links: [
      { text: "Docs", url: "/docs", active: "nested-url" },
      { text: "Tokens", url: "/tokens" },
      { text: "Showcase", url: "/showcase", active: "nested-url" },
      { text: "Pricing", url: "/pricing" },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
