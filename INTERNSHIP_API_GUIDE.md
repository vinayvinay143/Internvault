# Internship API Integration Guide

This document provides detailed information about all the internship/job APIs integrated into InternVault.

---

## 📊 API Overview

InternVault integrates **4 different job/internship APIs** to provide comprehensive job listings:

| API | Focus | Coverage | API Key Required | Free Tier |
|-----|-------|----------|------------------|-----------|
| **Jooble** | General Jobs | Global | ✅ Yes | ✅ Yes |
| **Findwork** | Tech Jobs | Global (Remote) | ✅ Yes | ✅ Yes |
| **IndianAPI** | All Jobs | India | ✅ Yes | ✅ Yes |
| **Arbeitnow** | Tech/Remote | Europe + Remote | ❌ Optional | ✅ Yes |

---

## 1️⃣ Jooble API

### Overview
Jooble is a job search aggregator that collects listings from thousands of websites worldwide.

### Setup
1. Visit: [https://jooble.org/api/about](https://jooble.org/api/about)
2. Fill out the registration form with:
   - Your name
   - Email address
   - Website URL (can use localhost for development)
   - Brief description of your project
3. Wait for approval email (usually within 24-48 hours)
4. Copy your API key from the email
5. Add to `.env`: `VITE_JOOBLE_API_KEY=your_key_here`

### Features
- ✅ Global job coverage
- ✅ Multiple languages supported
- ✅ Remote job filtering
- ✅ Free tier: 100 requests/day

### API Documentation
- [Official Docs](https://jooble.org/api/about)

---

## 2️⃣ Findwork API

### Overview
Findwork specializes in tech jobs, particularly for developers, designers, and remote workers.

### Setup
1. Visit: [https://findwork.dev/developers/](https://findwork.dev/developers/)
2. Click "Sign Up" and create an account
3. Navigate to your Dashboard
4. Go to "API Tokens" section
5. Click "Generate New Token"
6. Copy the token
7. Add to `.env`: `VITE_FINDWORK_API_KEY=your_token_here`

### Features
- ✅ Tech-focused listings (developers, designers, etc.)
- ✅ Remote-first opportunities
- ✅ Startup and established companies
- ✅ Clean, well-structured data
- ✅ Free tier: 1000 requests/month

### API Documentation
- [Official Docs](https://findwork.dev/developers/)
- Endpoint: `https://findwork.dev/api/jobs/`
- Method: GET
- Headers: `Authorization: Token YOUR_API_KEY`

### Example Response
```json
{
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

## 3️⃣ IndianAPI

### Overview
IndianAPI provides job listings specifically for the Indian market, including internships across various cities.

### Setup
1. Visit: [https://indianapi.in/](https://indianapi.in/)
2. Click "Sign Up" or "Register"
3. Create your account
4. Navigate to "APIs" section
5. Subscribe to the "Jobs API" (free tier available)
6. Copy your API key from dashboard
7. Add to `.env`: `VITE_INDIANAPI_API_KEY=your_key_here`

### Features
- ✅ India-specific job market
- ✅ Internships in major Indian cities
- ✅ Local company opportunities
- ✅ Multiple job categories
- ✅ Free tier available

### API Documentation
- [Official Website](https://indianapi.in/)
- Endpoint: `https://indianapi.in/api/jobs`
- Method: GET
- Headers: `Authorization: Bearer YOUR_API_KEY`

### Query Parameters
- `query`: Search keywords (e.g., "internship")
- `location`: City/region in India
- `limit`: Number of results (default: 20)

---

## 4️⃣ Arbeitnow API

### Overview
Arbeitnow focuses on European tech jobs and remote opportunities. **The basic API is completely FREE and doesn't require an API key!**

### Setup
1. **For Basic Usage (FREE):**
   - No signup required!
   - Just start using the API
   - Set `VITE_ARBEITNOW_API_KEY=optional` in `.env`

2. **For Premium Features (Optional):**
   - Visit: [https://www.arbeitnow.com/api](https://www.arbeitnow.com/api)
   - Sign up for premium access
   - Get your API key
   - Add to `.env`: `VITE_ARBEITNOW_API_KEY=your_key_here`

### Features
- ✅ **Completely FREE basic tier**
- ✅ European job market focus
- ✅ Remote-first opportunities
- ✅ Tech and startup jobs
- ✅ No rate limits on basic tier
- ✅ Well-maintained and reliable

### API Documentation
- [Official Docs](https://www.arbeitnow.com/api)
- Endpoint: `https://www.arbeitnow.com/api/job-board-api`
- Method: GET
- No authentication required for basic usage

### Example Response
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

## 🔧 Implementation Details

### Service File Location
```
InternVault/src/services/internshipApis.js
```

### Functions Available

#### `fetchJoobleJobs(keywords, location)`
Fetches jobs from Jooble API.

#### `fetchFindworkJobs(search, location)`
Fetches tech jobs from Findwork API.

#### `fetchIndianAPIJobs(query, location)`
Fetches Indian job listings.

#### `fetchArbeitnowJobs(search, location)`
Fetches European/Remote jobs.

#### `fetchAllInternships(options)`
Fetches from all APIs in parallel and returns combined results.

#### `getAPIStatus()`
Returns which APIs are configured and ready to use.

---

## 📝 Environment Variables Summary

Add these to `InternVault/.env`:

```env
# Required for Jooble
VITE_JOOBLE_API_KEY=your_jooble_key_here

# Required for Findwork
VITE_FINDWORK_API_KEY=your_findwork_token_here

# Required for IndianAPI
VITE_INDIANAPI_API_KEY=your_indianapi_key_here

# Optional for Arbeitnow (basic usage is free without key)
VITE_ARBEITNOW_API_KEY=optional_or_your_key_here
```

---

## 🎯 Usage Example

The internship page automatically fetches from all configured APIs:

```javascript
import { fetchAllInternships, getAPIStatus } from '../services/internshipApis';

// Check which APIs are configured
const status = getAPIStatus();
console.log(status);
// { jooble: true, findwork: true, indianapi: false, arbeitnow: true }

// Fetch from all APIs
const results = await fetchAllInternships({
  keywords: "internship",
  location: "Remote"
});

// Results are organized by source
console.log(results.jooble);      // Jobs from Jooble
console.log(results.findwork);    // Jobs from Findwork
console.log(results.indianapi);   // Jobs from IndianAPI
console.log(results.arbeitnow);   // Jobs from Arbeitnow
console.log(results.all);         // All jobs combined
```

---

## 🚀 Quick Start

1. **Copy the template:**
   ```bash
   cp InternVault/.env.template InternVault/.env
   ```

2. **Get API keys** (see individual sections above)

3. **Add keys to `.env` file**

4. **Restart the dev server:**
   ```bash
   cd InternVault
   npm run dev
   ```

5. **Login and navigate to Internships page** to see jobs from all sources!

---

## 🔍 Troubleshooting

### No jobs appearing?
1. Check if API keys are correctly set in `.env`
2. Restart the development server
3. Check browser console for error messages
4. Verify API keys are valid (not expired)

### "API key not configured" warnings?
- This is normal if you haven't set up all APIs
- The app will work with any combination of APIs
- At minimum, Arbeitnow works without any API key!

### Rate limit errors?
- Jooble: 100 requests/day (free tier)
- Findwork: 1000 requests/month (free tier)
- IndianAPI: Check your plan limits
- Arbeitnow: No limits on basic tier

---

## 📊 Comparison & Recommendations

### Best for Beginners
**Arbeitnow** - No API key needed, just works!

### Best for Tech Jobs
**Findwork** - Specialized in developer/designer roles

### Best for Indian Market
**IndianAPI** - Local opportunities and companies

### Best for Global Coverage
**Jooble** - Aggregates from thousands of sources

### Recommended Setup
For the best experience, configure **all 4 APIs** to get maximum job coverage across different markets and specializations.

---

## 📚 Additional Resources

- [Jooble API Docs](https://jooble.org/api/about)
- [Findwork API Docs](https://findwork.dev/developers/)
- [IndianAPI Website](https://indianapi.in/)
- [Arbeitnow API Docs](https://www.arbeitnow.com/api)

---

**Last Updated:** January 2026
