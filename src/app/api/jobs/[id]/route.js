import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// GET - Fetch a single job by slug or ID
export async function GET(request, { params }) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
        { status: 500 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID or slug is required' },
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
    const jobsCollection = db.collection('jobs');
    
    // Try to find by slug first (most common case, has index)
    let job = await jobsCollection.findOne({ slug: id });
    
    // If not found by slug, try finding by _id (for backward compatibility)
    if (!job && ObjectId.isValid(id)) {
      try {
        job = await jobsCollection.findOne({ _id: new ObjectId(id) });
      } catch (e) {
        // Ignore error
      }
    }

    // If still not found, try by jobId (has index)
    if (!job) {
      job = await jobsCollection.findOne({ jobId: id });
    }

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Convert ObjectId to string for JSON serialization
    const serializedJob = {
      ...job,
      _id: job._id.toString(),
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    // Add cache headers for better performance
    return NextResponse.json(
      { success: true, data: serializedJob }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a job by ID
export async function DELETE(request, { params }) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured. Please add MONGODB_URI to .env.local' },
        { status: 500 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

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
    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete job' },
      { status: 500 }
    );
  }
}

// PUT - Update a job by ID
export async function PUT(request, { params }) {
  try {
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

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
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

    if (!jobRole) {
      return NextResponse.json(
        { success: false, error: 'Job Role is required' },
        { status: 400 }
      );
    }

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
    
    const updateData = {
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
      updatedAt: new Date(),
    };

    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const updatedJob = await db.collection('jobs').findOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...updatedJob,
          _id: updatedJob._id.toString(),
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update job' },
      { status: 500 }
    );
  }
}
