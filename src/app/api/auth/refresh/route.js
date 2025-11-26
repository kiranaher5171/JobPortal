import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { getUserById } from '@/services/auth.service';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Get user data - userId can be userId or _id from token
    const userId = decoded.userId || decoded._id;
    const user = await getUserById(userId, decoded.role);

    // Generate new access token
    const accessToken = generateAccessToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        accessToken,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name || user.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Token refresh failed' },
      { status: 401 }
    );
  }
}

