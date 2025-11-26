/**
 * Migrate Local MongoDB to Atlas
 * This script exports data from local MongoDB and imports to MongoDB Atlas
 * 
 * Usage:
 *   1. Make sure you have both local and Atlas connection strings
 *   2. Update the LOCAL_URI and ATLAS_URI below
 *   3. Run: node migrate-to-atlas.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load .env.local file
const envPath = path.join(__dirname, '.env.local');
let LOCAL_URI = 'mongodb://localhost:27017/jobportal'; // Local MongoDB
let ATLAS_URI = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const match = trimmedLine.match(/^([^=:#\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        value = value.replace(/^["']|["']$/g, '');
        if (key && value) {
          if (key === 'MONGODB_URI') {
            ATLAS_URI = value;
          }
        }
      }
    }
  });
}

if (!ATLAS_URI) {
  console.error('❌ MONGODB_URI not found in .env.local!');
  console.log('💡 Make sure your .env.local has the Atlas connection string');
  process.exit(1);
}

const COLLECTIONS = ['admins', 'jobs', 'referrals', 'savedJobs', 'users'];
const DATABASE_NAME = 'jobportal';

async function migrateCollection(localClient, atlasClient, collectionName) {
  try {
    console.log(`\n📦 Migrating collection: ${collectionName}...`);
    
    const localDb = localClient.db(DATABASE_NAME);
    const atlasDb = atlasClient.db(DATABASE_NAME);
    
    const localCollection = localDb.collection(collectionName);
    const atlasCollection = atlasDb.collection(collectionName);
    
    // Check if collection exists in local
    const localCount = await localCollection.countDocuments();
    console.log(`   📊 Local documents: ${localCount}`);
    
    if (localCount === 0) {
      console.log(`   ⚠️  No documents in local ${collectionName}, skipping...`);
      return { collection: collectionName, migrated: 0, skipped: true };
    }
    
    // Get all documents from local
    const documents = await localCollection.find({}).toArray();
    console.log(`   📥 Fetched ${documents.length} documents from local`);
    
    // Check existing documents in Atlas
    const atlasCount = await atlasCollection.countDocuments();
    console.log(`   📊 Atlas documents (before): ${atlasCount}`);
    
    if (atlasCount > 0) {
      console.log(`   ⚠️  Atlas already has ${atlasCount} documents in ${collectionName}`);
      console.log(`   💡 Options:`);
      console.log(`      1. Skip this collection (existing data will remain)`);
      console.log(`      2. Clear and replace (will delete existing data)`);
      console.log(`      3. Merge (will add new documents, may create duplicates)`);
      console.log(`   🔄 Using merge strategy (adding new documents)...`);
    }
    
    // Insert documents into Atlas
    let inserted = 0;
    let errors = 0;
    
    for (const doc of documents) {
      try {
        // Remove _id to let MongoDB generate new ones, or keep existing _id
        // For users/admins, we might want to keep the same _id
        const result = await atlasCollection.insertOne(doc);
        if (result.insertedId) {
          inserted++;
        }
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - document already exists
          console.log(`   ⚠️  Document already exists (skipping duplicate)`);
        } else {
          console.error(`   ❌ Error inserting document:`, error.message);
          errors++;
        }
      }
    }
    
    const finalAtlasCount = await atlasCollection.countDocuments();
    console.log(`   ✅ Migration complete!`);
    console.log(`   📊 Atlas documents (after): ${finalAtlasCount}`);
    console.log(`   ✅ Inserted: ${inserted}`);
    if (errors > 0) {
      console.log(`   ⚠️  Errors: ${errors}`);
    }
    
    return { collection: collectionName, migrated: inserted, errors };
    
  } catch (error) {
    console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
    return { collection: collectionName, migrated: 0, error: error.message };
  }
}

async function migrate() {
  let localClient, atlasClient;
  
  try {
    console.log('🚀 Starting Migration from Local MongoDB to Atlas\n');
    console.log('📋 Collections to migrate:', COLLECTIONS.join(', '));
    console.log('');
    
    // Connect to local MongoDB
    console.log('🔌 Connecting to Local MongoDB...');
    localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    console.log('✅ Connected to Local MongoDB\n');
    
    // Connect to Atlas
    console.log('🔌 Connecting to MongoDB Atlas...');
    atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Test connections
    await localClient.db('admin').command({ ping: 1 });
    await atlasClient.db('admin').command({ ping: 1 });
    console.log('✅ Both connections verified\n');
    
    // Migrate each collection
    const results = [];
    for (const collectionName of COLLECTIONS) {
      const result = await migrateCollection(localClient, atlasClient, collectionName);
      results.push(result);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    
    let totalMigrated = 0;
    results.forEach(result => {
      if (result.skipped) {
        console.log(`   ${result.collection}: ⚠️  Skipped (no data)`);
      } else if (result.error) {
        console.log(`   ${result.collection}: ❌ Error - ${result.error}`);
      } else {
        console.log(`   ${result.collection}: ✅ ${result.migrated} documents migrated`);
        totalMigrated += result.migrated;
      }
    });
    
    console.log('='.repeat(50));
    console.log(`✅ Total documents migrated: ${totalMigrated}`);
    console.log('='.repeat(50));
    console.log('\n🎉 Migration completed!\n');
    console.log('💡 Next steps:');
    console.log('   1. Verify data in MongoDB Atlas');
    console.log('   2. Test your application with Atlas connection');
    console.log('   3. Once verified, you can stop using local MongoDB\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n💡 Tip: Check your MongoDB connection strings');
    }
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Tip: Make sure local MongoDB is running');
      console.error('   Start MongoDB: net start MongoDB (Windows) or sudo systemctl start mongod (Linux)');
    }
  } finally {
    if (localClient) {
      await localClient.close();
      console.log('🔌 Local MongoDB connection closed');
    }
    if (atlasClient) {
      await atlasClient.close();
      console.log('🔌 Atlas connection closed');
    }
  }
}

// Run migration
migrate();

