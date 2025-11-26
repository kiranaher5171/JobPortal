# MongoDB Setup Guide

## Quick Setup

1. **Create a `.env.local` file** in the root directory of your project (same level as `package.json`)

2. **Add your MongoDB connection string** to `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
```

## MongoDB Atlas Setup (Cloud - Recommended)

1. **Create a MongoDB Atlas account** (free tier available):
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a new cluster**:
   - Choose a cloud provider and region
   - Select the free tier (M0)

3. **Create a database user**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"

4. **Whitelist your IP address**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add specific IPs
   - For production, use specific IPs only

5. **Get your connection string**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `jobportal` (or your preferred database name)

6. **Add to `.env.local`**:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/jobportal?retryWrites=true&w=majority
```

## Local MongoDB Setup

If you have MongoDB installed locally:

1. **Start MongoDB service**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Add to `.env.local`**:
```env
MONGODB_URI=mongodb://localhost:27017/jobportal
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Required
MONGODB_URI=your-mongodb-connection-string

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Important Notes

- **Never commit `.env.local` to Git** - it's already in `.gitignore`
- **Use different MongoDB databases** for development and production
- **Keep your MongoDB credentials secure**
- The database name in the connection string should be `jobportal` (or update it in `src/lib/mongodb.js`)

## Testing the Connection

After setting up `.env.local`:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the console for connection messages
3. Try accessing any API route that uses MongoDB (e.g., `/api/jobs`)

## Troubleshooting

### "MongoDB connection not configured"
- Make sure `.env.local` exists in the root directory
- Verify `MONGODB_URI` is spelled correctly
- Restart your development server after creating/updating `.env.local`

### "Failed to connect to database"
- Check your MongoDB connection string format
- Verify your IP is whitelisted (for Atlas)
- Check if MongoDB service is running (for local)
- Verify username and password are correct

### Connection timeout
- Check your internet connection (for Atlas)
- Verify network access settings in MongoDB Atlas
- Check firewall settings

## Production Deployment

For production (Vercel, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Use the same variable names as in `.env.local`
3. Use a production MongoDB database (not the free tier for production)
4. Set `NODE_ENV=production`

### Vercel Setup:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `MONGODB_URI` with your production connection string
4. Redeploy your application

