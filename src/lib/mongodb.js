import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timeout
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  // Don't throw error at module load, let API routes handle it
  clientPromise = Promise.reject(new Error('Please add your Mongo URI to .env.local'));
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Initialize database indexes on first connection
if (typeof window === 'undefined') {
  clientPromise.then(async (client) => {
    try {
      const db = client.db('jobportal');
      
      // Create indexes for jobs collection
      const jobsCollection = db.collection('jobs');
      await Promise.all([
        jobsCollection.createIndex({ slug: 1 }, { unique: true }),
        jobsCollection.createIndex({ jobId: 1 }, { unique: true }),
        jobsCollection.createIndex({ createdAt: -1 }),
        jobsCollection.createIndex({ jobRole: 1 }),
        jobsCollection.createIndex({ location: 1 }),
      ]);
      
      // Create indexes for users collection
      const usersCollection = db.collection('users');
      await Promise.all([
        usersCollection.createIndex({ email: 1 }, { unique: true }),
        usersCollection.createIndex({ username: 1 }, { unique: true }),
        usersCollection.createIndex({ createdAt: -1 }),
      ]);
      
      // Create indexes for admins collection
      const adminsCollection = db.collection('admins');
      await Promise.all([
        adminsCollection.createIndex({ email: 1 }, { unique: true }),
        adminsCollection.createIndex({ username: 1 }, { unique: true }),
        adminsCollection.createIndex({ createdAt: -1 }),
      ]);
      
      // Create indexes for savedJobs collection
      const savedJobsCollection = db.collection('savedJobs');
      await Promise.all([
        savedJobsCollection.createIndex({ jobId: 1 }),
        savedJobsCollection.createIndex({ userId: 1 }),
        savedJobsCollection.createIndex({ userEmail: 1 }),
        savedJobsCollection.createIndex({ savedAt: -1 }),
        savedJobsCollection.createIndex({ jobId: 1, userId: 1 }), // Compound index for uniqueness check
        savedJobsCollection.createIndex({ jobId: 1, userEmail: 1 }), // Compound index for uniqueness check
      ]);
      
      // Create indexes for referrals collection
      const referralsCollection = db.collection('referrals');
      await Promise.all([
        referralsCollection.createIndex({ jobId: 1 }),
        referralsCollection.createIndex({ referrerEmail: 1 }),
        referralsCollection.createIndex({ candidateEmail: 1 }),
        referralsCollection.createIndex({ employeeId: 1 }),
        referralsCollection.createIndex({ status: 1 }),
        referralsCollection.createIndex({ createdAt: -1 }),
        referralsCollection.createIndex({ jobId: 1, status: 1 }), // Compound index for filtering
      ]);
      
      console.log('Database indexes created successfully');
    } catch (error) {
      // Indexes might already exist, which is fine
      if (!error.message.includes('already exists')) {
        console.error('Error creating indexes:', error);
      }
    }
  }).catch(() => {
    // Connection will be established when needed
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

