# CORS Fix & USA Jobs Integration - Complete Setup Guide

## 🎯 What Was Fixed

### Problem
- **CORS Error**: Findwork API (and other APIs) blocked browser requests from `localhost:5173`
- **Missing USA Jobs**: No federal internship opportunities

### Solution
- ✅ Created **backend proxy** to handle all API calls server-side (bypasses CORS)
- ✅ Integrated **USA Jobs API** for federal internship opportunities
- ✅ Moved all API keys to **backend** for security and CORS compliance

## 📋 Setup Instructions

### Step 1: Configure Backend API Keys

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy the template:**
   ```bash
   copy .env.template .env
   ```

3. **Edit `backend/.env` and add your API keys:**

   ```env
   # Findwork API
   FINDWORK_API_KEY=your_actual_findwork_key_here
   
   # USA Jobs API
   USAJOBS_API_KEY=your_actual_usajobs_key_here
   USAJOBS_EMAIL=your_email@example.com
   
   # Jooble API (optional)
   JOOBLE_API_KEY=your_jooble_key_here
   
   # IndianAPI (optional)
   INDIANAPI_API_KEY=your_indianapi_key_here
   ```

### Step 2: Get API Keys

#### Findwork API
1. Go to: https://findwork.dev/developers/
2. Sign up/login
3. Get your API token
4. Add to `backend/.env` as `FINDWORK_API_KEY`

#### USA Jobs API
1. Go to: https://developer.usajobs.gov
2. Register for an account
3. Get your API key
4. Add to `backend/.env` as:
   - `USAJOBS_API_KEY=your_key`
   - `USAJOBS_EMAIL=your_email@example.com`

#### Jooble API (Optional)
1. Go to: https://jooble.org/api/about
2. Request API access
3. Add to `backend/.env` as `JOOBLE_API_KEY`

#### IndianAPI (Optional)
1. Go to: https://indianapi.in/
2. Sign up and get API key
3. Add to `backend/.env` as `INDIANAPI_API_KEY`

### Step 3: Restart Backend Server

**IMPORTANT:** You must restart the backend for `.env` changes to take effect!

```bash
# Stop the current backend server (Ctrl+C)
# Then restart it
cd backend
npm run dev
```

### Step 4: Frontend is Already Updated

The frontend has been updated to use the backend proxy automatically. No frontend `.env` changes needed for these APIs!

## 🧪 Testing

### Test Backend Proxy Endpoints

1. **Check if backend is running:**
   ```
   http://localhost:5000/api/health
   ```

2. **Test Findwork proxy:**
   ```
   http://localhost:5000/api/internships/findwork?search=internship
   ```

3. **Test USA Jobs proxy:**
   ```
   http://localhost:5000/api/internships/usajobs?keyword=internship
   ```

### Test in Application

1. **Start both servers** (if not already running):
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd InternVault
   npm run dev
   ```

2. **Open application:**
   ```
   http://localhost:5173
   ```

3. **Login** and go to Internships page

4. **Look for these sections:**
   - ✅ Jooble - Remote Openings
   - ✅ Findwork - Tech Opportunities (if key configured)
   - ✅ IndianAPI - India Opportunities (if key configured)
   - ✅ Arbeitnow - European & Remote
   - ✅ USA Jobs - Federal Opportunities (if key configured)

5. **Check browser console (F12)** for any errors

## 🔍 Troubleshooting

### "API key not configured" errors

**Problem:** Backend .env file doesn't have the API key

**Solution:**
1. Check `backend/.env` file exists (not just `.env.template`)
2. Verify API key is set correctly
3. Restart backend server

### No jobs showing up

**Problem:** API key might be invalid or API is down

**Solution:**
1. Check browser console for specific error messages
2. Test the backend proxy endpoint directly in browser
3. Verify API key is valid by testing on the provider's website

### CORS errors still appearing

**Problem:** Frontend might be calling APIs directly instead of using proxy

**Solution:**
1. Make sure you updated `internshipApis.js` with the new version
2. Clear browser cache and reload
3. Check that `API_URL` in `internshipApis.js` points to `http://localhost:5000/api/internships`

### Backend server not starting

**Problem:** Port 5000 might be in use or dependencies missing

**Solution:**
```bash
cd backend
npm install
npm run dev
```

## 📊 What Changed

### Backend Files
- ✅ **NEW:** `backend/routes/internships.js` - Proxy routes for all APIs
- ✅ **MODIFIED:** `backend/server.js` - Added internships route
- ✅ **MODIFIED:** `backend/.env.template` - Added API key templates

### Frontend Files
- ✅ **MODIFIED:** `InternVault/src/services/internshipApis.js` - Now uses backend proxy
- ✅ **MODIFIED:** `InternVault/src/pages/internship.jsx` - Added USA Jobs section

## 🎉 Benefits

1. **No more CORS errors** - All API calls go through backend
2. **Better security** - API keys hidden in backend, not exposed to browser
3. **USA Jobs integration** - Access to federal internship opportunities
4. **Consistent error handling** - Better error messages and logging
5. **Easier debugging** - Backend logs show all API requests

## 📝 API Endpoints Available

| API | Endpoint | Method | Parameters |
|-----|----------|--------|------------|
| Findwork | `/api/internships/findwork` | GET | `search`, `location` |
| USA Jobs | `/api/internships/usajobs` | GET | `keyword`, `location` |
| Jooble | `/api/internships/jooble` | POST | `keywords`, `location` |
| IndianAPI | `/api/internships/indianapi` | GET | `query`, `location` |

## ⚠️ Important Notes

- **API keys must be in BACKEND `.env`**, not frontend `.env`
- **Restart backend** after changing `.env` file
- **Arbeitnow** doesn't need a key (free API, still works directly from frontend)
- **USA Jobs** requires both API key AND email address
