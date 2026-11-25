# CLAUDE.md — Dither design system

## Where we are

- **Batch 1 (Setup): done.** Next.js 16 + Tailwind v4 + tokens + fonts + dark mode (Fumadocs theme toggle) + Fumadocs docs + shadcn registry + `/tokens` page + dither pattern.
- **Batch 2 (Core controls): done.** Button, Button Group, Input, Textarea, Select, Tabs, Checkbox, Radio Group, Switch, Toggle, Toggle Group, Badge, Kbd, Avatar (+ group), Separator, Tooltip, plus Label, Spinner and the shared Choice layout. Height rule checked on `/docs/components/height-rule` (all controls measured at 32 / 36 / 40 / 44).
- **Batch 3 (Surfaces & overlays): done.** Card (default / inset + `dither`, sizes, `CardInset`), Alert, Empty (incl. `dither`), Skeleton (pulsing dither), Dialog (muted footer strip), Sheet (floating, rounded-sheet), Drawer (vaul), Popover (default / inset), Dropdown Menu, Command (cmdk, palette with footer).
- **Batch 4 (Product blocks): done.** In `registry/dither/blocks/` (installed to `components/blocks/`): Stat Card (+ Sparkline), Gauge, Usage Meter, Workload Tile, Timeline, Onboarding Checklist, Announcement Bar, Chip, Kanban Card, Activity Heatmap. Docs under `/docs/blocks`.
- **Batch 5 (AI blocks): done.** Chat Composer, Message + Bubble, Reasoning Block, Agent Step, Source Card, Response Actions, Context Window, Starter Prompt, plus `lib/ai-glow.tsx` (grammar 8). Docs under `/docs/ai`.
- **Batch 6 (Signature charts): done.** 18 charts in `registry/dither/charts/` (installed to `components/charts/`) + `chart-kit.tsx` (ChartCard, PeriodButton, ChartLegend, ChartTag, SvgTag, DeltaChip, HtmlPlot, niceScale, axisTick, gridProps) and `chart-tooltip.tsx`. Docs under `/docs/charts` (one example each, from the Figma "Charts / Signature" board).
- Next: Figma round-trip (§7, now due: after batches 2, 4 and 6) or batch 7 (showcase), after review. Single-example pages remain (Badge, Separator, Tooltip, Dialog, Drawer, several blocks, all charts).

## Commands

- `pnpm dev` — site on http://localhost:3000 (`/`, `/docs`, `/tokens`)
- `pnpm lint` · `pnpm typecheck` · `pnpm build` (builds the registry, then Next)
- `pnpm registry:build` — `registry.json` → `public/r/*.json`
- `pnpm styles:build` — regenerates `styles/dither.css` and `styles/scopes.css` (never edit those by hand)

## Implementation notes (batch 1)

