import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Get jobs count (optimized for dashboard)
export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured' },
        { status: 500 }
      );
    }

    let client;
    try {
      client = await clientPromise;
    } catch (connectionError) {
      console.error('MongoDB connection error:', connectionError);
      return NextResponse.json(
        { success: false, error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    const db = client.db('jobportal');
    const count = await db.collection('jobs').countDocuments();
    
    // Add cache headers for better performance
    return NextResponse.json(
      { success: true, count }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching jobs count:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs count' },
      { status: 500 }
    );
  }
}

