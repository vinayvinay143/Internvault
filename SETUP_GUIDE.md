# InternVault Complete Setup Guide

## 📋 Environment Variables Setup

### Frontend Environment Variables
Create/Update `.env` file in `InternVault` folder:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_JOOBLE_API_KEY=your_jooble_api_key_here
VITE_TAVILY_API_KEY=your_tavily_api_key_here
VITE_FINDWORK_API_KEY=your_findwork_api_key_here
VITE_INDIANAPI_API_KEY=your_indianapi_api_key_here
VITE_ARBEITNOW_API_KEY=your_arbeitnow_api_key_here
```

### Backend Environment Variables
Create/Update `.env` file in `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internvault
JWT_SECRET=your_secure_jwt_secret_here
GREEN_API_INSTANCE_ID=your_green_api_instance_id_here
GREEN_API_TOKEN=your_green_api_token_here
```

---

## 🔑 How to Get API Keys

### 1. GROQ API Key (AI Chat)
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and paste into `VITE_GROQ_API_KEY`

### 2. GEMINI API Key (Google AI)
1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `VITE_GEMINI_API_KEY`

### 3. JOOBLE API Key (Job Search)
1. Visit [https://jooble.org/api/about](https://jooble.org/api/about)
2. Fill out the registration form
3. Wait for email with API key
4. Copy and paste into `VITE_JOOBLE_API_KEY`

### 4. TAVILY API Key (Web Search)
1. Visit [https://tavily.com](https://tavily.com)
2. Sign up for an account
3. Navigate to API Keys section
4. Copy your API key
5. Paste into `VITE_TAVILY_API_KEY`

### 5. FINDWORK API Key (Tech Jobs)
1. Visit [https://findwork.dev/developers/](https://findwork.dev/developers/)
2. Sign up for a developer account
3. Navigate to your dashboard
4. Generate an API token
5. Copy and paste into `VITE_FINDWORK_API_KEY`

**Features:**
- Tech-focused job listings
- Remote opportunities
- Startup and established companies

### 6. INDIANAPI API Key (Indian Jobs)
1. Visit [https://indianapi.in/](https://indianapi.in/)
2. Create an account
3. Subscribe to the Jobs API
4. Get your API key from the dashboard
5. Copy and paste into `VITE_INDIANAPI_API_KEY`

**Features:**
- India-specific job listings
- Internships across Indian cities
- Local company opportunities

### 7. ARBEITNOW API Key (European/Remote Jobs)
1. Visit [https://www.arbeitnow.com/api](https://www.arbeitnow.com/api)
2. **Note:** Basic API is FREE and doesn't require a key!
3. For premium features, sign up and get an API key
4. Copy and paste into `VITE_ARBEITNOW_API_KEY`

**Features:**
- European job market focus
- Remote-first opportunities
- No API key required for basic usage

### 8. GREEN API (WhatsApp Notifications)
See detailed setup in `backend/GREEN_API_SETUP.md`

**Quick Steps:**
1. Visit [https://green-api.com](https://green-api.com)
2. Create account and instance
3. Scan QR code with WhatsApp
4. Copy Instance ID and Token
5. Add to backend `.env`

### 9. JWT Secret (Authentication)
Generate a secure random string:

**Option 1 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - Use any random string:**
```
JWT_SECRET=my_super_secret_key_12345_change_this_in_production
```

---

## 🗄️ MongoDB Setup

### Option 1: Install MongoDB Locally (Recommended for Development)

#### Windows:
1. Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer (choose "Complete" installation)
3. Install as a Windows Service (check the box during installation)
4. MongoDB will start automatically

**Verify Installation:**
```powershell
mongod --version
```

**Start MongoDB (if not running):**
```powershell
net start MongoDB
```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier)

1. Visit [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for development)
6. Get connection string
7. Update `MONGODB_URI` in backend `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/internvault?retryWrites=true&w=majority
   ```

---

## 🚀 Running the Application

### 1. Install Dependencies (if not already done)

**Frontend:**
```bash
cd InternVault
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Start MongoDB (Local Installation Only)
```powershell
net start MongoDB
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

### 4. Start Frontend (in a new terminal)
```bash
cd InternVault
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### 5. Open in Browser
Navigate to: [http://localhost:5173](http://localhost:5173)

---

## ✅ Verification Checklist

- [ ] Frontend `.env` file created with all 7 API keys
- [ ] Backend `.env` file created with all 5 variables
- [ ] MongoDB installed and running (or Atlas configured)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access application in browser
- [ ] WhatsApp notifications configured (optional)

---

## 🐛 Troubleshooting

### Backend won't start
- **Error: "Cannot connect to MongoDB"**
  - Check if MongoDB is running: `net start MongoDB`
  - Verify `MONGODB_URI` in `.env`
  
- **Error: "Port 5000 already in use"**
  - Change `PORT` in backend `.env` to another port (e.g., 5001)

### Frontend won't start
- **Error: "Port 5173 already in use"**
  - Kill the process or use a different port
  
- **API keys not working**
  - Make sure `.env` file is in the correct directory
  - Restart the dev server after adding/changing `.env`
  - Check that variable names start with `VITE_`

### MongoDB Issues
- **Can't connect to local MongoDB**
  ```powershell
  # Check if MongoDB service is running
  Get-Service MongoDB
  
  # Start MongoDB service
  net start MongoDB
  ```

### WhatsApp Notifications Not Working
- Check `backend/GREEN_API_SETUP.md` for detailed troubleshooting
- Verify instance is "authorized" in Green API dashboard
- Check phone number format (e.g., `919876543210`)

---

## 📝 Quick Reference

### Environment Files Location
```
InternVault/
├── InternVault/
│   └── .env          ← Frontend environment variables
└── backend/
    └── .env          ← Backend environment variables
```

### Default Ports
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

### Useful Commands
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check MongoDB status
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB
```

---

## 🎯 Next Steps After Setup

1. **Test User Registration**
   - Create a new account
   - Verify email/phone validation

2. **Test Internship Posting**
   - Post a test internship
   - Check if it appears in the feed

3. **Test WhatsApp Notifications**
   - Follow `backend/GREEN_API_SETUP.md`
   - Send a test notification

4. **Explore Features**
   - AI Chat assistant
   - Job search
   - Dashboard analytics

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Green API Docs](https://green-api.com/docs/)

---

**Need Help?** Check the individual setup guides:
- `backend/GREEN_API_SETUP.md` - WhatsApp notifications
- `SECURITY.md` - Security best practices
