import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('x-access-token')?.value; // Assuming token is in cookies for middleware

  const publicPaths = ['/auth', '/']; // Define public paths

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!accessToken) {
    // Redirect to login page if no access token
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // Optionally, verify the token with the backend here if needed for server-side checks
  // For now, we'll rely on client-side verification in AuthProvider for most cases
  // and assume the presence of a token in cookies is sufficient for initial middleware check.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.svg|.*\\.gif).*)',
  ],
};
