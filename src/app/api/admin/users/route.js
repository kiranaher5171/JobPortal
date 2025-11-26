import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { nanoid } from 'nanoid';
import { ObjectId } from 'mongodb';

// GET - Fetch all users (Admin only)
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
    const { requireAuth, getAuthUser } = await import('@/middleware/auth.middleware');
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
        { success: false, error: 'Failed to connect to database. Please check your MongoDB connection string.' },
        { status: 500 }
      );
    }

    const db = client.db('jobportal');
    
    // Fetch from both users and admins collections (schema-less approach)
    // Collections are created automatically on first insert
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    const savedJobsCollection = db.collection('savedJobs');
    const applicationsCollection = db.collection('applications');
    
    // Use projection to exclude password field for better performance
    const projection = { password: 0 };
    
    // Limit results for better performance (admin can see up to 1000 users at once)
    const limit = 1000;
    const [users, admins] = await Promise.all([
      usersCollection.find({}, { projection }).sort({ createdAt: -1 }).limit(limit).toArray(),
      adminsCollection.find({}, { projection }).sort({ createdAt: -1 }).limit(limit).toArray(),
    ]);
    
    // Combine and convert ObjectId to string
    const allUsers = [...users, ...admins].map(user => ({
      ...user,
      _id: user._id.toString(),
      role: user.role || (admins.some(a => a._id.toString() === user._id.toString()) ? 'admin' : 'user'),
    }));
    
    // Optimize: Fetch all counts in bulk using aggregation pipelines for better performance
    // This is much faster than querying for each user individually
    const referralsCollection = db.collection('referrals');
    
    // Get all saved jobs counts in one query using aggregation
    const savedJobsAggregation = await savedJobsCollection.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$userId', '$userEmail'] },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    // Create a map for quick lookup
    const savedJobsMap = new Map();
    savedJobsAggregation.forEach(item => {
      savedJobsMap.set(String(item._id), item.count);
    });
    
    // Get all applications counts in one query
    const applicationsAggregation = await applicationsCollection.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$userId', '$userEmail'] },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const applicationsMap = new Map();
    applicationsAggregation.forEach(item => {
      applicationsMap.set(String(item._id), item.count);
    });
    
    // Get all referrals counts in one query (grouped by userEmail, referrerEmail, and userId)
    const referralsAggregation = await referralsCollection.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$userId', { $ifNull: ['$userEmail', '$referrerEmail'] }] },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const referralsMap = new Map();
    referralsAggregation.forEach(item => {
      const key = String(item._id);
      // Add to existing count if key already exists
      referralsMap.set(key, (referralsMap.get(key) || 0) + item.count);
    });
    
    // Also count referrals by referrerEmail separately
    const referralsByEmailAggregation = await referralsCollection.aggregate([
      {
        $group: {
          _id: '$referrerEmail',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    referralsByEmailAggregation.forEach(item => {
      if (item._id) {
        const key = String(item._id).toLowerCase().trim();
        referralsMap.set(key, (referralsMap.get(key) || 0) + item.count);
      }
    });
    
    // Map counts to users (much faster than individual queries)
    const usersWithCounts = allUsers.map((user) => {
      const userId = user._id;
      const userEmail = user.email?.toLowerCase().trim() || '';
      
      // Get counts from maps (with fallbacks)
      const savedJobsCount = savedJobsMap.get(userId) || savedJobsMap.get(userEmail) || 0;
      
      // Applications count (regular applications only, referrals counted separately)
      const applicationsCount = applicationsMap.get(userId) || applicationsMap.get(userEmail) || 0;
      
      // Referrals count (where user is the referrer)
      const referralsCount = referralsMap.get(userId) || referralsMap.get(userEmail) || 0;
      
      // Total applications = regular applications + referrals
      const totalApplicationsCount = applicationsCount + referralsCount;
      
      return {
        ...user,
        savedJobsCount,
        applicationsCount: totalApplicationsCount, // Total includes referrals
        referralsCount,
      };
    });
    
    return NextResponse.json({ success: true, data: usersWithCounts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create a new user (Signup)
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
      username, 
      email, 
      password, 
      role 
    } = body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
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
    
    // Ensure collections exist (MongoDB creates collections automatically on first insert)
    // This is schema-less - no schema validation, flexible document structure
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    // Determine which collection to use based on role
    const collectionName = role === 'admin' ? 'admins' : 'users';
    const targetCollection = role === 'admin' ? adminsCollection : usersCollection;
    
    // Check if email already exists in either collection (schema-less: no predefined structure)
    const [existingUserInUsers, existingUserInAdmins] = await Promise.all([
      usersCollection.findOne({ email: email.trim() }),
      adminsCollection.findOne({ email: email.trim() }),
    ]);
    
    if (existingUserInUsers || existingUserInAdmins) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if username already exists in either collection
    const [existingUsernameInUsers, existingUsernameInAdmins] = await Promise.all([
      usersCollection.findOne({ username: username.trim() }),
      adminsCollection.findOne({ username: username.trim() }),
    ]);
    
    if (existingUsernameInUsers || existingUsernameInAdmins) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create new user/admin (schema-less: flexible document structure)
    // MongoDB will automatically create the collection if it doesn't exist
    const user = {
      userId: nanoid(10), // Unique user ID
      username: username.trim(),
      email: email.trim(),
      password: password, // In production, this should be hashed using bcrypt
      role: role,
      name: username.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      // Additional fields can be added dynamically without schema changes
      // This is the power of schema-less MongoDB
    };

    // Insert into the appropriate collection (users or admins)
    const result = await targetCollection.insertOne(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { success: true, data: { ...userWithoutPassword, _id: result.insertedId.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

