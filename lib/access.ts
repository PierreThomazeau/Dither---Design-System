/* ------------------------------------------------------------------ *
 * Access code (Pierre): Dither is free but not open source; the docs,
 * showcase, tokens, registry (/r), MCP server and llms files open with
 * a code. The code lives in DITHER_ACCESS_CODE (Vercel env), never in
 * the repository. The browser keeps a cookie holding a hash of the code,
 * so changing the code signs everyone out. Tools (shadcn CLI, MCP
 * clients) send the code as `Authorization: Bearer <code>`.
 * ------------------------------------------------------------------ */

export const ACCESS_COOKIE = "dither-access";

/** Paths that need the code. Everything else (landing, license, access page, assets) is public. */
const GATED = ["/docs", "/showcase", "/tokens", "/r/", "/mcp", "/llms", "/api/search"];

export function isGated(pathname: string) {
  return GATED.some((p) => pathname === p.replace(/\/$/, "") || pathname.startsWith(p.endsWith("/") ? p : `${p}/`) || pathname.startsWith(`${p}.`) || pathname.startsWith(`${p}-`));
}

/** The configured code. In development, "dither" when nothing is set; in production, none (the gate stays closed). */
export function accessCode(): string | null {
  const code = process.env.DITHER_ACCESS_CODE?.trim();
  if (code) return code;
  return process.env.NODE_ENV === "production" ? null : "dither";
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`dither-access-v1:${text}`));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison of two strings of hex. */
function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Cookie value for a valid code. */
export async function accessToken(code: string) {
  return sha256(code);
}

/** Is this submitted code the right one? */
export async function checkCode(submitted: string) {
  const code = accessCode();
  if (!code || !submitted) return false;
  return same(await sha256(submitted.trim()), await sha256(code));
}

/** Is this cookie value (or bearer code) valid? */
export async function checkAccess({ cookie, bearer }: { cookie?: string; bearer?: string }) {
  const code = accessCode();
  if (!code) return false;
  const expected = await sha256(code);
  if (cookie && same(cookie, expected)) return true;
  if (bearer && same(await sha256(bearer.trim()), expected)) return true;
  return false;
}

/** Only same-site paths after unlocking (no open redirect). */
export function safeNext(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/docs";
  return next;
}
