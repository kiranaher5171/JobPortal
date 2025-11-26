import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch a single user by ID
export async function GET(request, { params }) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
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
    
    // Schema-less approach: Check both collections (users and admins)
    // Collections are created automatically on first insert
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    let user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      user = await adminsCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { success: true, data: { ...userWithoutPassword, _id: user._id.toString() } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update a user by ID
export async function PUT(request, { params }) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured' },
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
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
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
    
    // Schema-less: Flexible document structure - can add/remove fields dynamically
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // Don't allow updating _id
    delete updateData._id;

    // Determine which collection to update (users or admins)
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    let user = await usersCollection.findOne({ _id: new ObjectId(id) });
    const collectionName = user ? 'users' : 'admins';
    const targetCollection = user ? usersCollection : adminsCollection;
    
    // If user not found in users, check admins
    if (!user) {
      user = await adminsCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
    }

    const result = await targetCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request, { params }) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'MongoDB connection not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
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
    
    // Schema-less: Delete from appropriate collection (users or admins)
    const usersCollection = db.collection('users');
    const adminsCollection = db.collection('admins');
    
    // Try to delete from users collection first
    let result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    
    // If not found in users, try admins collection
    if (result.deletedCount === 0) {
      result = await adminsCollection.deleteOne({ _id: new ObjectId(id) });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}

