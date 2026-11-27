/**
 * Dither MCP server: a minimal, stateless Model Context Protocol endpoint over Streamable HTTP
 * (JSON responses, no SSE). Lets AI assistants list Dither components, read their source and
 * get install commands. Data comes from registry.json and the built registry (`/r/<name>.json`).
 */
import registry from "@/registry.json";
import tokens from "@/styles/tokens.json";
import { version } from "@/lib/shared";

export const dynamic = "force-dynamic";

const PROTOCOL_VERSION = "2025-06-18";

type JsonRpcRequest = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

type Kind = "ui" | "block" | "chart" | "lib" | "theme";

function kindOf(item: (typeof registry.items)[number]): Kind {
  const path = item.files[0]?.path ?? "";
  if (item.type === "registry:file") return "theme";
  if (item.type === "registry:lib") return "lib";
  if (path.includes("/charts/")) return "chart";
  if (item.type === "registry:block") return "block";
  return "ui";
}

const tools = [
  {
    name: "list_components",
    description: "List Dither registry items (UI primitives, blocks, charts, libs, theme). Optionally filter by kind or a text query.",
    inputSchema: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["ui", "block", "chart", "lib", "theme"], description: "Only items of this kind." },
        query: { type: "string", description: "Case-insensitive match on name, title or description." },
      },
    },
  },
  {
    name: "get_component",
    description: "Get one Dither registry item: metadata, dependencies and (by default) its source files.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Registry name, e.g. button, stat-card, forecast-chart." },
        includeSource: { type: "boolean", description: "Include file contents (default true)." },
      },
      required: ["name"],
    },
  },
  {
    name: "get_install_command",
    description: "Return the shadcn CLI command and the components.json registry entry needed to install a Dither item.",
    inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  },
  {
    name: "get_tokens",
    description: "Return Dither design tokens: semantic colours (light / dark), radius, control heights, spacing, type scale and the dither spec.",
    inputSchema: { type: "object", properties: {} },
  },
];

function text(value: unknown) {
  return { content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] };
}

async function callTool(name: string, args: Record<string, unknown>, origin: string) {
  switch (name) {
    case "list_components": {
      const kind = args.kind as Kind | undefined;
      const q = typeof args.query === "string" ? args.query.toLowerCase() : "";
      const items = registry.items
        .map((i) => ({ name: i.name, kind: kindOf(i), title: i.title, description: i.description }))
        .filter((i) => (!kind || i.kind === kind) && (!q || `${i.name} ${i.title} ${i.description}`.toLowerCase().includes(q)));
      return text({ count: items.length, items });
    }
    case "get_component": {
      const item = registry.items.find((i) => i.name === args.name);
      if (!item) return { ...text(`Unknown component "${String(args.name)}". Use list_components.`), isError: true };
      const meta = { name: item.name, kind: kindOf(item), title: item.title, description: item.description, dependencies: "dependencies" in item ? item.dependencies : [], registryDependencies: item.registryDependencies ?? [], docs: `${origin}/docs` };
      if (args.includeSource === false) return text(meta);
      const res = await fetch(`${origin}/r/${item.name}.json`, { cache: "no-store" });
      if (!res.ok) return text({ ...meta, files: "Source unavailable (registry not built)." });
      const built = (await res.json()) as { files?: { path: string; content?: string }[] };
      return text({ ...meta, files: built.files?.map((f) => ({ path: f.path, content: f.content })) });
    }
    case "get_install_command": {
      const item = registry.items.find((i) => i.name === args.name);
      if (!item) return { ...text(`Unknown component "${String(args.name)}".`), isError: true };
      return text({
        command: `npx shadcn add @dither/${item.name}`,
        componentsJson: { registries: { "@dither": { url: `${origin}/r/{name}.json`, headers: { Authorization: "Bearer ${DITHER_ACCESS_CODE}" } } } },
      });
    }
    case "get_tokens":
      return text(tokens);
    default:
      return { ...text(`Unknown tool "${name}".`), isError: true };
  }
}

async function handle(req: JsonRpcRequest, origin: string) {
  const id = req.id ?? null;
  const ok = (result: unknown) => ({ jsonrpc: "2.0" as const, id, result });
  const fail = (code: number, message: string) => ({ jsonrpc: "2.0" as const, id, error: { code, message } });

  switch (req.method) {
    case "initialize":
      return ok({
        protocolVersion: typeof req.params?.protocolVersion === "string" ? req.params.protocolVersion : PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "dither", title: "Dither design system", version },
        instructions:
          "Dither is a React + Tailwind v4 design system distributed as a shadcn registry. Use list_components to discover items, get_component to read source, get_install_command to install. Follow the tokens (get_tokens): never hardcode colours or radius.",
      });
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools });
    case "tools/call": {
      const name = String(req.params?.name ?? "");
      const args = (req.params?.arguments as Record<string, unknown>) ?? {};
      return ok(await callTool(name, args, origin));
    }
    default:
      return fail(-32601, `Method not found: ${req.method}`);
  }
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  let body: JsonRpcRequest | JsonRpcRequest[];
  try {
    body = await request.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }
  const batch = Array.isArray(body) ? body : [body];
  // Notifications (no id) get no response.
  const requests = batch.filter((r) => r.id !== undefined && r.id !== null);
  if (requests.length === 0) return new Response(null, { status: 202 });
  const results = await Promise.all(requests.map((r) => handle(r, origin)));
  return Response.json(Array.isArray(body) ? results : results[0], {
    headers: { "MCP-Protocol-Version": PROTOCOL_VERSION },
  });
}

export function GET() {
  return new Response("Dither MCP endpoint. Send JSON-RPC requests with POST.", { status: 405, headers: { Allow: "POST" } });
}
