# 🔍 Get Your Free Tavily API Key (30 Seconds!)

Your chatbot is ready to search the internet for real company reviews! Just add a free Tavily API key.

## Quick Setup

### Step 1: Get API Key
1. Visit: **https://tavily.com**
2. Click "Get API Key" or "Start for Free"
3. Sign up with email or Google
4. Copy your API key (starts with `tvly-`)

### Step 2: Add to .env
1. Open `.env` file in your project
2. Find the line:
   ```
   VITE_TAVILY_API_KEY=tvly-your_tavily_api_key_here
   ```
3. Replace with your actual key:
   ```
   VITE_TAVILY_API_KEY=tvly-abc123your_real_key_here
   ```

### Step 3: Restart Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test It!
Go to your chatbot and ask:
> "Is Google a legitimate company for internships?"

You should see real search results with sources! 🎉

---

## What You Get

### Without Tavily API Key
- ✅ Off-topic detection working
- ✅ AI-based verification advice
- ⚠️ Disclaimer: AI knowledge only

### With Tavily API Key  
- ✅ Everything above PLUS:
- 🌐 Real internet search results
- 📊 Actual company reviews from Glassdoor, LinkedIn, etc.
- 🔗 Source URLs for verification
- 💯 Evidence-based assessments

---

## Free Tier Limits
- **1,000 searches per month** - plenty for most use cases
- No credit card required
- No billing setup needed

---

## Troubleshooting

**"Web search unavailable"** message?
- Check that VITE_TAVILY_API_KEY is set correctly in .env
- Make sure you restarted the dev server after editing .env
- Verify the API key starts with `tvly-`

**Still not working?**
- The chatbot works fine without it! It will use AI knowledge
- You can always add the key later

---

**That's it! Your internship verification chatbot is now supercharged with real-time web search!** 🚀
