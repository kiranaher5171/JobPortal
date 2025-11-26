import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireAuth, getAuthUser } from '@/middleware/auth.middleware';
import { ObjectId } from 'mongodb';

// GET - Fetch user's own applications and referrals
export async function GET(request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
        { status: 500 }
      );
    }

    // Check authentication
    const authError = requireAuth(request);
    if (authError) {
      return authError;
    }

    const tokenUser = getAuthUser(request);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, email } = tokenUser;

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

    // Normalize email for case-insensitive matching
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUserId = String(userId); // Ensure userId is string

    // First, backfill any referrals that match by referrerEmail but are missing userEmail/userId
    // This handles referrals created before we added these fields
    const referralsToBackfill = await referralsCollection
      .find({
        $and: [
          {
            $or: [
              { referrerEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } },
              { userEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }
            ]
          },
          {
            $or: [
              { userEmail: { $exists: false } },
              { userId: { $exists: false } },
              { userEmail: null },
              { userId: null }
            ]
          }
        ]
      })
      .toArray();

    if (referralsToBackfill.length > 0) {
      const updatePromises = referralsToBackfill.map(ref => 
        referralsCollection.updateOne(
          { _id: ref._id },
          { 
            $set: { 
              userEmail: normalizedEmail,
              userId: normalizedUserId 
            } 
          }
        )
      );
      await Promise.all(updatePromises);
    }

    // Build query for referrals - match multiple ways to ensure we find all user's referrals
    // Match by normalized email (case-insensitive) and userId (as string)
    let referralQuery = {
      $or: [
        { userEmail: normalizedEmail }, // Exact match (emails are normalized in DB)
        { userEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }, // Case-insensitive match (for old data)
        { referrerEmail: normalizedEmail }, // Exact match (emails are normalized in DB)
        { referrerEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }, // Case-insensitive match (for old data)
        { userId: normalizedUserId }, // String format (primary)
      ]
    };

    // Also try ObjectId format if userId is a valid ObjectId string (for backward compatibility)
    if (userId && ObjectId.isValid(userId)) {
      try {
        referralQuery.$or.push({ userId: new ObjectId(userId) });
      } catch (e) {
        // Ignore if conversion fails
      }
    }

    // Fetch user's referrals (where they are the referrer)
    // Limit to 500 for better performance
    const referrals = await referralsCollection
      .find(referralQuery)
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    // Fetch user's regular applications
    // Match by userId (string) and email (case-insensitive)
    // Limit to 500 for better performance
    const applications = await applicationsCollection
      .find({
        $or: [
          { userId: normalizedUserId },
          { userId: userId }, // Also try original format
          { userEmail: normalizedEmail },
          { userEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

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
    console.error('Error fetching user applications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

