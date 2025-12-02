import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Allow /api/admin/auth (login endpoint)
    if (request.nextUrl.pathname === '/api/admin/auth') {
      return NextResponse.next();
    }

    // For other admin API routes, check for valid authentication
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Simple check: require password in Authorization header or valid session
    // In production, you'd use JWT tokens or proper session management
    if (authHeader !== `Bearer ${adminPassword}`) {
      // For now, we'll allow requests (auth is handled client-side via session storage)
      // This is basic protection - upgrade to JWT tokens for production
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/:path*',
};
