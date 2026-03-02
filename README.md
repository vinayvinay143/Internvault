# InternVault — The Ultimate Internship Aggregator & Career Assistant

---

## 1. Abstract

InternVault is a full-stack web platform that streamlines the internship lifecycle for students, TPOs, and recruiters. It aggregates listings from Jooble, Arbeitnow, USA Jobs, and an internal database into a single interface. AI-powered tools include InternChat (scam detector powered by Groq LLaMA 3 + Tavily), a Resume Analyzer (Google Gemini AI), a Cold Email Generator, and an AI Complaint Generator for fraud reporting. TPO and recruiter dashboards handle applicant management, offer letter PDFs, coding challenges, and AI code detection. Built with React 19, Vite, Node.js, Express, MongoDB, and integrated with Groq AI and Tavily Search.

---

## 2. Introduction

### Problem Statement

| Problem | Impact |
|---|---|
| Internships scattered across dozens of job boards | Students miss relevant opportunities |
| No unified AI career preparation tools | Poor application & interview quality |
| TPOs lack streamlined workflow | Inefficient, manual applicant management |
| Fake internship scams are widespread | Students lose money and time |

### Objectives

1. Aggregate listings from Jooble, Arbeitnow, USA Jobs, and Internal DB.
2. Provide AI tools — InternChat scam detector, resume analyzer, cold email generator.
3. Build a Fraud Reporting system with an AI Complaint Generator.
4. Dedicated TPO portal for posting internships, managing applicants, and generating offer letters.
5. Recruiter portal for coding challenges, submission review, and AI code detection.
6. JWT-based authentication with role-based access control.
7. Responsive, premium UI with glassmorphism and Framer Motion animations.

---

## 3. Related Work — Comparative Analysis

| Feature | Internshala | LinkedIn | HackerRank | **InternVault** |
|---|---|---|---|---|
| Multi-source Aggregation | ✗ | ✗ | ✗ | ✓ |
| AI Scam Detection Chatbot | ✗ | ✗ | ✗ | ✓ |
| Offer Letter Image Verification | ✗ | ✗ | ✗ | ✓ |
| Fraud Reporting + AI Complaint Draft | ✗ | ✗ | ✗ | ✓ |
| Resume Analyzer | ✗ | ✗ | ✗ | ✓ |
| TPO Portal | ✗ | ✗ | ✗ | ✓ |
| Code Challenges + AI Detection | ✗ | ✗ | ✓ | ✓ |
| Offer Letter PDF Generation | ✗ | ✗ | ✗ | ✓ |

---

## 4. System Overview

### Architecture

```
┌─────────────────────────────────────────┐
│         BROWSER (React SPA)             │
│  React 19 + Vite 7 → localhost:5173     │
│  Tailwind CSS + Framer Motion           │
└────────────────┬────────────────────────┘
                 │  HTTP/REST (Axios)
                 ▼
┌─────────────────────────────────────────┐
│      BACKEND (Node.js + Express)        │
│  12 route modules → localhost:5000      │
│  JWT Auth · Multer · Nodemailer         │
└───────────┬─────────────┬───────────────┘
            │             │
     ┌──────▼──────┐  ┌───▼──────────────┐
     │  MongoDB     │  │  External APIs   │
     │  (8 schemas) │  │  Jooble, USAJobs │
     └─────────────┘  │  Arbeitnow, Groq │
                       └──────────────────┘
```

### User Roles & Workflows

| Role | Workflow |
|---|---|
| **Student** | Sign Up → Browse → Apply → Track → Code Challenges → AI Tools → Report Fraud |
| **TPO** | Post Internship → Manage Applicants → Generate Offer Letters → Notify |
| **Recruiter** | Dashboard Analytics → Post → Create Challenges → Review → AI Detection |

---

## 5. Technology Stack

### Frontend
| Category | Technology | Purpose |
|---|---|---|
| Core | React 19, Vite 7 | UI library & build tool |
| Routing | React Router v7 | 34+ client-side routes |
| Styling | Tailwind CSS, Framer Motion | Utility CSS & animations |
| AI | Groq SDK (LLaMA 3, Vision) | Chatbot & image analysis |
| PDF | jsPDF, html2canvas | Offer letter generation |
| HTTP | Axios | API communication |

### Backend
| Category | Technology | Purpose |
|---|---|---|
| Server | Express.js | Web framework on port 5000 |
| Database | MongoDB + Mongoose | 8 schemas, ODM |
| Auth | JWT + bcryptjs | Token auth & password hashing |
| Uploads | Multer | Image/file uploads |
| Email | Nodemailer | Email notifications |
| WhatsApp | Green API | WhatsApp messaging |

---

## 6. Database Design (8 Mongoose Schemas)

