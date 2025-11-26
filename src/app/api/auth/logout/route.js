import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 * Logout endpoint - clears refresh token cookie
 */
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    
    // Clear refresh token cookie
    cookieStore.delete('refreshToken');

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

