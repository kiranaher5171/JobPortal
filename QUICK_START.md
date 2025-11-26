# Quick Start Guide

## MongoDB Connection Setup

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory (same level as `package.json`).

### Step 2: Add MongoDB Connection String

Copy and paste this template into `.env.local`, then replace with your actual MongoDB connection string:

```env
# MongoDB Connection String (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority

# Next.js Base URL (Optional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret (Optional)
JWT_SECRET=your-secret-key-here

# Node Environment
NODE_ENV=development
```

### Step 3: Get Your MongoDB Connection String

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login and create a free cluster
3. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Create username and password
4. Whitelist IP:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `jobportal`

#### Option B: Local MongoDB

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/jobportal
```

### Step 4: Restart Development Server

After creating `.env.local`, restart your server:

```bash
npm run dev
```

## Alternative: Use Setup Script

You can also use the interactive setup script:

```bash
npm run setup:env
```

This will guide you through creating the `.env.local` file step by step.

## Verify Connection

After setup, try accessing:
- `/api/jobs` - Should return jobs (may be empty initially)
- Check browser console for any connection errors

## Troubleshooting

**Error: "MongoDB connection not configured"**
- Make sure `.env.local` exists in the root directory
- Verify `MONGODB_URI` is spelled correctly (case-sensitive)
- Restart your dev server after creating/updating `.env.local`

**Error: "Failed to connect to database"**
- Check your MongoDB connection string format
- Verify your IP is whitelisted (for Atlas)
- Check if MongoDB service is running (for local)
- Verify username and password are correct

## Need More Help?

See `MONGODB_SETUP.md` for detailed instructions and troubleshooting.

