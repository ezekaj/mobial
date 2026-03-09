import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Initial response
  const response = NextResponse.next();

  // 2. Security Headers (Production Grade)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://api.mobimatter.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 3. Authentication & Authorization for Restricted Routes
  const isProtectedPath = pathname.startsWith('/admin') || 
                          pathname.startsWith('/api/admin');

  if (isProtectedPath) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      // Redirect to login if not authenticated
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Role-based Access Control (RBAC)
    const role = token.role as string;

    // Admin-only paths
    if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static, _next/image (static files)
     * - favicon.ico, logo.png, logo.svg (icons/images)
     * - manifest.json (PWA)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|logo.svg|manifest.json|api/health).*)',
  ],
};
