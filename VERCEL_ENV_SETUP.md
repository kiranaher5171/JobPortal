# Vercel Environment Variables Setup Guide

## Problem
You're getting "MongoDB connection not configured" error on Vercel deployment, but it works fine locally.

## Solution
Add environment variables in Vercel Dashboard. `.env.local` only works for local development.

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Sign in to your account
- Select your project

### 2. Navigate to Environment Variables
- Click on **Settings** (top menu)
- Click on **Environment Variables** (left sidebar)

### 3. Add Required Variables

Add these three environment variables:

#### Variable 1: `MONGODB_URI`
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://kiran1234:YOUR_PASSWORD@cluster0.lkq2fgk.mongodb.net/jobportal?retryWrites=true&w=majority`
- **Environments**: Select all (Production, Preview, Development)
- **Important**: Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password

#### Variable 2: `JWT_SECRET`
- **Key**: `JWT_SECRET`
- **Value**: `bix8A3OsUIBK6GwakvFyVPcC74hDHTQfYXR1doqgtWNmjM95rlSepEL02zunJZ`
- **Environments**: Select all (Production, Preview, Development)
- **Note**: For production, generate a new random string for better security

#### Variable 3: `JWT_REFRESH_SECRET`
- **Key**: `JWT_REFRESH_SECRET`
- **Value**: `NbVWtFm4Zh8sHfTR0G7loqCUaj3BK159zLexyEOXgkdwAI6cQiPJvunMDrpY2S`
- **Environments**: Select all (Production, Preview, Development)
- **Note**: For production, generate a new random string for better security

#### Variable 4: `NEXT_PUBLIC_BASE_URL` (Optional but recommended)
- **Key**: `NEXT_PUBLIC_BASE_URL`
- **Value**: `https://your-app-name.vercel.app`
- **Environments**: Select all (Production, Preview, Development)
- **Important**: Replace `your-app-name` with your actual Vercel app name

### 4. Save and Redeploy
- Click **Save** after adding each variable
- Go to **Deployments** tab
- Click the **⋯** (three dots) menu on the latest deployment
- Click **Redeploy**
- Or push a new commit to trigger automatic redeploy

## Verify Setup

After redeploying, check:
1. Go to **Deployments** → Latest deployment → **Logs**
2. Look for any errors related to `MONGODB_URI`
3. Try logging in on your deployed site

## Common Issues

### Issue: Still getting "MongoDB connection not configured"
**Solution**: 
- Make sure you selected all environments (Production, Preview, Development)
- Make sure you clicked **Save** after adding the variable
- Make sure you **redeployed** after adding the variable
- Check that the variable name is exactly `MONGODB_URI` (case-sensitive)

### Issue: Connection works locally but not on Vercel
**Solution**: 
- Environment variables in `.env.local` are NOT automatically used in Vercel
- You MUST add them manually in Vercel Dashboard
- Each environment (Production, Preview, Development) needs the variables separately

### Issue: Password has special characters
**Solution**: 
- URL-encode special characters in your MongoDB password
- For example: `@` becomes `%40`, `#` becomes `%23`, etc.
- Or change your MongoDB password to one without special characters

## Quick Checklist

- [ ] Added `MONGODB_URI` in Vercel Dashboard
- [ ] Added `JWT_SECRET` in Vercel Dashboard
- [ ] Added `JWT_REFRESH_SECRET` in Vercel Dashboard
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Clicked **Save** for each variable
- [ ] Redeployed the application
- [ ] Tested login on deployed site

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs for detailed error messages
2. Verify your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
3. Verify your MongoDB username and password are correct
4. Check that your MongoDB cluster is running and accessible

