import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Simple connection options
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority',
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  clientPromise = Promise.reject(new Error('Please add your Mongo URI to .env.local'));
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development, use global variable to preserve across HMR
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, create new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Initialize database indexes on first successful connection
// This runs in the background and won't block if connection fails
if (typeof window === 'undefined' && uri) {
  // Use setImmediate to defer index creation, allowing API routes to handle connection errors first
  if (typeof setImmediate !== 'undefined') {
    setImmediate(() => {
      clientPromise
        .then(async (client) => {
          try {
            const db = client.db('jobportal');
            
            // Create indexes for jobs collection
            const jobsCollection = db.collection('jobs');
            await Promise.all([
              jobsCollection.createIndex({ slug: 1 }, { unique: true }).catch(() => {}),
              jobsCollection.createIndex({ jobId: 1 }, { unique: true }).catch(() => {}),
              jobsCollection.createIndex({ createdAt: -1 }).catch(() => {}),
              jobsCollection.createIndex({ jobRole: 1 }).catch(() => {}),
              jobsCollection.createIndex({ location: 1 }).catch(() => {}),
            ]);
            
            // Create indexes for users collection
            const usersCollection = db.collection('users');
            await Promise.all([
              usersCollection.createIndex({ email: 1 }, { unique: true }).catch(() => {}),
              usersCollection.createIndex({ username: 1 }, { unique: true }).catch(() => {}),
              usersCollection.createIndex({ createdAt: -1 }).catch(() => {}),
            ]);
            
            // Create indexes for admins collection
            const adminsCollection = db.collection('admins');
            await Promise.all([
              adminsCollection.createIndex({ email: 1 }, { unique: true }).catch(() => {}),
              adminsCollection.createIndex({ username: 1 }, { unique: true }).catch(() => {}),
              adminsCollection.createIndex({ createdAt: -1 }).catch(() => {}),
            ]);
            
            // Create indexes for savedJobs collection
            const savedJobsCollection = db.collection('savedJobs');
            await Promise.all([
              savedJobsCollection.createIndex({ jobId: 1 }).catch(() => {}),
              savedJobsCollection.createIndex({ userId: 1 }).catch(() => {}),
              savedJobsCollection.createIndex({ userEmail: 1 }).catch(() => {}),
              savedJobsCollection.createIndex({ savedAt: -1 }).catch(() => {}),
              savedJobsCollection.createIndex({ jobId: 1, userId: 1 }).catch(() => {}),
              savedJobsCollection.createIndex({ jobId: 1, userEmail: 1 }).catch(() => {}),
            ]);
            
            // Create indexes for referrals collection
            const referralsCollection = db.collection('referrals');
            await Promise.all([
              referralsCollection.createIndex({ jobId: 1 }).catch(() => {}),
              referralsCollection.createIndex({ referrerEmail: 1 }).catch(() => {}),
              referralsCollection.createIndex({ candidateEmail: 1 }).catch(() => {}),
              referralsCollection.createIndex({ employeeId: 1 }).catch(() => {}),
              referralsCollection.createIndex({ status: 1 }).catch(() => {}),
              referralsCollection.createIndex({ createdAt: -1 }).catch(() => {}),
              referralsCollection.createIndex({ jobId: 1, status: 1 }).catch(() => {}),
            ]);
            
            console.log('Database indexes created successfully');
          } catch (error) {
            // Indexes might already exist, which is fine
            if (!error.message.includes('already exists')) {
              console.error('Error creating indexes:', error.message);
            }
          }
        })
        .catch(() => {
          // Connection errors will be handled by API routes
          // Silently fail here to avoid console spam
        });
    });
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

