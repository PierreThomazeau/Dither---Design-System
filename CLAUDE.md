# CLAUDE.md — Dither design system

## Where we are

- **Batch 1 (Setup): done.** Next.js 16 + Tailwind v4 + tokens + fonts + dark mode (Fumadocs theme toggle) + Fumadocs docs + shadcn registry + `/tokens` page + dither pattern.
- **Batch 2 (Core controls): done.** Button, Button Group, Input, Textarea, Select, Tabs, Checkbox, Radio Group, Switch, Toggle, Toggle Group, Badge, Kbd, Avatar (+ group), Separator, Tooltip, plus Label, Spinner and the shared Choice layout. Height rule checked on `/docs/components/height-rule` (all controls measured at 32 / 36 / 40 / 44).
- **Batch 3 (Surfaces & overlays): done.** Card (default / inset + `dither`, sizes, `CardInset`), Alert, Empty (incl. `dither`), Skeleton (pulsing dither), Dialog (muted footer strip), Sheet (floating, rounded-sheet), Drawer (vaul), Popover (default / inset), Dropdown Menu, Command (cmdk, palette with footer).
- **Batch 4 (Product blocks): done.** In `registry/dither/blocks/` (installed to `components/blocks/`): Stat Card (+ Sparkline), Gauge, Usage Meter, Workload Tile, Timeline, Onboarding Checklist, Announcement Bar, Chip, Kanban Card, Activity Heatmap. Docs under `/docs/blocks`.
- **Batch 5 (AI blocks): done.** Chat Composer, Message + Bubble, Reasoning Block, Agent Step, Source Card, Response Actions, Context Window, Starter Prompt, plus `lib/ai-glow.tsx` (grammar 8). Docs under `/docs/ai`.
- **Batch 6 (Signature charts): done.** 18 charts in `registry/dither/charts/` (installed to `components/charts/`) + `chart-kit.tsx` (ChartCard, PeriodButton, ChartLegend, ChartTag, SvgTag, DeltaChip, HtmlPlot, niceScale, axisTick, gridProps) and `chart-tooltip.tsx`. Docs under `/docs/charts` (one example each, from the Figma "Charts / Signature" board).
- **Batch 7 (Showcase): done.** `/showcase` index (in the home layout) + 12 full-screen screens under `app/(app)/showcase/<slug>` sharing `components/showcase/app-shell.tsx` (collapsible sidebar, raised content panel, breadcrumb, theme toggle). Workspaces in `components/showcase/nav.ts` (Northwind Studio, Lumen Finance, Atlas Copilot). New primitive: Table (+ docs). Fixed on the way: Button `asChild` (Slot got two children), menu items under cmdk all at 50% opacity (cmdk sets `data-disabled="false"`).
- **Batch 8 (Marketing site): done.** Landing (`app/(home)/page.tsx`, live components bento, counts read from `registry.json`, FAQ from `components/site/faq.ts`), `/license` (MIT, same text as `LICENSE`), site footer, Showcase nav link. MCP server at `/mcp` (`app/mcp/route.ts`: stateless JSON-RPC over HTTP, tools list_components / get_component / get_install_command / get_tokens) + docs page `/docs/mcp`. `llms.txt` / `llms-full.txt` come from Fumadocs.
- **Decision (Pierre): Dither is free for now.** No Pro tier, no pricing page: everything (primitives, blocks, AI blocks, charts, showcase) is MIT. Batch 9 (Pro distribution) is on hold; sections of the brief about a Pro tier are out of scope until Pierre says otherwise.
- **Motion (Pierre's request): done.** `motion` library + `styles/motion.css` (`--ease-liquid`, `--ease-out-soft`, `--duration-liquid`, keyframes, reduced-motion kill switch) + `lib/motion.ts` (springs). Liquid Switch (stretching thumb + trailing drop merged by a gooey SVG filter, stretch only after first toggle), Tabs with a sliding `layoutId` indicator, primary Button with a cursor-following `bg-dither-glow` that crawls on hover and a squash on press (Button is now a client component), liquid pop on Checkbox / Radio / Chip, liquid easing on overlays. Interactive dither: first a repelling canvas field (since replaced, see "Every DitherFill animated"). Docs: `/docs/foundations/motion`.
- **Figma round-trip v1: done.** New file `Gtwj4lWs5EXnkTdYjTqmXx` ("Dither — Design System (from code)"), built from code only. Variables: Primitives (62, hidden), Tokens (48: radius / size / inset / gap, aliased to primitives, CSS code syntax `var(--dither-…)`), Mode (24 semantic colours, Light / Dark, aliased, scoped, `var(--…)`). Styles: 21 text (Body, Label, Heading, Mono), 13 effects (shadows, Button/primary inner shadows, Focus). Components bound to variables: Button (Variant × Size, 24; Label, Show Left/Right Icon, Left/Right Icon swap, Loading), Badge (8), Switch (Checked × Size × Invalid, 8), Switch Field (Variant × Placement; Label, Description, Show Description), Input (Size × Invalid; Placeholder, Left Icon), Card (Variant × Size; Title, Description, Show Action, Show Footer), 6 icons. Pages: Cover, Foundations specimen (light + dark), one page per component, Icons. Not yet in Figma: the other ~60 components, per-component doc pages (§5 layout), motion (Figma can't express it).
- **Organic dither (Pierre's request): done.** `registry/dither/lib/organic-field.ts` (fbm value noise → density per shape, Bayer 8×8 threshold) + `organic-dither.tsx` (canvas, dots 2px on a 4px grid (see One dot size), slow drift, pointer clears a soft hole, pauses off-screen, still under reduced motion, optional gradient `tint` of custom properties). `DitherFill shape="cloud|scatter|halo|flow"` uses it. Applied to every surface: landing hero (scatter) and grammar tiles, showcase index, footer (cloud), Card `dither` (cloud), Empty `dither` (halo: centre always empty), Stat Card `gradient` (scatter), onboarding, AiGlow (cloud tinted brand → pink, 35%). Data marks (tracks, remaining capacity, legends, skeleton) keep the regular tile. Docs: foundations/dither-pattern. Figma `Pattern / Dither` still the old tile.
- **Figma round-trip v2: done.** Added component sets: Button Icon, Checkbox (+ Field), Radio (+ Field), Button Group, Textarea, Select (+ Item, Content), Tabs, Toggle, Toggle Group, Kbd, Avatar (+ Group), Separator, Tooltip, Alert, Chip, Usage Meter, Stat Card, Empty, Timeline Item, Agent Step, Message; patterns `Pattern / Dither` (tile, for data marks) and `Pattern / Organic` (cloud / scatter / halo / flow, generated from `organic-field.ts`, seed 7). Empty `Dither=true` = organic halo, Stat Card `Dither=true` = scatter corner. One §5 doc frame (`Doc / <Name>`: eyebrow, title, chips, inset light/dark preview, install, props from the MDX TypeTable, examples, footer) next to each of the 24 component sets. Figma gotcha: instances of a component whose fill is variable-bound with a custom opacity come out at 100%: copy the main component's fill opacity onto the instance.
- **Rounder + softer (Pierre's request): done.** Radius tokens changed by Pierre: control 9999 (pill: buttons, inputs, tabs, toggles, selects), control-min 20, field 24, surface 32, body 36, sheet 40, display 48 (tokens.css + tokens.json; boxy elements that used rounded-control moved to rounded-control-min). Static `organic` tile (`organicTile` in dither-tile.ts, periodic noise, seamless 96px; noise primitives now live in dither-tile.ts and organic-field.ts imports them, because scripts/build-dither-css.ts runs in plain Node without the `@/` alias) → `bg-dither-organic` / `DitherPattern variant="organic"`, used by every chart and block track. `ChartCard` has a `ChartSpotlight` (faint neutral organic dither under the plot, follows the pointer; no colour). Colour blur only where colour already was (AI glow); the hero only fades. `DitherFill` organic: `fade` (soft masks) and `glow` (blurred colour blobs, slow `glow-float`). AiGlow = tinted organic cloud only (colour in the dots), masked out softly. Primary Button hover = soft brand light + small organic dither in a radial spot (no grid). Figma not updated yet for any of this.
- **Showcase shell v2 (Pierre):** sidebar and body share `bg-background` (no panel), white cards stand out; the shell is `h-dvh`, the top bar stays put and only `<main>` scrolls, `PageHeader` is sticky at the top of it (covers the parent padding, opaque bg-background like the top bar, then a 48px `ProgressiveBlur` under it: stacked backdrop-filter layers 0.5 → 16px with narrowing masks); top bar without divider: round sidebar toggle, breadcrumb in a white pill chip, borderless white pill actions. Sparkline `dither` uses the organic tile.
- **Lighter borders (Pierre):** `--border` #e6e6e6 → #efefef (light), #404040 → #222222 (dark); border-strong unchanged.
- **No shadows on controls (Pierre):** every outline button / button group / toggle / field / period button has a 1px border and no shadow; the showcase top bar uses the same bordered outline buttons and a bordered breadcrumb chip. Surfaces (cards, alerts, popovers) keep shadow-xs.
- **Polish round (Pierre):** ChartSpotlight removed (no hover dither on charts). `DitherPattern` (now `lib/dither-pattern.tsx`, client) scales its pattern back when the SVG is stretched (dots same size in donut / gauges as elsewhere); organic tile twinkles (1 dot in 5, `.dither-twinkle` / CSS inside the mask SVG, off under reduced motion). Skeleton = organic tile + `bg-dither-sweep` band animated by `animate-dither-sweep`. ProgressiveBlur only shows once `<main>` has scrolled. Chat composer pickers on a bordered surface pill. OrganicDither pointer = fading noisy wake that stirs the texture (listens on the DitherFill wrapper's parent). Showcase index cards show previews `public/showcase/<slug>-{light,dark}.webp` (720×450, regenerate with a Playwright capture of each screen at 1440×900 after visual changes).
- **Less "generated" look (Pierre):** no mono uppercase labels outside data: eyebrows, preview Light/Dark labels, footer titles, select / command group headings, chart captions are Manrope, sentence case. Badge is a pill (h-6, rounded-full); `tag` = black pill, no mono/uppercase. ChartTag / SvgTag / DeltaChip are pills in Manrope with tabular numbers. Hand-made chips replaced by `Badge` (docs meta chips, Live, showcase numbers, kanban tag, planning Today, gauge alert → ChartTag). ProgressBars with a target keep a right gutter (pr-24) for the tag.
- **Logo (Pierre):** `components/site/logo.tsx` draws Pierre's mark (cross with open centre over a 50% square frame) in currentColor; source files `public/brand/dither-logo-{dark,light}.svg`; favicon `app/icon.svg` switches with prefers-color-scheme.
- **Deployed (Pierre):** https://dither-design-system.vercel.app (Vercel, production from `main`). `siteUrl` defaults to it; installation and MCP docs use it for the registry (`/r/{name}.json`) and `/mcp`. Not reachable from the cloud dev container (host not allowed).
- **Motion system v2 (Pierre):** open 200ms ease-out, close 100ms ease-in (`--motion-open-*` / `--motion-close-*` in styles/motion.css). `motion-overlay` (keyframes, from data-state incl. tooltip delayed/instant-open) on Dialog, Sheet, Drawer overlay, Popover, Dropdown, Select, Tooltip; `motion-transition` for transitions. No per-component open/close durations. New `ui/side-panel.tsx` (Provider / Layout / Inset / SidePanel / Header / Content / Footer / Trigger / Close): pushes the content (animated column width), full-height card `rounded-surface bg-background-muted` (dark: surface), Escape closes, inert when closed. AppShell takes `panel` (+ top-bar toggle); `<main>` is a `@container`, so screens with a panel lay out with container queries (`@xl` / `@3xl` / `@5xl`), not viewport breakpoints; Team overview "Details" opens Sprint 24. Docs: components/side-panel, foundations/motion.
- **Icons (Pierre):** Hugeicons only. The animated icon package (@unlocalhosted/dither-icons) was tried and removed.
- **Every DitherFill animated (Pierre):** `OrganicDither` takes `tile` (regular / fine / bayer / gradient / organic): the tile's exact geometry, thinned and refilled by drifting value noise, with the same pointer wake as the shapes. `DitherFill` without `shape` renders it by default (`static` = plain SVG). `lib/dither-field.tsx` (old repelling field) removed; `interactive` is a no-op kept for compatibility.
- **One living dither everywhere (Pierre):** no twinkle, no static tile in components. Every former `bg-dither-*` layer (chart tracks / bars / cells, block tracks, legend swatches, skeleton, showcase spans) is a `DitherFill variant="organic"` (swatches `fine`); `DitherPattern` (SVG: donut, gauges, Recharts bands) animates its own dots in a 192-unit block with periodic noise (seamless) + pointer wake mapped through `getScreenCTM`. All canvases and patterns share one rAF loop (`runDitherStep` / `stopDitherStep` in organic-dither.tsx). Skeleton = muted block + DitherFill. `bg-dither-*` utilities kept only for non-canvas contexts.
- **AI Companion (Pierre):** `registry/dither/blocks/companion.tsx` (client, `three` loaded with a dynamic import, modern API: `SRGBColorSpace`, `NeutralToneMapping`, light intensities × π, full dispose). Superellipsoid body, default clear glass in a neutral tint (Pierre) (`--background-muted`, read live from CSS, lifted on dark backgrounds; neutral grey wave studio env). Click / Enter / Space = spin + Popover picker (`customizable`): colour neutral / chart-1…5, material plastic / ceramic / frosted / clear / gel / chrome / brushed / gold / iridescent (settings from Pierre's materiaux.js, ported to r170); choice remembered in localStorage (`dither-companion-appearance`), controlled via `material` / `color`. Glass: lit core inside + page-coloured backdrop seen only by the transmission pass (colorWrite toggled in onBeforeRender, canvas stays transparent). Faces front, LED screen with the face drawn crisp → 80×80 → Bayer 4×4 dither. `status` (idle / listening / thinking / responding / done / error) drives mood, talking and body tint (token mixed into the background: listening `positive`, thinking `brand`, slow / stalled / error `destructive`); thinking longer than `slowAfter` (4 s, wall clock) → `slow` (bored, sighs), 2.2× → `stalled` (lazy, yawns); `done` = one rainbow band up the body (shader via `onBeforeCompile`) + bravo + "DONE" on the screen. Moods: happy, proud, excited, impatient, sleepy, resting, bored, disdainful, lazy, thinking, sad, drawn in a dry sketch style (Pierre: less cute, after a 35-expression sheet): thin vertical eye strokes, flat brow bars on the lid line (T T; keys brow / browY / browTilt / browSkew), ∩ arcs for pleased / confident, small dash mouths, no cheeks. Canvas overflows its box (150% × 200%, anchored bottom) so bounces never clip; the box = footprint. Placement (Pierre): `CompanionLayer` renders ONE companion that glides (translate / size, 500ms) to the latest mounted `CompanionAnchor`: big in the middle of an empty chat, then on top of the answer being written; never remounted. Not on the composer any more (`ChatComposer` only gained `onValueChange`). Side Panel has views (`SidePanelTrigger view="…"`, `toggleView`); AppShell has an "AI assistant" button on every showcase screen (`components/showcase/assistant-panel.tsx`: simulated answers, "deep" = slow, "live" = error; mounted on first open and kept). Copilot screen: `CopilotChat` (layer + shared simulated status) with an anchor on the assistant message. Docs: `/docs/ai/companion`.
- **Chart palette aligned (Pierre):** dark chart colours are the light hues, a little lighter: chart-1 #38bdf8, chart-2 #4f46e5, chart-3 #c084fc, chart-4 #f97316, chart-5 #0d9488 (tokens.css + tokens.json).
- **Abstract images (Pierre):** `registry/dither/lib/dither-image.tsx` (`DitherImage`, `renderDitherImage`, `abstractPresets`): 8 abstract compositions (ember, lagoon, dusk, aurora, prism, nebula, tide, flare) painted from tokens (chart / brand / status colours; ground = darkest or lightest neutral of the theme) as blurred wavy bands + radial glows at grid resolution (one sample per cell), then rasterised straight into ImageData: `dots` (square dot per cell, Bayer 4×4 threshold on brightness, 2px dots on a 4px grid) or `pixel` (contiguous 2px pixels, same threshold, colours posterised to 6 levels); `ground` dark / light; `src` dithers any image (cover). Slow drift on the shared dither loop (~24 fps, paused off-screen, still under reduced motion), re-reads tokens on theme change. Docs `/docs/foundations/abstract-images`: gallery with mode / ground pickers and 1600×1200 PNG download (`components/docs/abstract-gallery.tsx`), plus Pierre's reference photo `public/abstract/sample.webp` through dots / pixel.
- **One dot size (Pierre):** every dither dot is 2px (`DITHER_DOT`, the organic tile's dot), organic grid 4px (`DITHER_CELL`), both exported from `dither-tile.ts`: organic tile uniform 2px, fine 2px, bayer / gradient 2px, regular 2px on its 6px grid, OrganicDither shapes default cell 4 / dot [2, 2] (no density growth), AiGlow without override, DitherImage dots 2px / 4px and pixel mode in 2px pixels. The companion's LED face is a screen, not a dither: unchanged.
- Next (not started): Figma for the remaining ~45 components (overlays, blocks, AI blocks, charts). Single-example docs pages remain (Badge, Separator, Tooltip, Dialog, Drawer, several blocks, all charts).

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
- Remaining capacity is always dither (`bg-dither-organic` layer or `DitherPattern variant="organic"` in SVG): gauge arc, usage meter, checklist and subtask bars. Legend swatches (10px) keep `bg-dither-fine`.
- AI glow (`<AiGlow />`): colour only in the dither (Pierre): an organic cloud tinted brand → pink, masked out softly towards the start. No wash, no blurred blobs. Pink end = `chart-3` in both modes. Model names in examples are generic ("Atlas 2").
- Charts: Recharts only for Forecast Line, Stacked Area, Combo, Scatter, Response Curve (client); the 13 others are HTML/SVG (server-safe, stretch naturally). Chart components render the plot only; wrap them in `ChartCard` + `ChartLegend`. Recharts paints use `chartColor` (CSS vars); dither inside Recharts = `<defs><DitherPattern/></defs>` + `fill="url(#id)"`. Keep loops that accumulate (offsets, running totals) in pure helpers outside the component: the React Compiler lint rejects reassignment inside render callbacks.
- Treemap labels sit in a `bg-surface/90` chip so they stay readable on any chart colour in both modes.
- Showcase pages are server components; anything passing functions (chart formatters) to a Recharts chart lives in `components/showcase/client-charts.tsx` ("use client"). Brand names from the Figma screens are replaced with generic ones (ledger, board, design file, Atlas 2).
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
6. **Pixel dither texture** (brand identity). A vector dot grid in `border-strong`: 2px squares on a 6px grid, odd rows offset by 3px. Variants: regular, fine (2px / 4px), bayer (4×4 ordered), gradient (density fading top → bottom). Ship it as `<DitherPattern id variant />` (an SVG `<pattern>`) plus a `.bg-dither` utility (an inline SVG data-URI using `currentColor` with `color: var(--border-strong)`). Use it for remaining capacity, chart tracks, forecast ranges, empty states and skeletons.

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
   - Annotations as **black tags** (now pills in Manrope, sentence case, per Pierre: `Target 70%`, `Today`, `Alert 90%`, `Break-even 1.0x`, `Saturation 16%`). Target lines: solid 1px `foreground`.
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
