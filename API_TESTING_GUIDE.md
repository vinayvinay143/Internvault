# Testing Internship APIs

This guide will help you test each API integration to ensure they're working correctly.

## 🧪 Quick Test Checklist

### 1. Findwork API Test

**Status:** ✅ Implementation matches official documentation

**Authentication Format:**
```
Authorization: Token YOUR_API_KEY
```

**Test Command (PowerShell):**
```powershell
# Replace YOUR_API_KEY with your actual Findwork API key
$headers = @{
    "Authorization" = "Token YOUR_API_KEY"
}
Invoke-RestMethod -Uri "https://findwork.dev/api/jobs/?search=internship" -Headers $headers -Method Get
```

**Expected Response:**
```json
{
  "count": 4385,
  "next": "https://findwork.dev/api/jobs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 12345,
      "role": "Frontend Developer Intern",
      "company_name": "TechCorp",
      "location": "Remote",
      "url": "https://...",
      "text": "Job description...",
      "employment_type": "Internship",
      "logo": "https://..."
    }
  ]
}
```

---

### 2. Jooble API Test

**Test Command (PowerShell):**
```powershell
# Replace YOUR_API_KEY with your Jooble API key
$body = @{
    keywords = "internship"
    location = "Remote"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://jooble.org/api/YOUR_API_KEY" -Method Post -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "totalCount": 1234,
  "jobs": [
    {
      "title": "Software Engineer Intern",
      "company": "Company Name",
      "location": "Remote",
      "link": "https://...",
      "snippet": "Job description..."
    }
  ]
}
```

---

### 3. IndianAPI Test

**Test Command (PowerShell):**
```powershell
# Replace YOUR_API_KEY with your IndianAPI key
$headers = @{
    "Authorization" = "Bearer YOUR_API_KEY"
}
Invoke-RestMethod -Uri "https://indianapi.in/api/jobs?query=internship&location=India&limit=20" -Headers $headers -Method Get
```

---

### 4. Arbeitnow API Test (FREE - No API Key Required!)

**Test Command (PowerShell):**
```powershell
# No API key needed!
Invoke-RestMethod -Uri "https://www.arbeitnow.com/api/job-board-api?search=internship" -Method Get
```

**Expected Response:**
```json
{
  "data": [
    {
      "slug": "frontend-developer-123",
      "title": "Frontend Developer",
      "company_name": "StartupXYZ",
      "location": "Berlin, Germany",
      "url": "https://...",
      "description": "Job description...",
      "job_types": ["Full-time", "Remote"],
      "tags": ["React", "TypeScript"]
    }
  ]
}
```

---

## 🔍 Testing in the Application

### Step 1: Add API Keys to .env

Open `InternVault/.env` and add your keys:

```env
VITE_FINDWORK_API_KEY=your_actual_findwork_token_here
VITE_JOOBLE_API_KEY=your_actual_jooble_key_here
VITE_INDIANAPI_API_KEY=your_actual_indianapi_key_here
VITE_ARBEITNOW_API_KEY=optional
```

### Step 2: Restart Frontend Server

```bash
# Stop the server (Ctrl+C)
# Then restart
cd InternVault
npm run dev
```

### Step 3: Test in Browser

1. Open browser to `http://localhost:5173`
2. Login to your account
3. Navigate to **Internships** page
4. Open browser DevTools (F12)
5. Go to **Console** tab
6. Look for API responses

**What to look for:**
- ✅ No "API key not configured" warnings
- ✅ Job listings appearing in sections
- ✅ Different colored section headers (blue, purple, orange, green)
- ✅ Jobs from multiple sources

### Step 4: Check Console for Errors

**Good signs:**
```
✅ No errors in console
✅ Jobs loading from multiple APIs
✅ Sections appearing with jobs
```

**Warning signs (but not critical):**
```
⚠️ "Findwork API key not configured" - Add your API key
⚠️ "IndianAPI key not configured" - Add your API key
⚠️ "Jooble API key not configured" - Add your API key
```

**Error signs:**
```
❌ "Failed to fetch Findwork jobs" - Check API key validity
❌ "Network error" - Check internet connection
❌ "401 Unauthorized" - API key is invalid
```

---

## 🐛 Troubleshooting

### Findwork API Issues

**Problem:** "401 Unauthorized"
- **Solution:** Check that your API token is correct
- **Verify:** Token format should be like `abc123def456...`
- **Check:** Make sure you're using `Token` not `Bearer` in auth header

**Problem:** "No jobs appearing"
- **Solution:** Try different search terms
- **Check:** Your free tier limit (1000 requests/month)

### Jooble API Issues

**Problem:** "Failed to fetch"
- **Solution:** Verify API key in email from Jooble
- **Check:** Make sure you're approved (can take 24-48 hours)

### IndianAPI Issues

**Problem:** "API key not configured"
- **Solution:** Sign up at indianapi.in and get your key
- **Check:** Make sure you've subscribed to the Jobs API

### Arbeitnow Issues

**Problem:** "No jobs appearing"
- **Solution:** This is normal if there are no matching jobs
- **Note:** This API is FREE and always works without a key!

---

## 📊 Expected Results

When all APIs are configured correctly, you should see:

### On Internships Page (Logged In):

1. **Premium Opportunities** (top section)
   - Your hosted internships from database

2. **Jooble - Remote Openings** (blue header)
   - Up to 8 jobs from Jooble API

3. **Findwork - Tech Opportunities** (purple header)
   - Up to 8 tech jobs from Findwork API

4. **IndianAPI - India Opportunities** (orange header)
   - Up to 8 India-specific jobs

5. **Arbeitnow - European & Remote** (green header)
   - Up to 8 European/remote jobs

---

## 🎯 API Status Check

You can check which APIs are configured by opening the browser console and typing:

```javascript
import { getAPIStatus } from './src/services/internshipApis';
getAPIStatus();
```

**Expected output:**
```javascript
{
  jooble: true,      // ✅ Configured
  findwork: true,    // ✅ Configured
  indianapi: false,  // ❌ Not configured
  arbeitnow: true    // ✅ Always true (free API)
}
```

---

## 📝 Notes

1. **Arbeitnow is FREE** - It works without any API key!
2. **Start with Arbeitnow** - Test this first since it requires no setup
3. **API Keys are Optional** - The app works with any combination of APIs
4. **Rate Limits** - Be aware of free tier limits:
   - Jooble: 100 requests/day
   - Findwork: 1000 requests/month
   - IndianAPI: Check your plan
   - Arbeitnow: Unlimited (free tier)

---

## ✅ Success Criteria

Your integration is successful when:

- [ ] No console errors related to API calls
- [ ] At least one API section shows jobs
- [ ] Job cards display correctly with company, title, location
- [ ] "Apply Now" buttons link to correct job URLs
- [ ] Different API sections have different colored headers
- [ ] Page loads without crashing

---

**Need Help?** Check:
- [INTERNSHIP_API_GUIDE.md](./INTERNSHIP_API_GUIDE.md) - Full API documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - General setup instructions
- Browser console for specific error messages
