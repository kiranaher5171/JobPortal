import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// POST - Create a new referral
export async function POST(request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
        { status: 500 }
      );
    }

    // Check authentication
    const { requireAuth, getAuthUser } = await import('@/middleware/auth.middleware');
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

    const formData = await request.formData();

    // Extract form fields
    const referrerName = formData.get('referrerName')?.toString().trim() || '';
    const referrerEmail = formData.get('referrerEmail')?.toString().trim() || '';
    const referrerPhone = formData.get('referrerPhone')?.toString().trim() || '';
    const employeeId = formData.get('employeeId')?.toString().trim() || '';
    const candidateName = formData.get('candidateName')?.toString().trim() || '';
    const candidateEmail = formData.get('candidateEmail')?.toString().trim() || '';
    const candidatePhone = formData.get('candidatePhone')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';
    const jobId = formData.get('jobId')?.toString().trim() || '';
    const jobRole = formData.get('jobRole')?.toString().trim() || '';
    const resumeFile = formData.get('resume');

    // Validation
    if (!referrerName || !referrerEmail || !referrerPhone || !employeeId) {
      return NextResponse.json(
        { success: false, error: 'All referrer fields are required' },
        { status: 400 }
      );
    }

    if (!candidateName || !candidateEmail || !candidatePhone || !message) {
      return NextResponse.json(
        { success: false, error: 'All candidate fields are required' },
        { status: 400 }
      );
    }

    if (!jobId || !jobRole) {
      return NextResponse.json(
        { success: false, error: 'Job information is required' },
        { status: 400 }
      );
    }

    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume file is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(referrerEmail) || !emailRegex.test(candidateEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
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
    const jobsCollection = db.collection('jobs');

    if (!jobId || jobId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    let jobObjectId;
    try {
      jobObjectId = new ObjectId(jobId);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: `Invalid job ID format: ${jobId}` },
        { status: 400 }
      );
    }

    const job = await jobsCollection.findOne({ _id: jobObjectId });
    if (!job) {
      return NextResponse.json(
        { success: false, error: `Job not found with ID: ${jobId}` },
        { status: 404 }
      );
    }

    // Handle file upload
    let resumePath = '';
    try {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileExtension = resumeFile.name.split('.').pop();
      const fileName = `resume_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      resumePath = join(uploadsDir, fileName);

      // Write file
      await writeFile(resumePath, buffer);

      // Store relative path for database
      resumePath = `/uploads/resumes/${fileName}`;
    } catch (fileError) {
      console.error('Error saving resume file:', fileError);
      return NextResponse.json(
        { success: false, error: 'Failed to save resume file' },
        { status: 500 }
      );
    }

    // Create referral document
    // Store both the form email and the logged-in user's email for matching
    // Ensure userId is stored as string for consistency
    const referral = {
      referrerName,
      referrerEmail: referrerEmail.toLowerCase().trim(), // Email from form (normalized)
      referrerPhone,
      employeeId,
      candidateName,
      candidateEmail: candidateEmail.toLowerCase().trim(), // Normalize candidate email too
      candidatePhone,
      message,
      resume: resumePath,
      jobId: jobObjectId,
      jobRole,
      userId: String(userId), // Ensure userId is stored as string for consistency
      userEmail: email.toLowerCase().trim(), // Logged-in user's email from token (normalized for matching)
      status: 'pending', // pending, reviewed, contacted, hired, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await referralsCollection.insertOne(referral);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...referral,
          _id: result.insertedId.toString(),
          jobId: jobId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create referral' },
      { status: 500 }
    );
  }
}

// Note: GET method is not available for users
// Users can only POST (submit) referrals
// Admins can GET all referrals via /api/admin/referrals

