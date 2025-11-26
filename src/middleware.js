import { NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/home',
  '/about',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/password-updated',
];

// Admin-only routes
const adminRoutes = [
  '/admin/dashboard',
  '/admin/jobs',
  '/admin/manage-users',
  '/admin/applications',
  '/admin/settings',
];

// User routes (require authentication but not admin)
const userRoutes = [
  '/users/jobs',
  '/users/saved-jobs',
  '/users/my-applications',
  '/users/profile',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for auth token in cookies or headers
  // For now, we'll check in the client-side components
  // This middleware will be enhanced later with proper session management
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

