import { NextResponse } from 'next/server';
import { loginUser } from '@/services/auth.service';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/login
 * User login endpoint
 */
export async function POST(request) {
  try {
    // Check MongoDB connection
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured' },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login user
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    // Set refresh token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        user,
        accessToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle different error types
    if (error.message && (
      error.message.includes('MongoDB') || 
      error.message.includes('MongoServerSelectionError') ||
      error.message.includes('SSL') ||
      error.message.includes('TLS') ||
      error.message.includes('connection')
    )) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check your MongoDB connection string in .env.local'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}
