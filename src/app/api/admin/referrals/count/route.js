import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Get total count of referrals
export async function GET(request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
        { status: 500 }
      );
    }

    // Connect to MongoDB
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
    const referralsCollection = db.collection('referrals');

    // Get total count
    const count = await referralsCollection.countDocuments();

    return NextResponse.json(
      { success: true, count },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error counting referrals:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to count referrals' },
      { status: 500 }
    );
  }
}

