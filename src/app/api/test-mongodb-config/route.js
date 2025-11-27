import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

/**
 * GET /api/test-mongodb-config
 * Test endpoint to check MongoDB configuration on production
 * This endpoint checks if MONGODB_URI is configured without exposing sensitive data
 */
export async function GET() {
  try {
    // Check if MONGODB_URI exists
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: 'MONGODB_URI is not configured',
          message: 'Please add MONGODB_URI in Vercel Dashboard → Settings → Environment Variables',
          help: {
            local: 'Add MONGODB_URI to your .env.local file',
            production: 'Add MONGODB_URI in Vercel Dashboard → Settings → Environment Variables',
            environments: 'Make sure to select Production, Preview, and Development environments',
          },
        },
        { status: 500 }
      );
    }

    // Validate format (without exposing the actual URI)
    const isValidFormat = mongoUri.startsWith('mongodb+srv://');
    const hasPassword = mongoUri.includes(':') && mongoUri.split(':').length >= 3;
    const hasCluster = mongoUri.includes('@') && mongoUri.includes('.mongodb.net');
    const hasDatabase = mongoUri.includes('.mongodb.net/') && mongoUri.split('.mongodb.net/')[1]?.split('?')[0];

    // Extract safe info (without password)
    const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
    const username = uriMatch ? uriMatch[1] : 'unknown';
    const cluster = uriMatch ? uriMatch[3] : 'unknown';
    const database = uriMatch ? uriMatch[4] : 'unknown';

    // Format validation results
    const formatCheck = {
      hasCorrectPrefix: isValidFormat,
      hasPassword: hasPassword,
      hasCluster: hasCluster,
      hasDatabase: hasDatabase,
      username: username,
      cluster: cluster,
      database: database,
    };

    if (!isValidFormat || !hasPassword || !hasCluster || !hasDatabase) {
      return NextResponse.json(
        {
          success: false,
          configured: true,
          formatValid: false,
          error: 'MONGODB_URI format is invalid',
          formatCheck,
          message: 'Connection string format is incorrect. Expected: mongodb+srv://username:password@cluster.mongodb.net/database',
          help: {
            format: 'mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority',
            checkPassword: 'Make sure password is included (not empty, not <password>)',
            checkFormat: 'Connection string must start with mongodb+srv://',
          },
        },
        { status: 500 }
      );
    }

    // Try to connect (with timeout)
    let connectionTest = {
      canConnect: false,
      error: null,
    };

    try {
      const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      await client.connect();
      const db = client.db();
      await db.admin().ping(); // Test connection
      await client.close();

      connectionTest.canConnect = true;
    } catch (connectionError) {
      connectionTest.canConnect = false;
      connectionTest.error = {
        name: connectionError.name,
        message: connectionError.message,
        suggestions: getConnectionErrorSuggestions(connectionError),
      };
    }

    // Return results
    if (connectionTest.canConnect) {
      return NextResponse.json(
        {
          success: true,
          configured: true,
          formatValid: true,
          connectionTest: {
            canConnect: true,
            message: 'Successfully connected to MongoDB!',
          },
          info: {
            username,
            cluster,
            database,
            environment: process.env.NODE_ENV || 'unknown',
            isVercel: !!process.env.VERCEL,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          configured: true,
          formatValid: true,
          connectionTest,
          info: {
            username,
            cluster,
            database,
            environment: process.env.NODE_ENV || 'unknown',
            isVercel: !!process.env.VERCEL,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error while checking MongoDB configuration',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Get helpful suggestions based on connection error type
 */
function getConnectionErrorSuggestions(error) {
  const suggestions = [];

  if (error.name === 'MongoServerSelectionError') {
    suggestions.push('Check your internet connection');
    suggestions.push('Verify MongoDB Atlas cluster is running (not paused)');
    suggestions.push('Check IP whitelist in MongoDB Atlas: Network Access → IP Access List → Add 0.0.0.0/0');
  } else if (error.name === 'MongoAuthenticationError') {
    suggestions.push('Check your username and password are correct');
    suggestions.push('If password has special characters, URL-encode them (@ → %40, # → %23)');
    suggestions.push('Try resetting password in MongoDB Atlas Dashboard');
  } else if (error.name === 'MongoNetworkError') {
    suggestions.push('Check your internet connection');
    suggestions.push('Verify firewall settings');
    suggestions.push('Check MongoDB Atlas IP whitelist');
  } else {
    suggestions.push('Check connection string format');
    suggestions.push('Verify MongoDB Atlas cluster is accessible');
    suggestions.push('Check MongoDB Atlas status page for outages');
  }

  return suggestions;
}