| Model | Description |
|---|---|
| User | Profile with role: student / tpo / recruiter |
| TPOInternship | Internships posted by TPOs |
| RecruiterInternship | Internships with embedded coding challenges |
| Application | Student applications (pending → shortlisted → selected / rejected) |
| CodeChallenge | Problems with test cases and time limits |
| CodeSubmission | Student solutions with AI detection results |
| Ad | Advertisement banners for the home page |
| Favorite | User-saved internship bookmarks |

---

## 7. API Design (30+ REST Endpoints)

| Route Group | Prefix | Key Endpoints |
|---|---|---|
| Auth | `/api/auth` | `POST /register`, `POST /login` |
| User | `/api/user` | `GET /:id`, `PUT /:id` |
| Internships | `/api/internships` | `GET /jooble`, `/arbeitnow`, `/usajobs`, `/internal` |
| TPO | `/api/tpo` | CRUD `/internships`, `GET /applicants/:id` |
| Applications | `/api/applications` | `POST /`, `GET /my`, `PUT /:id/status` |
| Recruiter | `/api/recruiter` | `/internships`, `/challenges`, `/submissions` |
| Student Code | `/api/student` | `GET /challenges`, `POST /submit` |
| Misc | `/api/` | `/favorites`, `/ads`, `/notifications`, `/communications` |

---

## 8. Security Implementation

- **JWT Authentication** — Token-based auth with 7-day expiry.
- **bcrypt Password Hashing** — 10 salt rounds.
- **Backend Proxy Pattern** — All third-party API keys are server-side only; never exposed to the browser.
- **Role-Based Access Control** — Routes protected based on user role.
- **CORS** — Restricted to allowed frontend origins.
- **Multer File Validation** — MIME type and file size restrictions.
- **Git Security** — `.env` excluded from version control via `.gitignore`.

---

## 9. Testing

### Test Cases & Results

| TC | Description | Status |
|---|---|---|
| TC-01 | User Registration | ✓ Pass |
| TC-02 | JWT Login | ✓ Pass |
| TC-03 | Fetch from All 4 Internship Sources | ✓ Pass |
| TC-04 | Apply to Internship | ✓ Pass |
| TC-05 | Generate Offer Letter PDF | ✓ Pass |
| TC-06 | InternChat Scam Detection (Text) | ✓ Pass |
| TC-07 | InternChat Image Verification (Offer Letter) | ✓ Pass |
| TC-08 | AI Complaint Generator | ✓ Pass |
| TC-09 | Code Submission & Evaluation | ✓ Pass |
| TC-10 | Resume Analysis | ✓ Pass |

---

## 10. Results & Performance

| Metric | Value |
|---|---|
| Internship Sources Integrated | 4 (Jooble, Arbeitnow, USA Jobs, Internal DB) |
| AI Tools | 3 (InternChat, Resume Analyzer, Cold Email Generator) |
| User Roles | 3 (Student, TPO, Recruiter) |
| API Endpoints | 30+ across 12 route modules |
| Database Models | 8 Mongoose schemas |
| Frontend Pages | 34 pages + 18 reusable components |
| Notification Channels | In-app popup + WhatsApp + Email |
| AI Integrations | Groq LLaMA 3 + Llama 4 Vision + Tavily Search |

---

## 11. Future Enhancements

1. **Real-time Chat** — WebSocket messaging between students and TPOs/recruiters.
2. **Mobile App** — React Native companion application.
3. **Scam Database** — Community-reported registry of known fake companies.
4. **Video Interviews** — WebRTC-based interviews within the platform.
5. **Additional Job Boards** — LinkedIn API, Glassdoor, AngelList integration.
6. **PWA Support** — Offline access and push notifications.

---

## 12. Conclusion

InternVault addresses a clear gap in the market by unifying internship aggregation, AI-powered career tools, scam protection, and role-based management dashboards in a single production-grade platform. The InternChat scam detector (Groq LLaMA 3 + Tavily) and Fraud Reporting page with AI Complaint Generator are unique differentiators not found in any existing platform. Built with React 19, Vite, Node.js, MongoDB, and Groq AI, the system is secure, scalable, and ready for institutional deployment.

---

## 13. References

| # | Source |
|---|---|
| 1 | [React.js Documentation](https://react.dev/) |
| 2 | [Express.js Documentation](https://expressjs.com/) |
| 3 | [MongoDB Reference Manual](https://www.mongodb.com/docs/manual/) |
| 4 | [Vite Documentation](https://vitejs.dev/) |
| 5 | [Mongoose ODM](https://mongoosejs.com/docs/) |
| 6 | [Groq API Documentation](https://console.groq.com/docs) |
| 7 | [Tavily Search API](https://tavily.com/) |
| 8 | [JSON Web Tokens](https://jwt.io/introduction) |
| 9 | Software Engineering – Pressman |

---

> **Developed by the InternVault Team** 🚀
