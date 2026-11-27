import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsRoute } from '@/lib/shared';
import { ACCESS_COOKIE, checkAccess, isGated } from '@/lib/access';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `/llms.mdx${docsRoute}{/*path}.md`,
);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Access code: docs, showcase, tokens, registry, MCP and llms files.
  if (isGated(pathname)) {
    const auth = request.headers.get('authorization');
    const bearer = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7) : undefined;
    const ok = await checkAccess({ cookie: request.cookies.get(ACCESS_COOKIE)?.value, bearer });
    if (!ok) {
      const tool = pathname.startsWith('/r/') || pathname.startsWith('/mcp') || pathname.startsWith('/llms') || pathname.startsWith('/api/') || /\.(json|md|txt)$/.test(pathname);
      if (tool) {
        return new NextResponse('Dither needs an access code. Send it as "Authorization: Bearer <code>".', {
          status: 401,
          headers: { 'content-type': 'text/plain; charset=utf-8', 'www-authenticate': 'Bearer' },
        });
      }
      const url = new URL('/access', request.nextUrl);
      url.searchParams.set('next', pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  // files like `/docs/page.md` are served by the rewrites of the Next.js config
  const result =
    isMarkdownPreferred(request) && !/\.(md|txt)$/.test(pathname) && rewriteDocs(pathname);

  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl), {
      // this URL has two representations, selected by `Accept`
      headers: { Vary: 'Accept' },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and static assets (fonts, images, icons); /r/*.json stays covered.
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff2?|ttf)$).*)'],
};
