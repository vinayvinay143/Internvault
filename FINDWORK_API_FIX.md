# Findwork API Fix

## What Was Wrong

The Findwork API was using the wrong authorization header format:
- ❌ **Before:** `Authorization: Token YOUR_API_KEY`
- ✅ **After:** `Authorization: Bearer YOUR_API_KEY`

## Changes Made

### 1. Fixed Authorization Header
Updated `src/services/internshipApis.js` line 70:
```javascript
// Changed from:
"Authorization": `Token ${apiKey}`,

// To:
"Authorization": `Bearer ${apiKey}`,
```

### 2. Enhanced Error Logging
The API now shows detailed error messages in the browser console, including:
- HTTP status codes (401, 403, 429, etc.)
- Error response text
- Specific error messages

## How to Test

### Option 1: Test with Node.js Script
```bash
node test-findwork-api.js YOUR_API_KEY_HERE
```

This will:
- Test your API key
- Show if it's working
- Display sample job results
- Give specific error messages if it fails

### Option 2: Test in Browser
1. Make sure your `.env` file has:
   ```
   VITE_FINDWORK_API_KEY=your_actual_key_here
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Open the app and go to the Internships page (must be logged in)

4. Open browser console (F12) and look for:
   - ✅ "Findwork - Tech Opportunities" section with jobs
   - ❌ "Findwork API Error: 401" or similar error messages

## Getting a Valid API Key

1. Go to: https://findwork.dev/developers/
2. Sign up or log in
3. Get your API key from the dashboard
4. Copy it to your `.env` file

## Common Error Codes

- **401 Unauthorized**: Invalid or expired API key
- **403 Forbidden**: API key doesn't have permission
- **429 Too Many Requests**: Rate limit exceeded, wait a moment
- **404 Not Found**: Wrong endpoint URL

## Next Steps

After fixing the authorization header:
1. Restart your dev server
2. Check if jobs appear in the "Findwork - Tech Opportunities" section
3. If still not working, check browser console for specific error messages
