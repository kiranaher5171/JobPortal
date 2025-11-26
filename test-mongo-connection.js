/**
 * MongoDB Connection Test Script
 * Run this to test your MongoDB Atlas connection
 * Usage: node test-mongo-connection.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load .env.local file manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const match = trimmedLine.match(/^([^=:#\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        value = value.replace(/^["']|["']$/g, '');
        if (key && value) {
          process.env[key] = value;
        }
      }
    }
  });
} else {
  console.error('❌ .env.local file not found!');
  console.log('💡 Create .env.local file in the root directory');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env.local!');
  process.exit(1);
}

// Hide password in output
const safeUri = uri.replace(/:[^:@]+@/, ':****@');

console.log('\n🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', safeUri);
console.log('');

async function testConnection() {
  let client;
  
  try {
    console.log('📡 Attempting to connect...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    // Test ping
    console.log('🏓 Testing ping...');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping successful!\n');
    
    // Test database access
    console.log('📊 Testing database access...');
    const db = client.db('jobportal');
    const collections = await db.listCollections().toArray();
    console.log('✅ Database access successful!');
    console.log(`   Collections found: ${collections.length}`);
    if (collections.length > 0) {
      console.log(`   Collection names: ${collections.map(c => c.name).join(', ')}`);
    }
    console.log('');
    
    // Test write (optional)
    console.log('✍️  Testing write operation...');
    const testCollection = db.collection('_connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    console.log('✅ Write operation successful!\n');
    
    console.log('🎉 All tests passed! Your MongoDB connection is working correctly.\n');
    
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('');
    
    // Provide specific guidance based on error
    if (error.message.includes('authentication') || error.message.includes('Authentication')) {
      console.log('💡 Authentication Error - Possible causes:');
      console.log('   1. Incorrect username or password');
      console.log('   2. Password needs URL encoding (if it has special characters)');
      console.log('   3. User doesn\'t exist in MongoDB Atlas');
      console.log('');
      console.log('   Solution:');
      console.log('   - Go to MongoDB Atlas → Database Access');
      console.log('   - Verify your username and password');
      console.log('   - If password has @, #, $, etc., URL-encode them');
      console.log('   - Example: P@ss#123 → P%40ss%23123');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('💡 SSL/TLS Error - Possible causes:');
      console.log('   1. Password encoding issue (most common)');
      console.log('   2. Connection string format issue');
      console.log('   3. Network/firewall blocking SSL');
      console.log('');
      console.log('   Solution:');
      console.log('   - URL-encode your password if it has special characters');
      console.log('   - Verify connection string format is correct');
      console.log('   - Check if database name /jobportal is included');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.log('💡 Timeout Error - Possible causes:');
      console.log('   1. IP address not whitelisted');
      console.log('   2. Network connectivity issues');
      console.log('   3. Firewall blocking connection');
      console.log('');
      console.log('   Solution:');
      console.log('   - Go to MongoDB Atlas → Network Access');
      console.log('   - Add your IP address or "Allow Access from Anywhere"');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('💡 DNS Error - Possible causes:');
      console.log('   1. Incorrect cluster address');
      console.log('   2. Network connectivity issues');
      console.log('');
      console.log('   Solution:');
      console.log('   - Verify cluster address in connection string');
      console.log('   - Check your internet connection');
    } else {
      console.log('💡 General Error - Check:');
      console.log('   1. Connection string format');
      console.log('   2. MongoDB Atlas cluster status');
      console.log('   3. Network connectivity');
    }
    
    console.log('');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed.\n');
    }
  }
}

testConnection();

