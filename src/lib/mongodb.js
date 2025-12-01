import { MongoClient } from 'mongodb';

// Improved connection options for production
const options = {
  serverSelectionTimeoutMS: 30000, // Increased from 5s to 30s for production
  connectTimeoutMS: 30000, // Increased from 10s to 30s for production
  socketTimeoutMS: 45000, // Socket timeout
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 1, // Maintain at least 1 socket connection
  retryWrites: true,
  w: 'majority',
};

let client;
let clientPromise;

function getMongoClient() {
  // Check for MONGODB_URI only when connection is actually needed (runtime)
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not configured. Please ensure MONGODB_URI is set in your environment variables.');
  }

  const uri = process.env.MONGODB_URI.trim();

  // Validate connection string format
  if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
    throw new Error('Invalid MongoDB connection string format. Must start with mongodb+srv:// or mongodb://');
  }

  // Warn if database name is missing (common issue)
  if (uri.includes('mongodb+srv://') && !uri.match(/mongodb\+srv:\/\/[^/]+\/[^?]/)) {
    console.warn('⚠️  Warning: Connection string may be missing database name. Expected format: mongodb+srv://user:pass@cluster.mongodb.net/database');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

// Export a promise that will check for MONGODB_URI at runtime, not at import time
export default new Promise((resolve, reject) => {
  // Defer the check until the promise is actually awaited
  process.nextTick(() => {
    try {
      resolve(getMongoClient());
    } catch (error) {
      reject(error);
    }
  });
});
