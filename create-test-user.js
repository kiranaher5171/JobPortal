/**
 * Create Test User Script
 * This script creates a test user in MongoDB for login testing
 * Usage: 
 *   node create-test-user.js
 *   node create-test-user.js --email your@email.com --password YourPassword123
 *   node create-test-user.js --email your@email.com --password YourPassword123 --role admin
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
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

// Load .env.local file manually
const envPath = path.join(__dirname, '.env.local');
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
          process.env[key] = value;
        }
      }
    }
  });
} else {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env.local!');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
let emailArg, passwordArg, roleArg, firstNameArg, lastNameArg;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email' && args[i + 1]) {
    emailArg = args[i + 1];
    i++;
  } else if (args[i] === '--password' && args[i + 1]) {
    passwordArg = args[i + 1];
    i++;
  } else if (args[i] === '--role' && args[i + 1]) {
    roleArg = args[i + 1];
    i++;
  } else if (args[i] === '--firstName' && args[i + 1]) {
    firstNameArg = args[i + 1];
    i++;
  } else if (args[i] === '--lastName' && args[i + 1]) {
    lastNameArg = args[i + 1];
    i++;
  }
}

async function createTestUser() {
  let client;
  
  try {
    console.log('\n🔧 Creating User...\n');
    
    // Get user input if not provided via command line
    let email = emailArg;
    let password = passwordArg;
    let role = roleArg || 'user';
    let firstName = firstNameArg;
    let lastName = lastNameArg;
    
    if (!email) {
      email = await question('Enter email: ');
    }
    
    if (!password) {
      password = await question('Enter password: ');
    }
    
    if (!firstName) {
      firstName = await question('Enter first name (or press Enter for "Test"): ') || 'Test';
    }
    
    if (!lastName) {
      lastName = await question('Enter last name (or press Enter for "User"): ') || 'User';
    }
    
    if (!roleArg) {
      const roleInput = await question('Enter role (user/admin, default: user): ') || 'user';
      role = roleInput.toLowerCase();
    }
    
    // Validate role
    if (!['admin', 'user'].includes(role)) {
      console.error('❌ Invalid role. Must be "user" or "admin"');
      rl.close();
      return;
    }
    
    // Validate password
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format');
      rl.close();
      return;
    }
    
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('jobportal');
    const collectionName = role === 'admin' ? 'admins' : 'users';
    const collection = db.collection(collectionName);
    
    // Check if user already exists
    const existingUser = await collection.findOne({ email: email.trim() });
    if (existingUser) {
      console.log(`⚠️  User with email "${email}" already exists!`);
      console.log('\n💡 You can use these credentials to login, or delete the user and run this script again.\n');
      await client.close();
      rl.close();
      return;
    }
    
    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const user = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: role,
      name: fullName,
      username: email.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(user);
    console.log('✅ User created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
    console.log(`   Name: ${fullName}`);
    console.log('\n💡 You can now use these credentials to login to your application.\n');
    
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n💡 Tip: Check your MongoDB connection string and credentials');
    }
  } finally {
    if (client) {
      await client.close();
    }
    rl.close();
  }
}

createTestUser();

