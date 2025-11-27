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
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle different error types
    if (error.message && (
      error.message.includes('MongoDB') || 
      error.message.includes('MongoServerSelectionError') ||
      error.message.includes('MongoNetworkError') ||
      error.message.includes('SSL') ||
      error.message.includes('TLS') ||
      error.message.includes('connection') ||
      error.message.includes('Database connection failed')
    )) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check your MongoDB connection string in .env.local',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
    
    // Handle authentication errors
    if (error.message && (
      error.message.includes('Invalid email') ||
      error.message.includes('Invalid password') ||
      error.message.includes('not found')
    )) {
      return NextResponse.json(
        { success: false, error: error.message || 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Login failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
