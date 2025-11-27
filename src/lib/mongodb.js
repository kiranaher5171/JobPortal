import { MongoClient } from 'mongodb';

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

function getMongoClient() {
  // Check for MONGODB_URI only when connection is actually needed (runtime)
  if (!process.env.MONGODB_URI) {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const errorMessage = isProduction
      ? 'MONGODB_URI environment variable is not configured. Please add it in your deployment platform (Vercel Dashboard → Settings → Environment Variables).'
      : 'Please add MONGODB_URI to your .env.local file';
    throw new Error(errorMessage);
  }

  const uri = process.env.MONGODB_URI;

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
