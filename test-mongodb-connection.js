/**
 * Test MongoDB Connection String
 * 
 * This script tests your MongoDB connection string from .env.local
 * Run: node test-mongodb-connection.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load .env.local file
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.error(`   Expected location: ${envPath}`);
    console.error('\n💡 Create .env.local file in your project root with:');
    console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

// Hide password in connection string for display
function hidePassword(uri) {
  if (!uri) return 'NOT SET';
  return uri.replace(/mongodb\+srv:\/\/[^:]+:([^@]+)@/, 'mongodb+srv://USERNAME:***HIDDEN***@');
}

// Test connection
async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');

  // Load environment variables
  const envVars = loadEnvFile();
  const mongoUri = envVars.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in .env.local!');
    console.error('\n💡 Add this line to your .env.local file:');
    console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }

  console.log('📋 Connection String (password hidden):');
  console.log(`   ${hidePassword(mongoUri)}\n`);

  // Validate format
  if (!mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid connection string format!');
    console.error('   Connection string must start with: mongodb+srv://');
    process.exit(1);
  }

  // Parse connection string
  try {
    const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
    if (!uriMatch) {
      console.error('❌ Invalid connection string format!');
      console.error('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

    const [, username, password, cluster, database] = uriMatch;
    
    console.log('✅ Connection String Format: Valid');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password ? '***' + password.slice(-2) : 'MISSING!'}`);
    console.log(`   Cluster: ${cluster}`);
    console.log(`   Database: ${database}\n`);

    if (!password) {
      console.error('❌ Password is missing in connection string!');
      console.error('   Format: mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error parsing connection string:', error.message);
    process.exit(1);
  }

  // Test connection
  console.log('🔄 Attempting to connect to MongoDB...\n');

  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Connection successful!\n');

    // Test database access
    const db = client.db();
    const dbName = db.databaseName;
    console.log(`📊 Connected to database: ${dbName}`);

    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    }

    // Test a simple query
    try {
      const usersCollection = db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`👥 Users in 'users' collection: ${userCount}`);
    } catch (err) {
      console.log('   ⚠️  Could not count users (collection might not exist yet)');
    }

    console.log('\n🎉 All tests passed! Your MongoDB connection is working correctly.\n');

  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error Details:');
    console.error(`   Name: ${error.name}`);
    console.error(`   Message: ${error.message}\n`);

    // Provide specific guidance based on error type
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Possible Solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas cluster is running (not paused)');
      console.error('   3. Check IP whitelist in MongoDB Atlas:');
      console.error('      - Go to Network Access → IP Access List');
      console.error('      - Add 0.0.0.0/0 to allow all IPs (or add your specific IP)');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('💡 Possible Solutions:');
      console.error('   1. Check your username and password are correct');
      console.error('   2. If password has special characters, URL-encode them:');
      console.error('      @ → %40, # → %23, % → %25, & → %26');
      console.error('   3. Try resetting password in MongoDB Atlas Dashboard');
    } else if (error.name === 'MongoNetworkError') {
      console.error('💡 Possible Solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify firewall settings');
      console.error('   3. Check MongoDB Atlas IP whitelist');
    } else {
      console.error('💡 Check:');
      console.error('   1. Connection string format is correct');
      console.error('   2. Username and password are correct');
      console.error('   3. Cluster address is correct');
      console.error('   4. MongoDB Atlas cluster is running');
    }

    console.error('\n📖 For more help, see: MONGODB_CONNECTION_STRING_GUIDE.md\n');
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Connection closed.\n');
  }
}

// Run the test
testConnection().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

