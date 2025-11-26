import { ROLES } from '@/constants/roles';
import { requireAuth, getAuthUser } from './auth.middleware';
import { NextResponse } from 'next/server';

/**
 * Require specific role middleware
 * @param {string|string[]} allowedRoles - Role(s) allowed to access
 */
export function requireRole(allowedRoles) {
  return (request) => {
    // First check authentication
    const authError = requireAuth(request);
    if (authError) {
      return authError;
    }

    // Get user from token
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Check role
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null; // Authorized
  };
}

/**
 * Require admin role
 */
export function requireAdmin(request) {
  return requireRole(ROLES.ADMIN)(request);
}

/**
 * Require user role
 */
export function requireUser(request) {
  return requireRole(ROLES.USER)(request);
}