- Name change: the brief below was written as "Pierre's Design System (PDS)". The system is **Dither**: registry namespace `@dither`, raw token prefix `--dither-*` (renamed from `--pds-*`, values untouched).
- `styles/tokens.css`, `theme.css`, `tokens.json`: Figma exports. Don't hand-edit values.
- `styles/scopes.css` (generated): `.light` scope + alias redeclarations, so a light panel can sit in a dark page and vice versa (docs previews). The `dark:` variant is `&:where(.dark, .dark *):not(:where(.light, .light *))`.
- Fonts come from `next/font` (hashed names): `app/global.css` points `--dither-font-*` at `--font-manrope` / `--font-geist-mono`.
- `theme.css` uses `@theme inline`: Tailwind may not emit `--radius-*`, `--shadow-*`… as CSS variables. In inline styles, use the source variables (`--dither-radius-control`, `--dither-shadow-xs`, `--surface`).
- Dither texture: geometry in `registry/dither/lib/dither-tile.ts` (single source), React in `dither.tsx` (`DitherPattern`, `DitherFill`), CSS utilities `bg-dither[-fine|-bayer|-gradient]` (mask over `--dither-color`, default `--border-strong`; a mask clips children, so use a dedicated layer).
- Registry files import `@/registry/dither/...` so the shadcn CLI rewrites paths in the user's project.
- Docs template: frontmatter `status`, `variants`, `props`, `registry` drive the eyebrow + meta chips; `<Preview>` renders children in a light and a dark panel inside an inset shell.
- Fumadocs UI is the Base UI build (`fumadocs-ui` → `@fumadocs/base-ui`); docs chrome colours are mapped to Dither tokens in `app/global.css`.
- Docs examples live in `registry/dither/examples/<name>.tsx` (registered in `index.ts`). `<ComponentPreview name>` renders them in light + dark panels and shows their source, rewritten to user paths (`@/components/ui/...`). Examples must not hard-code ids (they render twice).
- Checkbox / Radio / Switch take `label`, `description`, `variant` ("default" | "box"; Figma "Type", renamed because `type` is the button attribute), `placement`, `invalid`. Checked = `brand`.
- Shared field styles (height, border, focus) are in `registry/dither/lib/control.ts`; Icon wrapper (16px, stroke 1.5) in `lib/icon.tsx`.
- Menu styles shared by Dropdown / Command (and later Context Menu, Menubar) live in `registry/dither/lib/menu.ts`: panels rounded-field, items 36px rounded-control-min.
- `<ComponentPreview stacked>` puts the light panel above the dark one, for wide components (cards, alerts, empty states).
- CSS `bg-dither-gradient` has a fixed 256px tile: to fade over a specific height, use `<DitherFill variant="gradient" gradientHeight={h} />`.
- Status colours (no warning token exists): good / normal = `positive` (Usage Meter normal = `informative`, as in Figma), warning = `chart-1`, critical / error = `destructive`.
- Remaining capacity is always dither (`bg-dither-fine` layer or `DitherPattern` in SVG): gauge arc, usage meter, checklist and subtask bars.
- AI glow (`<AiGlow />`): wash + `bg-dither-fine` tinted by a gradient (`--dither-color: transparent` so only the gradient shows). Pink = `chart-3` light / `chart-5` dark. Model names in examples are generic ("Atlas 2").
- Charts: Recharts only for Forecast Line, Stacked Area, Combo, Scatter, Response Curve (client); the 13 others are HTML/SVG (server-safe, stretch naturally). Chart components render the plot only; wrap them in `ChartCard` + `ChartLegend`. Recharts paints use `chartColor` (CSS vars); dither inside Recharts = `<defs><DitherPattern/></defs>` + `fill="url(#id)"`. Keep loops that accumulate (offsets, running totals) in pure helpers outside the component: the React Compiler lint rejects reassignment inside render callbacks.
- Treemap labels sit in a `bg-surface/90` chip so they stay readable on any chart colour in both modes.
- Radix portals (Select content, Tooltip) render in `<body>`, so in docs previews they follow the site theme, not the panel.
- Showcase screens in Figma (file `BASedQLpd5kssdxNmiOlVC`, node `34099:34828`) are a visual reference only (clean-room rule).

---

# Dither — code project brief

You are building ****Dither**** in code: a React component library, its documentation site and, later, a pricing page to sell a Pro tier (model: uiarc.dev). Figma is the design source. This file is the brief. Read it fully before writing code.

## 0. Non-negotiable rules

1. **Clean-room build.** The original Figma file was started from a paid kit (shadcndesign.com) whose license forbids reselling derivative kits. Never copy files, layer structures or assets from that kit. Build every component from **shadcn/ui (MIT)** source plus the tokens and specs in this brief. Everything here (tokens, grammar, signature components) is Pierre's own work.
2. **Tokens are the source of truth.** Use the CSS variables from `tokens.css` and the Tailwind utilities from `theme.css`. No hardcoded hex values, radius or font sizes in components.
3. **Light and dark from day one.** Every component must work with `.dark` on `<html>`.
4. **Copy is generic business / product SaaS.** No marketing-mix, MMM, media-buying or employer-specific wording. Use names like Revenue, Reports, Projects, Teams, API calls, Northwind Studio, Lumen Finance, Atlas.
5. **Small, reviewable steps.** One batch at a time (section 6). After each batch: run lint + typecheck, show the docs page, wait for review.

## 1. Stack

- Next.js (App Router, TypeScript, React Server Components where possible)
- Tailwind CSS v4 (`@theme inline`), `tw-animate-css`
- shadcn/ui CLI and Radix primitives as the base for every primitive component
- Fumadocs for documentation (MDX, live preview + code tabs)
- Recharts for charts, plus a custom SVG `<pattern>` for the dither texture
- Fonts via `next/font/google`: **Manrope** (sans and headings), **Geist Mono** (numbers, IDs, metadata, tags)
- Icons: **Hugeicons** (`@hugeicons/react` + `@hugeicons/core-free-icons`), stroke 1.5, size 16 by default. Not Lucide.
- Distribution: a **shadcn registry** (`registry.json`, `public/r/*.json`), so components install with `npx shadcn add @dither/<name>`. Free items public; Pro items behind an auth token (later batch).
- Package manager: pnpm

