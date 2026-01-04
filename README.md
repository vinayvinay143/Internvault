# 🚀 InternVault - The Ultimate Internship Aggregator & Career Assistant

InternVault is a comprehensive platform designed to help students and job seekers find internships, manage their career preparation, and upskill effectively. It aggregates real-time internship listings from multiple global sources and provides AI-powered tools for resume analysis, interview preparation, and more.

## 🌟 Key Features

### 1. **Internship Aggregator**
- **Unified Search**: Fetches internship listings from multiple premium job boards simultaneously.
- **Backend Proxy System**: A secure, custom-built backend proxy (`backend/routes/internships.js`) handles all API requests to bypass CORS restrictions and keep API keys secure.
- **Supported Sources**:
  - **Jooble**: Aggregates listings from thousands of job boards.
  - **Arbeitnow**: Focuses on jobs in Europe/Germany.
  - **USA Jobs**: Federal government opportunities.
  - **Internal Database**: Internships hosted directly on InternVault.

### 2. **AI-Powered Career Tools**
- **InternChatbot**: An intelligent assistant to answer career-related queries.
- **Resume Analyzer**: Uses Google Gemini AI to analyze uploaded resumes (PDF/Image) and provide actionable feedback.
- **Cold Email Generator**: Helps users craft professional cold outreach emails.
- **Interview Dojo**: A dedicated space for interview preparation.

### 3. **SkillVault & Learning**
- **Courses & Skills**: curated paths for learning new technologies.
- **Project Ideas**: Suggestions for portfolio projects.
- **Favorites**: Save interesting internships and resources.

### 4. **User Dashboard**
- **Profile Management**: Manage user details and avatars.
- **Host Internships**: Employers can post their own internship opportunities (Image upload supported).

---

## 🛠️ Technology Stack & Dependencies

### **Frontend (InternVault directory)**
**Core Framework:**
-   `react`: ^19.1.1 (The library for web and native user interfaces)
-   `vite`: ^7.3.0 (Next Generation Frontend Tooling)

**Routing & Navigation:**
-   `react-router-dom`: ^7.9.5 (Declarative routing for React web apps)

**Styling & UI:**
-   `tailwindcss`: ^3.4.19 (Utility-first CSS framework)
-   `framer-motion`: ^12.23.26 (Production-ready motion library for React)
-   `react-icons`: ^5.5.0 (Include popular icons in your React projects)
-   `recharts`: ^3.6.0 (Redefined chart library built with React and D3)

**API & Data Handling:**
-   `axios`: ^1.13.2 (Promise based HTTP client for the browser and node.js)
-   `@google/generative-ai`: ^0.24.1 (Google Gemini AI SDK)
-   `pdfjs-dist`: ^5.4.530 (PDF Reader in JavaScript)

**Utilities:**
-   `react-hot-toast`: ^2.6.0 (Smoking hot React notifications)
-   `react-speech-recognition`: ^4.0.1 (Speech recognition hook)

### **Backend (backend directory)**
**Core Server:**
-   `node.js`: Runtime environment
-   `express`: ^4.18.2 (Fast, unopinionated, minimalist web framework)

**Database:**
-   `mongoose`: ^8.0.0 (MongoDB object modeling designed to work in an asynchronous environment)

**Authentication & Security:**
-   `jsonwebtoken`: ^9.0.3 (JSON Web Token implementation)
-   `bcryptjs`: ^2.4.3 (Optimized bcrypt in JavaScript with zero dependencies)
-   `cors`: ^2.8.5 (Middleware to enable Cross-Origin Resource Sharing)

**File & Data Handling:**
-   `multer`: ^2.0.2 (Middleware for handling `multipart/form-data` / file uploads)
-   `dotenv`: ^16.3.1 (Loads environment variables from `.env` file)
-   `axios`: ^1.13.2 (For making requests to external APIs)


---

## 🏗️ Architecture & Security

### **Backend Proxy Strategy**
To resolve Cross-Origin Resource Sharing (CORS) issues common with third-party APIs, we implemented a **Backend Proxy Pattern**:
1.  **Frontend** sends a request to our own backend (e.g., `/api/internships/jooble`).
2.  **Backend** securely adds the necessary API keys from server-side environment variables.
3.  **Backend** forwards the request to the external API.
4.  **Backend** returns the clean data to the Frontend.

This ensures **API keys are never exposed** in the browser and prevents CORS errors.

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas URI)

### **1. Clone the Repository**
```bash
git clone https://github.com/SaiiPraveen/Internvault.git
cd Internvault
```

### **2. Backend Setup**
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `backend` folder with the following keys:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internvault  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_key
GREEN_API_INSTANCE_ID=your_id  # Optional
GREEN_API_TOKEN=your_token     # Optional

# API Keys (Get these from respective providers)
JOOBLE_API_KEY=your_jooble_key
USAJOBS_API_KEY=your_usajobs_key
```

**Start the Backend Server:**
```bash
npm run dev
# Server will run on http://localhost:5000
```

### **3. Frontend Setup**
Open a new terminal, navigate to the frontend directory:
```bash
cd InternVault
npm install
```

**Start the Frontend Development Server:**
```bash
npm run dev
# Application will run on http://localhost:5173
```

---

## 📖 Working of Key Pages

1.  **Home Page**: Features a dynamic hero section with "shiny text" effects, promotional sliders for SkillVault and Tools, and a testimonial carousel.
2.  **Internship Page**: The core feature. It loads jobs in parallel from our backend proxy. You can filter by "Remote" or search by keywords. It merges results from external APIs and internal listings.
3.  **Login/Signup**: Secure authentication forms with strict validation (e.g., email format checks). Upon login, a JWT is stored in local storage to persist the session.
4.  **InternChat**: Accessible via the navbar. Uses specialized system prompts to answer internship-related questions and identify fake/scam offers.
5.  **Resume Analyzer**: Upload a PDF/Image resume. The frontend extracts text or sends the image to the backend/AI service to get a detailed critique and score.
6.  **Host Internship**: (Protected) Allows authorized users to upload job details and a banner image (handled via Multer) to post a new opening on the platform.

---

## 🤝 Contributing

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

**Developed  by the InternVault Team.**
