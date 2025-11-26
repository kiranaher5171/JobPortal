import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { nanoid } from 'nanoid';
import { generateJobSlug } from '@/utils/slug';

// GET - Fetch all jobs
export async function GET() {
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
        { success: false, error: 'Failed to connect to database. Please check your MongoDB connection string.' },
        { status: 500 }
      );
    }

    const db = client.db('jobportal');
    const jobsCollection = db.collection('jobs');
    
    // Use projection to only fetch needed fields for better performance
    // Add limit to prevent loading too much data at once
    const limit = 1000; // Reasonable limit for job listings
    const jobs = await jobsCollection
      .find({}, {
        projection: {
          password: 0, // Exclude password if it exists
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    // Convert ObjectId to string for JSON serialization
    // Only process jobs that need slug/jobId generation (optimize for performance)
    const serializedJobs = jobs.map(job => {
      const jobId = job._id.toString();
      return {
        ...job,
        _id: jobId,
        jobId: job.jobId || jobId, // Use existing jobId or fallback to _id
        slug: job.slug || `${job.jobRole?.toLowerCase().replace(/\s+/g, '-') || 'job'}-${jobId.slice(-6)}`,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
    });
    
    // Add cache headers for better performance
    return NextResponse.json(
      { success: true, data: serializedJobs }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create a new job
export async function POST(request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
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

    const { 
      jobRole, 
      companyName, 
      designation, 
      teamName, 
      jobType, 
      location, 
      experience, 
      salary,
      skills,
      keyResponsibilities,
      minimumQualifications,
      benefits,
      jobDescription
    } = body;

    // Validate required fields
    if (!jobRole) {
      return NextResponse.json(
        { success: false, error: 'Job Role is required' },
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
        { success: false, error: 'Failed to connect to database. Please check your MongoDB connection string.' },
        { status: 500 }
      );
    }

    const db = client.db('jobportal');
    
    // Generate unique job ID
    const jobId = nanoid(10); // Generate 10-character unique ID
    
    // Generate slug from job role and jobId (companyName is optional now)
    const companyNameForSlug = companyName?.trim() || 'company';
    const slug = generateJobSlug(jobRole.trim(), companyNameForSlug, jobId);
    
    // Check if slug already exists, if so, append a number
    let finalSlug = slug;
    let counter = 1;
    while (await db.collection('jobs').findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const job = {
      jobId: jobId, // Unique job ID
      jobRole: jobRole?.trim() || '',
      companyName: companyName?.trim() || '',
      designation: designation?.trim() || '',
      teamName: teamName?.trim() || '',
      jobType: jobType?.trim() || '',
      location: location?.trim() || '',
      experience: experience?.trim() || '',
      salary: salary?.trim() || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      keyResponsibilities: keyResponsibilities?.trim() || '',
      minimumQualifications: minimumQualifications?.trim() || '',
      benefits: benefits?.trim() || '',
      jobDescription: jobDescription?.trim() || '',
      slug: finalSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('jobs').insertOne(job);
    
    return NextResponse.json(
      { success: true, data: { ...job, _id: result.insertedId.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}

