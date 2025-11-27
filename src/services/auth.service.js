import clientPromise from '@/lib/mongodb';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Register new user
 */
export async function registerUser(userData) {
  const { firstName, lastName, email, password, role } = userData;

  const client = await clientPromise;
  const db = client.db('jobportal');
  const collectionName = role === 'admin' ? 'admins' : 'users';
  const collection = db.collection(collectionName);

  // Check if user exists
  const existingUser = await collection.findOne({ email: email.trim() });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const user = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password: hashedPassword,
    role: role,
    name: fullName,
    username: email.trim(), // Keep username for backward compatibility, use email
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(user);
  const userId = result.insertedId.toString();

  // Generate tokens
  const tokenPayload = {
    _id: userId,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: { ...userWithoutPassword, _id: userId },
    accessToken,
    refreshToken,
  };
}

/**
 * Login user
 */
export async function loginUser(email, password) {
  const client = await clientPromise;
  const db = client.db('jobportal');

  // Check in users collection first
  let user = await db.collection('users').findOne({ email: email.trim() });
  let collectionName = 'users';

  // If not found, check admins collection
  if (!user) {
    user = await db.collection('admins').findOne({ email: email.trim() });
    collectionName = 'admins';
  }

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const tokenPayload = {
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: { ...userWithoutPassword, _id: user._id.toString() },
    accessToken,
    refreshToken,
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId, role) {
  const { ObjectId } = await import('mongodb');
  const client = await clientPromise;
  const db = client.db('jobportal');
  
  // Convert string ID to ObjectId if needed
  const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  // Try both collections if role not specified
  if (role) {
    const collectionName = role === 'admin' ? 'admins' : 'users';
    const collection = db.collection(collectionName);
    const user = await collection.findOne({ _id: userObjectId });
    if (!user) {
      throw new Error('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() };
  } else {
    // Try users first, then admins
    let user = await db.collection('users').findOne({ _id: userObjectId });
    if (!user) {
      user = await db.collection('admins').findOne({ _id: userObjectId });
    }
    if (!user) {
      throw new Error('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() };
  }
}

