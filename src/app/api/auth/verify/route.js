import { NextResponse } from 'next/server';
import { requireAuth, getAuthUser } from '@/middleware/auth.middleware';
import { getUserById } from '@/services/auth.service';

/**
 * GET /api/auth/verify
 * Verify access token and return user data
 */
export async function GET(request) {
  try {
    // Check authentication
    const authError = requireAuth(request);
    if (authError) {
      return authError;
    }

    // Get user from token
    const tokenUser = getAuthUser(request);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Get full user data from database - userId can be userId or _id from token
    const userId = tokenUser.userId || tokenUser._id;
    const user = await getUserById(userId, tokenUser.role);

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name || user.username,
          username: user.username,
          firstName: user.firstName || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Token verification failed' },
      { status: 401 }
    );
  }
}

