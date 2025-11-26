import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireAuth, getAuthUser } from '@/middleware/auth.middleware';

// GET - Fetch all applications (includes referrals)
export async function GET(request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
        { status: 500 }
      );
    }

    // Check authentication (admin only)
    const authError = requireAuth(request);
    if (authError) {
      return authError;
    }

    const tokenUser = getAuthUser(request);
    if (!tokenUser || tokenUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
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
    const applicationsCollection = db.collection('applications');

    // Fetch both referrals and regular applications with limit for better performance
    // Use limit to prevent loading too much data at once
    const limit = 1000; // Reasonable limit for admin view
    const [referrals, applications] = await Promise.all([
      referralsCollection.find({}).sort({ createdAt: -1 }).limit(limit).toArray(),
      applicationsCollection.find({}).sort({ createdAt: -1 }).limit(limit).toArray(),
    ]);

    // Transform referrals to application format
    const referralApplications = referrals.map((referral) => ({
      _id: referral._id.toString(),
      type: 'referral',
      candidateName: referral.candidateName,
      candidateEmail: referral.candidateEmail,
      candidatePhone: referral.candidatePhone,
      jobId: referral.jobId.toString(),
      jobRole: referral.jobRole,
      referrerName: referral.referrerName,
      referrerEmail: referral.referrerEmail,
      referrerPhone: referral.referrerPhone,
      employeeId: referral.employeeId,
      message: referral.message,
      resume: referral.resume,
      status: referral.status || 'pending',
      createdAt: referral.createdAt,
      updatedAt: referral.updatedAt,
    }));

    // Transform regular applications
    const regularApplications = applications.map((app) => ({
      ...app,
      _id: app._id.toString(),
      type: 'application',
      jobId: app.jobId?.toString() || app.jobId,
    }));

    // Combine and sort by creation date
    const allApplications = [...referralApplications, ...regularApplications].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return NextResponse.json(
      { success: true, data: allApplications },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

