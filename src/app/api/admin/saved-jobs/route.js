import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireAuth, getAuthUser } from '@/middleware/auth.middleware';
import { getUserById } from '@/services/auth.service';
import { ObjectId } from 'mongodb';

// GET - Fetch saved jobs
// For regular users: returns their own saved jobs
// For admins: returns all saved jobs with user information
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

    // Get user from token
    const tokenUser = getAuthUser(request);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, email, role } = tokenUser;

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
    const savedJobsCollection = db.collection('savedJobs');
    const jobsCollection = db.collection('jobs');

    // Admin API - always return all saved jobs
    // Check if user is admin
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    let query = {}; // Empty query to get all saved jobs

    // Fetch saved jobs with limit for better performance
    const limit = 1000; // Reasonable limit for admin view
    const savedJobs = await savedJobsCollection
      .find(query)
      .sort({ savedAt: -1 })
      .limit(limit)
      .toArray();

    // Optimize: Collect all job IDs first, then fetch all jobs in one query
    const jobIds = savedJobs
      .map((savedJob) => {
        let jobId = savedJob.jobId;
        if (typeof jobId === 'string') {
          try {
            return new ObjectId(jobId);
          } catch (e) {
            return null;
          }
        }
        return jobId;
      })
      .filter(id => id !== null);

    // Fetch all jobs in one query using $in operator (much faster)
    const jobsMap = new Map();
    if (jobIds.length > 0) {
      const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();
      jobs.forEach(job => {
        jobsMap.set(job._id.toString(), job);
      });
    }

    // Populate job details for each saved job using the map
    const savedJobsWithDetails = savedJobs
      .map((savedJob) => {
        let jobId = savedJob.jobId;
        const jobIdString = typeof jobId === 'string' ? jobId : jobId.toString();
        const job = jobsMap.get(jobIdString);
        
        if (!job) {
          return null; // Job might have been deleted
        }

        return {
          _id: savedJob._id.toString(),
          savedJobId: savedJob._id.toString(),
          jobId: savedJob.jobId.toString(),
          userId: savedJob.userId?.toString() || savedJob.userId,
          userEmail: savedJob.userEmail,
          userName: savedJob.userName,
          savedAt: savedJob.savedAt,
          job: {
            ...job,
            _id: job._id.toString(),
          }
        };
      })
      .filter(item => item !== null);

    // Filter out null values (deleted jobs)
    const validSavedJobs = savedJobsWithDetails.filter(item => item !== null);

    return NextResponse.json(
      { success: true, data: validSavedJobs },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch saved jobs' },
      { status: 500 }
    );
  }
}

// POST - Save a job
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
    const authError = requireAuth(request);
    if (authError) {
      return authError;
    }

    // Get user from token
    const tokenUser = getAuthUser(request);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, email, role } = tokenUser;
    
    // Get full user data to get name
    let userName = email;
    try {
      const user = await getUserById(userId, role);
      userName = user.name || user.firstName || email;
    } catch (error) {
      console.error('Error fetching user name:', error);
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

    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
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
    const savedJobsCollection = db.collection('savedJobs');
    const jobsCollection = db.collection('jobs');

    // Convert jobId to ObjectId if it's a string
    let jobObjectId;
    try {
      jobObjectId = typeof jobId === 'string' ? new ObjectId(jobId) : jobId;
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    // Verify job exists
    const job = await jobsCollection.findOne({ _id: jobObjectId });
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if already saved
    const existingSavedJob = await savedJobsCollection.findOne({
      jobId: jobObjectId,
      $or: [
        { userId: userId },
        { userEmail: email }
      ]
    });

    if (existingSavedJob) {
      return NextResponse.json(
        { success: false, error: 'Job is already saved' },
        { status: 400 }
      );
    }

    // Create saved job entry
    const savedJob = {
      jobId: jobObjectId,
      userId: userId,
      userEmail: email,
      userName: userName || email,
      savedAt: new Date(),
    };

    const result = await savedJobsCollection.insertOne(savedJob);

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          ...savedJob, 
          _id: result.insertedId.toString() 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save job' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a saved job
export async function DELETE(request) {
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

    // Get user from token
    const tokenUser = getAuthUser(request);
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, email, role } = tokenUser;

    // Get jobId from query params or body
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Convert jobId to ObjectId if it's a string
    let jobObjectId;
    try {
      jobObjectId = typeof jobId === 'string' ? new ObjectId(jobId) : jobId;
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID format' },
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
    const savedJobsCollection = db.collection('savedJobs');

    // Build query - admins can delete any saved job, users can only delete their own
    let query = { jobId: jobObjectId };
    if (role !== 'admin') {
      query.$or = [
        { userId: userId },
        { userEmail: email }
      ];
    }

    const result = await savedJobsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Saved job not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Job removed from saved jobs' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing saved job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove saved job' },
      { status: 500 }
    );
  }
}

