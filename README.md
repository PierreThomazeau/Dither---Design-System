# Dither

A React + Tailwind CSS v4 design system built on shadcn/ui and Radix, with a pixel dither texture as its signature. Documentation site with Fumadocs, distribution as a shadcn registry.

```bash
pnpm install
pnpm dev
```

- `/docs`: documentation
- `/tokens`: colours, radius, heights, spacing, type, elevation, dither variants
- `public/r/*.json`: registry (`npx shadcn add @dither/<name>`)

## Access code

Dither is free to use but not open source (see `LICENSE`). The docs, showcase, tokens, registry (`/r`), MCP server and llms files open with an access code:

- Set `DITHER_ACCESS_CODE` in the Vercel project (Settings, Environment Variables). Never commit it. Changing it signs everyone out.
- Without it, production keeps everything locked; `pnpm dev` accepts `dither`.
- People unlock in the browser at `/access`; tools send `Authorization: Bearer <code>`.

See `CLAUDE.md` for the brief and build order.
