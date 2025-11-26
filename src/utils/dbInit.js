/**
 * Database Initialization Utility
 * 
 * This utility helps ensure collections exist in MongoDB.
 * MongoDB is schema-less, so collections are created automatically on first insert.
 * This file is for reference/documentation purposes.
 */

import clientPromise from '@/lib/mongodb';

/**
 * Initialize database collections (optional - MongoDB creates them automatically)
 * This is mainly for documentation and ensuring indexes if needed
 */
export async function initializeCollections() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MongoDB URI not configured. Skipping collection initialization.');
      return;
    }

    const client = await clientPromise;
    const db = client.db('jobportal');

    // Collections will be created automatically on first insert
    // This is the schema-less approach - no schema definition needed
    
    // Optional: Create indexes for better query performance
    // Indexes don't enforce schema, they just optimize queries
    
    // Index on email for faster lookups (unique constraint can be added if needed)
    await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    await db.collection('admins').createIndex({ email: 1 }, { unique: true, sparse: true });
    await db.collection('admins').createIndex({ username: 1 }, { unique: true, sparse: true });
    await db.collection('admins').createIndex({ createdAt: -1 });
    
    // Index on jobs collection for better performance
    await db.collection('jobs').createIndex({ slug: 1 }, { unique: true, sparse: true });
    await db.collection('jobs').createIndex({ jobId: 1 }, { unique: true, sparse: true });
    await db.collection('jobs').createIndex({ createdAt: -1 });
    await db.collection('jobs').createIndex({ jobRole: 'text', designation: 'text' }); // Text search index

    console.log('Database collections initialized successfully');
  } catch (error) {
    // If indexes already exist, MongoDB will throw an error - that's okay
    if (error.code === 85 || error.code === 86) {
      console.log('Indexes already exist or are being created');
    } else {
      console.error('Error initializing collections:', error);
    }
  }
}

/**
 * Get collection statistics (for debugging/monitoring)
 */
export async function getCollectionStats() {
  try {
    if (!process.env.MONGODB_URI) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db('jobportal');

    const stats = {
      users: await db.collection('users').countDocuments(),
      admins: await db.collection('admins').countDocuments(),
      jobs: await db.collection('jobs').countDocuments(),
    };

    return stats;
  } catch (error) {
    console.error('Error getting collection stats:', error);
    return null;
  }
}

