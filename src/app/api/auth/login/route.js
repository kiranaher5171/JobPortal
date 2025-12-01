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
      console.error('MONGODB_URI missing:', {
        NODE_ENV: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'MongoDB connection not configured. Please ensure MONGODB_URI is set in your environment variables.'
        },
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
      error.message.includes('Database connection failed') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ETIMEDOUT')
    )) {
      // Provide more specific error messages
      let errorMessage = 'Database connection failed.';
      let suggestions = [];

      if (error.message.includes('MongoServerSelectionError') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Cannot reach MongoDB server.';
        suggestions = [
          'Check your MongoDB Atlas IP whitelist: Network Access → Add IP Address → Add 0.0.0.0/0 (allow all)',
          'Verify your MongoDB Atlas cluster is running (not paused)',
          'Check your connection string format: mongodb+srv://user:password@cluster.mongodb.net/database',
        ];
      } else if (error.message.includes('authentication') || error.message.includes('auth')) {
        errorMessage = 'MongoDB authentication failed.';
        suggestions = [
          'Verify your username and password are correct',
          'Check if password contains special characters (may need URL encoding)',
          'Try resetting the database user password in MongoDB Atlas',
        ];
      } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
        errorMessage = 'Connection to MongoDB timed out.';
        suggestions = [
          'Check your internet connection',
          'Verify MongoDB Atlas cluster is accessible',
          'Check firewall settings',
        ];
      } else {
        suggestions = [
          'Verify your connection string format: mongodb+srv://user:password@cluster.mongodb.net/database',
          'Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for all IPs)',
          'Ensure your MongoDB Atlas cluster is running',
        ];
      }

      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          suggestions: suggestions.length > 0 ? suggestions : undefined,
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
