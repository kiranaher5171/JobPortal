import { verifyAccessToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 */
export function authenticateToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return {
        error: 'Access token required',
        status: 401,
      };
    }

    const decoded = verifyAccessToken(token);
    return {
      user: {
        userId: decoded.userId || decoded._id,
        email: decoded.email,
        role: decoded.role,
      },
      error: null,
    };
  } catch (error) {
    return {
      error: error.message || 'Invalid or expired token',
      status: 401,
    };
  }
}

/**
 * Require Authentication Middleware
 * Returns error response if not authenticated
 */
export function requireAuth(request) {
  const authResult = authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status || 401 }
    );
  }
  
  return null; // Authenticated
}

/**
 * Get authenticated user from request
 */
export function getAuthUser(request) {
  const authResult = authenticateToken(request);
  return authResult.user || null;
}

