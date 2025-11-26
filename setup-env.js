#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps you create a .env.local file with the required environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🚀 MongoDB Environment Setup\n');
  console.log('This script will help you create a .env.local file.\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n📝 Please provide the following information:\n');

  // MongoDB URI
  console.log('MongoDB Connection String:');
  console.log('  - For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority');
  console.log('  - For Local MongoDB: mongodb://localhost:27017/jobportal');
  const mongodbUri = await question('\nMONGODB_URI: ');

  if (!mongodbUri || mongodbUri.trim() === '') {
    console.log('\n❌ MongoDB URI is required. Setup cancelled.');
    rl.close();
    return;
  }

  // Base URL (optional)
  const baseUrl = await question('\nNEXT_PUBLIC_BASE_URL (optional, press Enter for default): ');
  const finalBaseUrl = baseUrl.trim() || 'http://localhost:3000';

  // JWT Secret (optional)
  const jwtSecret = await question('\nJWT_SECRET (optional, press Enter to skip): ');
  const finalJwtSecret = jwtSecret.trim() || 'your-secret-key-change-in-production';

  // Build .env.local content
  let envContent = `# MongoDB Connection String (Required)
MONGODB_URI=${mongodbUri.trim()}

# Next.js Base URL
NEXT_PUBLIC_BASE_URL=${finalBaseUrl}

# JWT Secret for authentication tokens
JWT_SECRET=${finalJwtSecret}

# Node Environment
NODE_ENV=development
`;

  // Write .env.local file
  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n✅ Successfully created .env.local file!');
    console.log('\n📋 Next steps:');
    console.log('  1. Restart your development server: npm run dev');
    console.log('  2. The MongoDB connection should now work');
    console.log('\n⚠️  Important: .env.local is in .gitignore and will not be committed to Git.\n');
  } catch (error) {
    console.error('\n❌ Error creating .env.local file:', error.message);
  }

  rl.close();
}

setup().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

