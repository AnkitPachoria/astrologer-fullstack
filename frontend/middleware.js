// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('adminToken')?.value;

  if (request.nextUrl.pathname.startsWith('/admin-dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-dashboard/:path*'],
};
