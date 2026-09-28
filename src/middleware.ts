import { NextResponse, type NextRequest } from 'next/server';

// Lightweight gate for signed-in areas. It only checks that a session cookie
// exists (so it runs on the Edge without pulling in the auth library); the
// account and admin layouts then verify the session and role on the server.
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token'];

export function middleware(req: NextRequest) {
  // Large sessions are split into chunks named "<cookie>.0", "<cookie>.1", …
  const hasSession = req.cookies
    .getAll()
    .some(({ name }) => SESSION_COOKIES.some((base) => name === base || name.startsWith(`${base}.`)));
  if (hasSession) return NextResponse.next();

  const login = new URL('/login', req.url);
  login.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
