# 🚀 How to Get Your Google Gemini API Key (Free!)

## Step 1: Visit Google AI Studio
Go to: **https://aistudio.google.com/app/apikey**

## Step 2: Sign In
- Click **"Get API key"** or **"Sign in"**
- Sign in with your **Google account**
- No credit card required! ✅ Completely FREE

## Step 3: Create API Key
1. Once logged in, you'll see the API Keys page
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** (or choose existing project)
4. **Copy the API key** that appears (starts with `AIza...`)
5. ⚠️ **IMPORTANT**: Save this key somewhere safe - you won't be able to see it again!

## Step 4: Add to .env File
1. Open your `.env` file in the InternVault folder
2. Find or add the line:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Replace it with:
   ```
   VITE_GEMINI_API_KEY=AIza_YOUR_ACTUAL_KEY_HERE
   ```

## Step 5: Restart Dev Server
1. Stop the current server (press `Ctrl+C` in terminal)
2. Run: `npm run dev`
3. Test the screenshot upload feature!

---

## ✅ What You'll Be Able to Do:
- 📸 Upload screenshots of internship offers
- 🤖 AI analyzes the image for scam indicators
- 🔍 Detects fake companies, suspicious emails, payment requests
- ✨ Get instant verification results

## 🎯 Gemini API Benefits:
- 🆓 **FREE tier**: 15 requests per minute, 1500 per day
- 👁️ **Vision support**: Can analyze images and screenshots
- ⚡ Fast and accurate
- 🛡️ No billing required for free tier

---

## 📝 Your Current .env File Should Have:
```
VITE_GROQ_API_KEY=gsk_your_groq_key_here
VITE_TAVILY_API_KEY=tvly_your_tavily_key_here
VITE_GEMINI_API_KEY=AIza_your_gemini_key_here
```

All three APIs work together:
- **Groq**: Fast text chat responses
- **Tavily**: Web search for company verification
- **Gemini**: Image analysis for screenshots (NEW!)
