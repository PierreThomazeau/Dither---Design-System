/**
 * Plans and what each one includes. Single source for the landing, /pricing and /license.
 * Prices are placeholders until checkout (batch 9) is set up.
 */
export type PlanId = "free" | "pro-yearly" | "pro-lifetime" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  description: string;
  cta: string;
  highlight?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    cadence: "forever",
    description: "The foundations and every primitive, MIT licensed.",
    cta: "Read the docs",
    features: ["Tokens, theme and dither texture", "30 UI primitives", "Chart kit", "Docs and examples", "Community support"],
  },
  {
    id: "pro-yearly",
    name: "Pro",
    price: "€99",
    cadence: "per year",
    description: "Everything, with a year of updates.",
    cta: "Get Pro",
    highlight: true,
    features: ["Everything in Free", "Product and AI blocks", "18 signature charts", "12 showcase screens as templates", "Figma library", "Private registry access", "12 months of updates"],
  },
  {
    id: "pro-lifetime",
    name: "Pro lifetime",
    price: "€249",
    cadence: "one-time",
    description: "Pay once, get updates for as long as Dither lives.",
    cta: "Get lifetime",
    features: ["Everything in Pro", "Lifetime updates", "Early access to new blocks"],
  },
  {
    id: "team",
    name: "Team",
    price: "€399",
    cadence: "per year · up to 10 seats",
    description: "Pro for a whole product team.",
    cta: "Get Team",
    features: ["Everything in Pro", "Up to 10 seats", "One registry token per member", "Priority support", "Invoice and VAT handling"],
  },
];

/** Comparison rows: [label, free, pro, lifetime, team]. */
export const comparison: [string, boolean | string, boolean | string, boolean | string, boolean | string][] = [
  ["Tokens, theme, dither", true, true, true, true],
  ["UI primitives", "30", "30", "30", "30"],
  ["Chart kit", true, true, true, true],
  ["Product blocks", false, true, true, true],
  ["AI blocks", false, true, true, true],
  ["Signature charts", false, "18", "18", "18"],
  ["Showcase screens", false, "12", "12", "12"],
  ["Figma library", false, true, true, true],
  ["Updates", "Public releases", "12 months", "Lifetime", "12 months"],
  ["Seats", "Unlimited", "1", "1", "10"],
  ["Support", "Community", "Email", "Email", "Priority"],
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Is Dither a package I install from npm?",
    a: "No. Like shadcn/ui, components are copied into your project with `npx shadcn add @dither/<name>`. The code is yours to read and change.",
  },
  {
    q: "What do I need to use it?",
    a: "React 19, Tailwind CSS v4 and a `components.json` (run `npx shadcn init`). Next.js is the reference setup, but any React framework with Tailwind v4 works.",
  },
  {
    q: "What is free and what is Pro?",
    a: "Tokens, the dither texture, all UI primitives and the chart kit are free under MIT. Product blocks, AI blocks, the signature charts, the showcase screens and the Figma library are Pro.",
  },
  {
    q: "Can I use Pro in client projects?",
    a: "Yes, in unlimited end products for you or your clients. You can’t resell or redistribute Dither itself, as a kit, template or library.",
  },
  {
    q: "Does it work in dark mode?",
    a: "Every component and screen is built for light and dark from the start, with `.dark` on `<html>`.",
  },
  {
    q: "What happens when my Pro year ends?",
    a: "You keep everything you installed. You stop receiving new versions until you renew.",
  },
  {
    q: "Do you charge VAT?",
    a: "Prices are shown before tax. VAT is handled at checkout depending on your country; businesses with a VAT number are reverse-charged.",
  },
];
