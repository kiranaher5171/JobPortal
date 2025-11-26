# Fix Build Error - routes-manifest.json Missing

## Problem
The error `ENOENT: no such file or directory, open '.next/routes-manifest.json'` occurs when the `.next` directory is corrupted or incomplete.

## Solution Steps

### Step 1: Stop the Dev Server
Press `Ctrl + C` in the terminal where `npm run dev` is running to stop the server.

### Step 2: Clean the Build Directory
Run one of these commands:

**Option A - Using npm script (after installing rimraf):**
```bash
npm install
npm run clean
```

**Option B - Manual cleanup (Windows PowerShell):**
```powershell
# Stop any running Node processes first
Get-Process node | Stop-Process -Force

# Then delete .next directory
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

**Option C - Manual cleanup (Command Prompt):**
```cmd
taskkill /F /IM node.exe
rmdir /s /q .next
```

### Step 3: Rebuild
```bash
npm run build
```

### Step 4: Start Dev Server
```bash
npm run dev
```

## Alternative: Quick Fix Script

If the above doesn't work, try:

```bash
# Install rimraf if not already installed
npm install --save-dev rimraf

# Clean and rebuild
npm run clean
npm run build
npm run dev
```

## Prevention

The `.next` directory is already in `.gitignore`, so it won't be committed. Always stop the dev server before cleaning the `.next` directory.

