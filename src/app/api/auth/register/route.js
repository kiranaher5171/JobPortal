import { NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/register
 * User registration endpoint
 */
export async function POST(request) {
  try {
    // Check MongoDB connection
    if (!process.env.MONGODB_URI) {
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const errorMessage = isProduction
        ? 'MongoDB connection not configured. Please add MONGODB_URI in Vercel Dashboard → Settings → Environment Variables and redeploy.'
        : 'MongoDB connection not configured. Please add MONGODB_URI to your .env.local file';
      
      console.error('MONGODB_URI missing:', {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        hasMongoUri: !!process.env.MONGODB_URI
      });
      
      return NextResponse.json(
        { success: false, error: errorMessage },
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

    const { firstName, lastName, email, password, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Register user
    const { user, accessToken, refreshToken } = await registerUser({
      firstName,
      lastName,
      email,
      password,
      role,
    });

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
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle different error types
    if (error.message && (
      error.message.includes('MongoDB') || 
      error.message.includes('MongoServerSelectionError') ||
      error.message.includes('SSL') ||
      error.message.includes('TLS') ||
      error.message.includes('connection')
    )) {
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const errorMessage = isProduction
        ? 'Database connection failed. Please check MONGODB_URI in Vercel Dashboard → Settings → Environment Variables. See MONGODB_CONNECTION_STRING_GUIDE.md for help.'
        : 'Database connection failed. Please check your MongoDB connection string in .env.local. Run: node test-mongodb-connection.js to test your connection.';
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}

