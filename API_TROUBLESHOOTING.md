# API Key Troubleshooting Guide

## Current Status

Your InternVault application uses the following APIs:
1. **Jooble** - Job search integration
2. **Findwork** - Tech job listings (you mentioned this one)
3. **IndianAPI** - Indian job listings
4. **Arbeitnow** - European/Remote jobs (free, no key required)

**Note:** There is NO USA Jobs API integration in your codebase. If you want to add it, we'll need to integrate it separately.

## How to Fix API Key Issues

### Step 1: Check Your .env File

Open `InternVault/.env` and verify you have these lines:

```env
VITE_FINDWORK_API_KEY=your_actual_findwork_key_here
VITE_JOOBLE_API_KEY=your_actual_jooble_key_here
VITE_INDIANAPI_API_KEY=your_actual_indianapi_key_here
VITE_ARBEITNOW_API_KEY=optional_arbeitnow_key_here
```

### Step 2: Get Valid API Keys

#### Findwork API
1. Go to: https://findwork.dev/developers/
2. Sign up for an account
3. Get your API token
4. Copy it to your `.env` file as `VITE_FINDWORK_API_KEY=your_token_here`

#### Jooble API
1. Go to: https://jooble.org/api/about
2. Request API access
3. Get your API key
4. Copy it to your `.env` file as `VITE_JOOBLE_API_KEY=your_key_here`

#### IndianAPI
1. Go to: https://indianapi.in/
2. Sign up and get your API key
3. Copy it to your `.env` file as `VITE_INDIANAPI_API_KEY=your_key_here`

### Step 3: Restart Your Development Server

After updating the `.env` file, you MUST restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for error messages like:
   - `Findwork API Error: 401 Unauthorized` - Invalid API key
   - `Findwork API Error: 403 Forbidden` - API key doesn't have permission
   - `Findwork API key not configured` - API key not set in .env

### Step 5: Test API Calls

Open the browser console and check which APIs are working:
- Look for messages like "Findwork API Error:" or "Jooble API Error:"
- If you see "API key not configured" warnings, the keys aren't set properly

## Common Issues

### Issue 1: API Key Not Working After Setting It
**Solution:** Restart your dev server. Vite only reads `.env` on startup.

### Issue 2: Getting 401/403 Errors
**Solution:** Your API key is invalid or expired. Get a new one from the provider.

### Issue 3: No Jobs Showing Up
**Solution:** 
- Check browser console for errors
- Verify you're logged in (APIs only work when logged in)
- Check if the API provider's service is down

### Issue 4: "USA Jobs API Not Working"
**Solution:** There is no USA Jobs API in your code. You might mean:
- Jooble (general job search)
- Findwork (tech jobs)
- IndianAPI (Indian jobs)

If you want to add USA Jobs API (usajobs.gov), let me know and I'll help integrate it.

## Quick Diagnostic

Run this in your browser console while on the internship page:

```javascript
// Check which APIs are configured
import { getAPIStatus } from './src/services/internshipApis.js';
console.log(getAPIStatus());
```

## Need Help?

If you're still having issues:
1. Share the exact error message from the browser console
2. Confirm which specific API is not working (Findwork, Jooble, etc.)
3. Let me know if you want to add USA Jobs API integration