Suggested structure:

```
app/                 site (landing, docs, showcase, pricing)
content/docs/        MDX docs, one page per component
registry/dither/ui/     primitives (button, input, …)
registry/dither/blocks/ composed blocks (stat-card, chat-composer, charts…)
registry/dither/lib/    utils (cn, dither pattern)
styles/              tokens.css, theme.css, globals.css
```

## 2. Tokens (already exported)

Files in this folder:

- `tokens.json`: structured export of the Figma variables (colors light/dark, radius, sizes, spacing, type, shadows, dither spec).
- `tokens.css`: CSS variables. Semantic colors are on `:root` and `.dark`. Raw scales are prefixed `--dither-*`. Includes shadcn compatibility aliases (`--card`, `--popover`, `--muted`, `--input`, `--secondary`).
- `theme.css`: Tailwind v4 `@theme inline` mapping, so `bg-surface`, `text-muted-foreground`, `border-border-strong`, `rounded-control`, `h-control`, `shadow-button-primary` and so on work.

`globals.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./tokens.css";
@import "./theme.css";
@custom-variant dark (&:is(.dark *));
```

Key values (do not change them; they come from Figma):

| Token | Value |
|---|---|
| Neutral palette | **woodsmoke** 50–950 (#fafafa … #0b0b0b), neutral grey, *not* zinc |
| `surface` / `background` / `background-muted` | #fff / #fafafa / #f5f5f5 (dark: #131313 / #0b0b0b / #272727) |
| `primary` | #272727 (dark #f5f5f5) |
| `accent` (brand) | indigo #4f46e5 (dark #6366f1), exposed as `brand` to avoid clashing with shadcn's `accent` |
| Control height | xs 32 · sm 36 · **default 40** · lg 44 · xl 48 |
| Radius | control **12** · control-min 16 (menu items) · field 20 (textarea, dropdown panels) · surface 24 (cards) · body 28 · sheet 32 · display 40 · micro 6 (checkbox) · hairline 4 |
| Control padding-x | 16 |
| Font | Manrope 400/500/600 · Geist Mono 400/500 |
| Focus ring | 3px, `ring` at 50% (`shadow-focus`) |

**Rule: every control has the same height at the same size.** A default Button, Input, Select, Combobox, Date picker, Toggle, Tabs list and Input group are all 40px. sm 36, lg 44, xs 32.

## 3. Design grammar (what makes Dither different from stock shadcn)

Implement these as reusable classes or components, not one-offs.

1. **Tactile primary button.** `variant="default"`: bg `primary`, a linear-gradient overlay (white 8% → 0% top to bottom; hover 14% → 3%; pressed reversed 0 → 5%) and `shadow-button-primary` (all inner shadows, nothing bleeds outside the box). Pressed uses `shadow-button-primary-pressed`, no drop shadow. Focus adds the 3px focus ring.
2. **Two-tone surfaces ("Inset").** An outer shell in `background-muted` with `p-1` (4px) and `rounded-surface`, holding an inner `surface` panel with `rounded-[calc(var(--radius-surface)-4px)]`, a 1px `border` and `shadow-xs`. Used for Card `variant="inset"`, the Chat Composer footer, preview canvases and popovers. This is the signature layout.
3. **Button group with dividers.** One container (pill radius = `rounded-control`, `p-0.5`, 1px border for outline, `bg-primary` for the solid variant, `bg-background-muted` for secondary) holding ghost `sm` buttons with leading icons, separated by short vertical separators (16px tall, `border` color; 20% `primary-foreground` on the solid variant). Total height = 40. Vertical orientation uses `rounded-field`.
4. **Tabs sizes.** Tabs list xs 32 / sm 36 / default 40 / lg 44, padding 4, triggers h-24/28/32/36 with `rounded-control` and `px-2 / px-3 / px-3 / px-4`. Active trigger: `surface` + `shadow-tabs-active`.
5. **Mono for data.** All numbers in KPIs, tables, charts, IDs, timestamps and tags use `font-mono tabular`. Big KPI values: Manrope semibold.
6. **Pixel dither texture** (brand identity). A vector dot grid in `border-strong`: 2px squares on a 6px grid, odd rows offset by 3px. Variants: regular, fine (1.5px / 4px), bayer (4×4 ordered), gradient (density fading top → bottom). Ship it as `<DitherPattern id variant />` (an SVG `<pattern>`) plus a `.bg-dither` utility (an inline SVG data-URI using `currentColor` with `color: var(--border-strong)`). Use it for remaining capacity, chart tracks, forecast ranges, empty states and skeletons.

```tsx
// (spec sketch — implemented in registry/dither/lib/dither-tile.ts + dither.tsx)
export function DitherPattern({ id = "dither", variant = "regular" }: { id?: string; variant?: "regular" | "fine" }) {
  const c = variant === "fine" ? 4 : 6, d = variant === "fine" ? 1.5 : 2, o = c / 2;
  return (
    <pattern id={id} width={c} height={c * 2} patternUnits="userSpaceOnUse">
      <rect x={0} y={0} width={d} height={d} fill="var(--border-strong)" />
      <rect x={o} y={c} width={d} height={d} fill="var(--border-strong)" />
    </pattern>
  );
}
```

7. **Signature charts** (Recharts and custom SVG), shared rules:
   - Card header: title `text-lg semibold`, subtitle `text-sm muted-foreground`, an outline `sm` button on the right (period selector).
   - Gridlines dotted (`stroke-dasharray="1 3"`, `border` color). Axis labels `font-mono text-xs muted-foreground`.
   - Tracks and remaining totals in **dither**. Values as solid shapes. **One highlighted series in `chart-1`**, the others neutral (`foreground` at 85% or `border-strong`).
   - Annotations as **black tags**: `bg-foreground text-primary-foreground font-mono text-xs rounded-[4px] px-1.5`, uppercase (`TARGET 70%`, `TODAY`, `ALERT 90%`, `BREAK-EVEN 1.0x`, `SATURATION 16%`). Target lines: solid 1px `foreground`.
   - Delta chip: `surface`, 1px border, `rounded-[6px]`, a 6px colored square + mono text (`+12 pts`).
   - Legends use 10px squares (`rounded-[2px]`); the dither entry uses a mini dither swatch.
   - Charts stretch to their container width.
8. **Copilot / AI surfaces** use a subtle dithered gradient header (indigo → pink at low opacity over the dither), never a flat purple block.

## 4. Component inventory (from the Figma file)

Props listed as `name[variants]`, `name?` = boolean, `name:text`, `:slot` = children.

**Primitives (shadcn base, restyled)**
- Button: Variant[default|outline|secondary|destructive|ghost|link], Size[default|xs|sm|lg|icon|icon-xs|icon-sm|icon-lg], State[Default|Hover|Focus|Loading|Disabled|Pressed], left/right icon, Kbd group
- Button Group: Orientation[Horizontal|Vertical], Variant[outline|default|secondary] (grammar 3)
- Input, Textarea, Input Group (inline / block addons), Input OTP, Select, Combobox (single / multiple chips), Date Picker, Time Picker
- Checkbox, Radio Group, Switch: Type[Default|Box], Control Placement[Start|End], label + description, Invalid / Disabled
- Toggle: Variant[default|outline], Size[default|sm|lg]; Toggle Group
- Tabs: Variant[Default|Line], Orientation[Default|Vertical], Size[xs|sm|default|lg] (grammar 4)
- Badge, Kbd, Avatar (Image / Fallback / Icon, xl…xs), Avatar Group, Separator, Skeleton, Spinner, Progress, Slider, Tooltip, Popover, Hover Card
- Accordion, Collapsible, Alert, Alert Dialog, Dialog, Sheet, Drawer, Dropdown Menu, Context Menu, Menubar, Navigation Menu, Command, Breadcrumb, Pagination, Scroll Area, Resizable, Table, Data Table, Calendar, Carousel, Empty, Field, Item, Label, Sidebar
- Card: Size[default|sm], Style[Default|Inset], header (title, description, action), content, footer, image

**Product blocks (Dither originals)**
- Stat Card: Label, Value, Delta, Caption, Trend[Up|Down|Neutral], sparkline, dither corner (gradient variant)
- Workload Tile: Count, Title, Due, Status[Backlog|Not started|In progress|Done]
- Activity Row, Timeline Item (Status[Default|Success|Warning|Error]), Onboarding Checklist, Announcement Bar (Variant[Info|Promo|Warning], dismissible), Chip (Removable, Selected), Usage Meter (Status[Normal|Warning|Critical]), Gauge, Sparkline, Activity Heatmap, Live Visitors, Presence Bar, Kanban Card, Calendar Event
- AI: Chat Composer (Placeholder, Mode, Model, Show Tools, Show Footer; inset footer), Reasoning Block (Collapsed|Expanded), Agent Step (Done|Running|Queued), Source Card, Response Actions, Context Window, Starter Prompt, AI Recap Card, Bubble, Message, Marker, Message Scroller

**Signature charts** (grammar 7): Progress Bars, Capacity Bar, Columns (planned vs shipped), Ranking (with break-even), Forecast Line (dither confidence band + TODAY), Stacked Area, Combo (bars + line, dual axis), Donut (gapped arcs, unallocated in dither), Gauge (half ring), Bullet, Waterfall, Funnel (drop-off in dither), Split Bar (diverging), Histogram, Scatter (dither opportunity zone), Response Curve (dither saturation zone), Heatmap (empty cells in dither), Treemap (unassigned tile in dither).

## 5. Docs page template (one per component)

Mirror the Figma doc layout:
1. Eyebrow `DITHER / COMPONENTS` (mono xs, muted), title, one-line description, meta chips (Stable · N variants · N props · Light & Dark).
2. **Preview**: an inset shell (grammar 2) with a light and a dark panel side by side, each rendering the live component; a code tab under it.
3. **Installation**: `npx shadcn add @dither/<name>`.
4. **Props** table (name, type, values / default).
5. **Examples**: sizes, states, composition.
6. Footer: `Dither · <Name>`, version.

## 6. Build order (batches)

1. **Setup**: Next.js + Tailwind v4 + tokens + fonts + dark mode toggle + Fumadocs skeleton + registry config. A `/tokens` page showing colors, radius, sizes, type and the dither variants.
2. **Core controls**: Button (tactile primary), Button Group, Input, Textarea, Select, Tabs (4 sizes), Checkbox, Radio, Switch, Toggle, Badge, Kbd, Avatar, Separator, Tooltip. Verify the 40px height rule side by side on one docs page.
3. **Surfaces & overlays**: Card (Default + Inset), Dialog, Sheet, Drawer, Popover, Dropdown, Command, Alert, Empty, Skeleton (dither).
4. **Product blocks**: Stat Card, Workload Tile, Timeline, Onboarding Checklist, Usage Meter, Announcement Bar, Chip, Kanban Card, Activity Heatmap, Gauge.
5. **AI blocks**: Chat Composer, Reasoning Block, Agent Step, Source Card, Response Actions, Context Window, Starter Prompt, Message / Bubble.
6. **Signature charts**: dither pattern first, then the 18 charts.
7. **Showcase**: rebuild the example screens (Team overview, Finance overview, Revenue analytics, Kanban board, Copilot chat, Settings, Invoices, Inbox, Command palette, Planning, Live analytics, Onboarding).
8. **Marketing site**: landing, showcase, pricing (Free / Pro yearly / Pro lifetime / Team), FAQ, license, `llms.txt`, MCP server.
9. **Pro distribution**: private registry with license keys, checkout (Polar or Lemon Squeezy for EU VAT).

## 7. Figma round-trip (after batches 2, 4 and 6)

Use the Figma MCP server to rebuild the library in a **new, empty Figma file**, from the code:
1. Create variable collections from `tokens.json`: Primitives (woodsmoke, radius, spacing), Tokens (radius, size, inset, gap), Mode (Light / Dark semantic colors). Set scopes explicitly.
2. Create text styles (Manrope / Geist Mono scale) and effect styles (shadows, focus, button-primary).
3. Build each component as a real component set with variants and properties that match the React props 1:1 (same names), bound to the variables. No detached hex values.
4. Recreate the doc page layout from section 5.
5. Never import or copy nodes from the old file.

## 8. Definition of done (per component)

- Uses only tokens; works in light and dark; keyboard and focus states; 40px rule respected.
- Docs page with preview, code, props table and at least two examples.
- Registry entry builds (`pnpm registry:build`).
- `pnpm lint && pnpm typecheck` pass.
