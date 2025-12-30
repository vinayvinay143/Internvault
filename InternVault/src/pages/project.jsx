// import { useState } from "react";
// const projectData = [
//   // Full Stack Projects
//   {
//     id: 1,
//     title: "Portfolio Website",
//     domain: "Full Stack",
//     level: "Beginner",
//     description: "A personal portfolio using HTML, CSS, JS or React."
//   },
//   {
//     id: 2,
//     title: "E-commerce Website",
//     domain: "Full Stack",
//     level: "Intermediate",
//     description: "Full MERN stack website with authentication and cart."
//   },
//   {
//     id: 3,
//     title: "Social Media App",
//     domain: "Full Stack",
//     level: "Advanced",
//     description: "Real-time chat, posts, likes, and notifications."
//   },

//   // AI/ML Projects
//   {
//     id: 4,
//     title: "Spam Email Classifier",
//     domain: "AI/ML",
//     level: "Beginner",
//     description: "Train a model to classify spam and ham emails."
//   },
//   {
//     id: 5,
//     title: "Credit Card Fraud Detection",
//     domain: "AI/ML",
//     level: "Intermediate",
//     description: "Fraud detection with imbalance handling + ML pipeline."
//   },
//   {
//     id: 6,
//     title: "Real-time Object Detection",
//     domain: "AI/ML",
//     level: "Advanced",
//     description: "YOLO/SSD model detecting objects in real time."
//   },

//   // DevOps Projects
//   {
//     id: 7,
//     title: "CI/CD Pipeline Setup",
//     domain: "DevOps",
//     level: "Intermediate",
//     description: "GitHub Actions + Docker + Kubernetes deployment."
//   }
// ];


// export function Project() {
//   const [selectedDomain, setSelectedDomain] = useState("All");
//   const [selectedLevel, setSelectedLevel] = useState("All");

//   const domains = ["All", "Full Stack", "AI/ML", "DevOps"];
//   const levels = ["All", "Beginner", "Intermediate", "Advanced"];

//   // FILTERING LOGIC
//   const filteredProjects = projectData.filter((project) => {
//     const domainMatch =
//       selectedDomain === "All" || project.domain === selectedDomain;

//     const levelMatch =
//       selectedLevel === "All" || project.level === selectedLevel;

//     return domainMatch && levelMatch;
//   });

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-6">Project Ideas Library</h1>

//       {/* Filters */}
//       <div className="flex gap-4 mb-6">
//         {/* Domain Filter */}
//         <select
//           className="p-2 border rounded-lg"
//           value={selectedDomain}
//           onChange={(e) => setSelectedDomain(e.target.value)}
//         >
//           {domains.map((domain) => (
//             <option key={domain}>{domain}</option>
//           ))}
//         </select>

//         {/* Level Filter */}
//         <select
//           className="p-2 border rounded-lg"
//           value={selectedLevel}
//           onChange={(e) => setSelectedLevel(e.target.value)}
//         >
//           {levels.map((lvl) => (
//             <option key={lvl}>{lvl}</option>
//           ))}
//         </select>
//       </div>

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredProjects.map((project) => (
//           <div
//             key={project.id}
//             className="p-4 border rounded-xl shadow bg-white hover:shadow-lg transition"
//           >
//             <h2 className="text-xl font-semibold">{project.title}</h2>
//             <p className="text-gray-600 mt-1">{project.description}</p>

//             <div className="flex gap-2 mt-3">
//               <span className="px-3 py-1 rounded-full bg-blue-200 text-sm">
//                 {project.domain}
//               </span>
//               <span className="px-3 py-1 rounded-full bg-green-200 text-sm">
//                 {project.level}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredProjects.length === 0 && (
//         <p className="text-center text-gray-500 mt-5">No projects found.</p>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFilter, BsFolder } from "react-icons/bs";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

const projectData = [
  {
    id: 1,
    title: "Student Management System",
    domain: "Java Full Stack",
    level: "Beginner",
    description: "CRUD-based web app using Spring Boot, Hibernate, and React."
  },
  {
    id: 2,
    title: "Online Banking Application",
    domain: "Java Full Stack",
    level: "Intermediate",
    description: "Secure banking system with authentication, transactions, and REST APIs."
  },
  {
    id: 3,
    title: "Enterprise Resource Planning (ERP)",
    domain: "Java Full Stack",
    level: "Advanced",
    description: "Large-scale ERP with role-based access, reports, and microservices."
  },

  {
    id: 4,
    title: "Blog Management System",
    domain: "Python Full Stack",
    level: "Beginner",
    description: "Blog app using Django or Flask with user authentication."
  },
  {
    id: 5,
    title: "Job Portal Application",
    domain: "Python Full Stack",
    level: "Intermediate",
    description: "Job search platform using Django/FastAPI with resume upload and search."
  },
  {
    id: 6,
    title: "AI-Powered Recommendation System",
    domain: "Python Full Stack",
    level: "Advanced",
    description: "Web app with ML-based recommendations and real-time APIs."
  },

  {
    id: 7,
    title: "Task Management App",
    domain: "JavaScript Full Stack",
    level: "Beginner",
    description: "Task manager using Node.js, Express, MongoDB, and React."
  },
  {
    id: 8,
    title: "E-commerce Platform",
    domain: "JavaScript Full Stack",
    level: "Intermediate",
    description: "Node.js backend with cart, payments, and admin dashboard."
  },
  {
    id: 9,
    title: "Real-Time Collaboration Tool",
    domain: "JavaScript Full Stack",
    level: "Advanced",
    description: "Live chat, file sharing, and notifications using WebSockets."
  },

  {
    id: 10,
    title: "Employee Management System",
    domain: "C# .NET Full Stack",
    level: "Beginner",
    description: "ASP.NET Core CRUD app with Blazor or React frontend."
  },
  {
    id: 11,
    title: "Inventory Management System",
    domain: "C# .NET Full Stack",
    level: "Intermediate",
    description: "Stock tracking system with authentication and reporting."
  },
  {
    id: 12,
    title: "Healthcare Management Platform",
    domain: "C# .NET Full Stack",
    level: "Advanced",
    description: "Patient records, appointments, and secure data handling."
  },

  {
    id: 13,
    title: "Personal Blog Website",
    domain: "PHP Full Stack",
    level: "Beginner",
    description: "Blog site using Laravel or CodeIgniter with admin panel."
  },
  {
    id: 14,
    title: "Online Learning Platform",
    domain: "PHP Full Stack",
    level: "Intermediate",
    description: "Course management system with user roles and progress tracking."
  },
  {
    id: 15,
    title: "Multi-Vendor Marketplace",
    domain: "PHP Full Stack",
    level: "Advanced",
    description: "Marketplace with vendor dashboards, payments, and order tracking."
  },

  {
    id: 16,
    title: "To-Do Application",
    domain: "Ruby Full Stack",
    level: "Beginner",
    description: "Simple to-do app using Ruby on Rails and JavaScript."
  },
  {
    id: 17,
    title: "Content Management System",
    domain: "Ruby Full Stack",
    level: "Intermediate",
    description: "CMS with roles, permissions, and dynamic content."
  },
  {
    id: 18,
    title: "Social Networking Platform",
    domain: "Ruby Full Stack",
    level: "Advanced",
    description: "Posts, follows, messaging, and notifications."
  },

  {
    id: 19,
    title: "URL Shortener",
    domain: "Go Full Stack",
    level: "Beginner",
    description: "URL shortening service using Go backend and JS frontend."
  },
  {
    id: 20,
    title: "RESTful API Service",
    domain: "Go Full Stack",
    level: "Intermediate",
    description: "High-performance API using Go with authentication and caching."
  },
  {
    id: 21,
    title: "Scalable Microservices Platform",
    domain: "Go Full Stack",
    level: "Advanced",
    description: "Microservices architecture with Go, Docker, and cloud deployment."
  },
  {
    id: 22,
    title: "Blog Platform",
    domain: "MEAN Stack",
    level: "Beginner",
    description: "Simple blog app using MongoDB, Express, Angular, and Node.js."
  },
  {
    id: 23,
    title: "Event Management System",
    domain: "MEAN Stack",
    level: "Intermediate",
    description: "Event creation, registration, and admin dashboard with Angular."
  },
  {
    id: 24,
    title: "Real-Time Analytics Dashboard",
    domain: "MEAN Stack",
    level: "Advanced",
    description: "Live data visualization with role-based access and APIs."
  },

  {
    id: 25,
    title: "To-Do Application",
    domain: "MERN Stack",
    level: "Beginner",
    description: "Task management app using MongoDB, Express, React, and Node.js."
  },
  {
    id: 26,
    title: "E-learning Platform",
    domain: "MERN Stack",
    level: "Intermediate",
    description: "Courses, authentication, progress tracking, and admin panel."
  },
  {
    id: 27,
    title: "Social Media Platform",
    domain: "MERN Stack",
    level: "Advanced",
    description: "Posts, likes, comments, chat, and real-time notifications."
  },

  {
    id: 28,
    title: "Company Website",
    domain: "LAMP Stack",
    level: "Beginner",
    description: "Static and dynamic pages using PHP and MySQL."
  },
  {
    id: 29,
    title: "Online Booking System",
    domain: "LAMP Stack",
    level: "Intermediate",
    description: "User bookings, admin management, and database integration."
  },
  {
    id: 30,
    title: "E-commerce Website",
    domain: "LAMP Stack",
    level: "Advanced",
    description: "Product catalog, cart, payments, and order management."
  },

  {
    id: 31,
    title: "User Authentication System",
    domain: "Django Full Stack",
    level: "Beginner",
    description: "Login, registration, and profile management using Django."
  },
  {
    id: 32,
    title: "Job Portal",
    domain: "Django Full Stack",
    level: "Intermediate",
    description: "Job listings, applications, and recruiter dashboards."
  },
  {
    id: 33,
    title: "SaaS Web Application",
    domain: "Django Full Stack",
    level: "Advanced",
    description: "Subscription-based platform with APIs and React frontend."
  },

  {
    id: 34,
    title: "Student Information System",
    domain: "Spring Full Stack",
    level: "Beginner",
    description: "CRUD-based student management using Spring Boot and Angular."
  },
  {
    id: 35,
    title: "Online Examination System",
    domain: "Spring Full Stack",
    level: "Intermediate",
    description: "Timed exams, evaluations, and secure authentication."
  },
  {
    id: 36,
    title: "Enterprise Management System",
    domain: "Spring Full Stack",
    level: "Advanced",
    description: "Scalable enterprise app with microservices and dashboards."
  },
  {
    id: 37,
    title: "Cloud-Based Blog Application",
    domain: "Cloud-Native Full Stack",
    level: "Beginner",
    description: "Blog app deployed on AWS/Azure/GCP using cloud databases and services."
  },
  {
    id: 38,
    title: "Microservices E-commerce Platform",
    domain: "Cloud-Native Full Stack",
    level: "Intermediate",
    description: "Microservices-based e-commerce app with Docker, Kubernetes, and cloud APIs."
  },
  {
    id: 39,
    title: "Scalable SaaS Application",
    domain: "Cloud-Native Full Stack",
    level: "Advanced",
    description: "Highly scalable SaaS platform with CI/CD, monitoring, and auto-scaling."
  },

  {
    id: 40,
    title: "Serverless To-Do App",
    domain: "Serverless Full Stack",
    level: "Beginner",
    description: "To-do app using AWS Lambda/Firebase backend and JS frontend."
  },
  {
    id: 41,
    title: "Serverless Event Booking System",
    domain: "Serverless Full Stack",
    level: "Intermediate",
    description: "Event booking app with authentication and serverless APIs."
  },
  {
    id: 42,
    title: "Real-Time Serverless Chat App",
    domain: "Serverless Full Stack",
    level: "Advanced",
    description: "Real-time chat using Firebase/Supabase with scalable serverless backend."
  },

  {
    id: 43,
    title: "Mobile Notes Application",
    domain: "Mobile Full Stack",
    level: "Beginner",
    description: "Notes app using Flutter/React Native with Node.js or Python backend."
  },
  {
    id: 44,
    title: "Mobile Expense Tracker",
    domain: "Mobile Full Stack",
    level: "Intermediate",
    description: "Expense tracking app with cloud sync and authentication."
  },
  {
    id: 45,
    title: "On-Demand Service Mobile App",
    domain: "Mobile Full Stack",
    level: "Advanced",
    description: "Full-featured mobile app with real-time updates, payments, and backend APIs."
  },
  {
    id: 46,
    title: "AI-Powered Chatbot Web App",
    domain: "AI/ML Full Stack",
    level: "Beginner",
    description: "Web-based chatbot integrating a trained ML model with a frontend UI."
  },
  {
    id: 47,
    title: "Image Classification Platform",
    domain: "AI/ML Full Stack",
    level: "Intermediate",
    description: "Image upload and prediction app using TensorFlow/PyTorch models."
  },
  {
    id: 48,
    title: "Intelligent Recommendation System",
    domain: "AI/ML Full Stack",
    level: "Advanced",
    description: "Personalized recommendations using ML models integrated into a full-stack app."
  },

  {
    id: 49,
    title: "Crypto Wallet dApp",
    domain: "Blockchain Full Stack",
    level: "Beginner",
    description: "Decentralized wallet app using smart contracts and web frontend."
  },
  {
    id: 50,
    title: "NFT Marketplace",
    domain: "Blockchain Full Stack",
    level: "Intermediate",
    description: "Minting, buying, and selling NFTs using Solidity and frontend frameworks."
  },
  {
    id: 51,
    title: "Decentralized Finance (DeFi) Platform",
    domain: "Blockchain Full Stack",
    level: "Advanced",
    description: "Smart-contract-based lending, staking, and trading platform."
  },

  {
    id: 52,
    title: "2D Game Application",
    domain: "Game Full Stack",
    level: "Beginner",
    description: "Simple 2D game built with Unity and basic backend services."
  },
  {
    id: 53,
    title: "Multiplayer Online Game",
    domain: "Game Full Stack",
    level: "Intermediate",
    description: "Multiplayer game with matchmaking and real-time backend services."
  },
  {
    id: 54,
    title: "Massively Multiplayer Online Game (MMO)",
    domain: "Game Full Stack",
    level: "Advanced",
    description: "Large-scale multiplayer game with real-time servers and cloud integration."
  },
  {
    id: 55,
    title: "Business Performance Dashboard",
    domain: "Business Data Analyst",
    level: "Beginner",
    description: "Interactive dashboard tracking KPIs like revenue, growth, and churn."
  },
  {
    id: 56,
    title: "Sales & Profit Analysis",
    domain: "Business Data Analyst",
    level: "Intermediate",
    description: "Sales trends, regional performance, and forecasting insights."
  },
  {
    id: 57,
    title: "Executive Decision Support System",
    domain: "Business Data Analyst",
    level: "Advanced",
    description: "Advanced dashboards with predictive insights for leadership decisions."
  },

  {
    id: 58,
    title: "Stock Market Data Analysis",
    domain: "Financial Data Analyst",
    level: "Beginner",
    description: "Basic analysis of stock prices, returns, and volume trends."
  },
  {
    id: 59,
    title: "Investment Portfolio Analysis",
    domain: "Financial Data Analyst",
    level: "Intermediate",
    description: "Risk-return analysis, diversification, and portfolio optimization."
  },
  {
    id: 60,
    title: "Financial Risk Modeling",
    domain: "Financial Data Analyst",
    level: "Advanced",
    description: "Market risk, credit risk, and scenario-based financial models."
  },

  {
    id: 61,
    title: "Marketing Campaign Analysis",
    domain: "Marketing Data Analyst",
    level: "Beginner",
    description: "Campaign performance analysis using CTR, ROI, and conversions."
  },
  {
    id: 62,
    title: "Customer Segmentation Analysis",
    domain: "Marketing Data Analyst",
    level: "Intermediate",
    description: "Customer behavior analysis using cohorts and segmentation."
  },
  {
    id: 63,
    title: "Sales Funnel Optimization",
    domain: "Marketing Data Analyst",
    level: "Advanced",
    description: "End-to-end funnel analysis to improve conversions and retention."
  },

  {
    id: 64,
    title: "Patient Data Analysis",
    domain: "Healthcare Data Analyst",
    level: "Beginner",
    description: "Basic analysis of patient demographics and visit patterns."
  },
  {
    id: 65,
    title: "Clinical Outcomes Dashboard",
    domain: "Healthcare Data Analyst",
    level: "Intermediate",
    description: "Dashboards tracking treatment outcomes and hospital performance."
  },
  {
    id: 66,
    title: "Predictive Healthcare Analytics",
    domain: "Healthcare Data Analyst",
    level: "Advanced",
    description: "Predictive models for readmission rates and patient outcomes."
  },

  {
    id: 67,
    title: "Supply Chain Data Analysis",
    domain: "Operations Data Analyst",
    level: "Beginner",
    description: "Analysis of inventory levels, suppliers, and delivery times."
  },
  {
    id: 68,
    title: "Logistics & Process Optimization",
    domain: "Operations Data Analyst",
    level: "Intermediate",
    description: "Efficiency analysis of logistics, costs, and workflows."
  },
  {
    id: 69,
    title: "Operational Forecasting System",
    domain: "Operations Data Analyst",
    level: "Advanced",
    description: "Demand forecasting and optimization using historical data."
  },

  {
    id: 70,
    title: "Product Usage Dashboard",
    domain: "Product Data Analyst",
    level: "Beginner",
    description: "Tracking active users, sessions, and feature usage."
  },
  {
    id: 71,
    title: "User Retention & Cohort Analysis",
    domain: "Product Data Analyst",
    level: "Intermediate",
    description: "Cohort-based retention and engagement analysis."
  },
  {
    id: 72,
    title: "Product Growth Analytics",
    domain: "Product Data Analyst",
    level: "Advanced",
    description: "Growth metrics, experimentation analysis, and user feedback insights."
  },
  {
    id: 73,
    title: "Exploratory Data Analysis Project",
    domain: "Data Scientist (Generalist)",
    level: "Beginner",
    description: "Data cleaning, visualization, and basic insights from real-world datasets."
  },
  {
    id: 74,
    title: "Predictive Modeling System",
    domain: "Data Scientist (Generalist)",
    level: "Intermediate",
    description: "Build and evaluate regression and classification models."
  },
  {
    id: 75,
    title: "End-to-End Data Science Pipeline",
    domain: "Data Scientist (Generalist)",
    level: "Advanced",
    description: "Full pipeline from data ingestion to model deployment and reporting."
  },

  {
    id: 76,
    title: "Retail Demand Forecasting",
    domain: "Applied Data Scientist",
    level: "Beginner",
    description: "Forecast product demand using historical sales data."
  },
  {
    id: 77,
    title: "Healthcare Risk Prediction",
    domain: "Applied Data Scientist",
    level: "Intermediate",
    description: "Predict patient risk scores using domain-specific datasets."
  },
  {
    id: 78,
    title: "Fraud Detection System",
    domain: "Applied Data Scientist",
    level: "Advanced",
    description: "Machine learning system to detect anomalies and fraud patterns."
  },

  {
    id: 79,
    title: "ML Model Training Project",
    domain: "AI/ML Data Scientist",
    level: "Beginner",
    description: "Train and evaluate basic ML models using standard datasets."
  },
  {
    id: 80,
    title: "Deep Learning Application",
    domain: "AI/ML Data Scientist",
    level: "Intermediate",
    description: "Build deep learning models using TensorFlow or PyTorch."
  },
  {
    id: 81,
    title: "Production-Grade ML System",
    domain: "AI/ML Data Scientist",
    level: "Advanced",
    description: "Scalable ML system with monitoring, retraining, and optimization."
  },

  {
    id: 82,
    title: "Big Data Processing Project",
    domain: "Big Data Scientist",
    level: "Beginner",
    description: "Process and analyze large datasets using Hadoop or Spark."
  },
  {
    id: 83,
    title: "Distributed Data Analytics Platform",
    domain: "Big Data Scientist",
    level: "Intermediate",
    description: "Build distributed analytics workflows with Spark and cloud storage."
  },
  {
    id: 84,
    title: "Real-Time Big Data Pipeline",
    domain: "Big Data Scientist",
    level: "Advanced",
    description: "Streaming data pipeline using Spark Streaming or Kafka."
  },

  {
    id: 85,
    title: "Reproduction of Research Paper",
    domain: "Research Data Scientist",
    level: "Beginner",
    description: "Reproduce results from an existing research paper."
  },
  {
    id: 86,
    title: "Algorithm Performance Study",
    domain: "Research Data Scientist",
    level: "Intermediate",
    description: "Compare algorithms using benchmarks and evaluation metrics."
  },
  {
    id: 87,
    title: "Novel Model or Method Research",
    domain: "Research Data Scientist",
    level: "Advanced",
    description: "Design and experiment with new models or learning techniques."
  },

  {
    id: 88,
    title: "Financial Time Series Analysis",
    domain: "Quantitative Analyst",
    level: "Beginner",
    description: "Analyze stock prices and returns using statistical methods."
  },
  {
    id: 89,
    title: "Algorithmic Trading Strategy",
    domain: "Quantitative Analyst",
    level: "Intermediate",
    description: "Design and backtest quantitative trading strategies."
  },
  {
    id: 90,
    title: "Risk & Derivatives Pricing Model",
    domain: "Quantitative Analyst",
    level: "Advanced",
    description: "Advanced financial models for derivatives pricing and risk management."
  },
  {
    id: 91,
    title: "ML Model Deployment Pipeline",
    domain: "Machine Learning Engineer",
    level: "Beginner",
    description: "Train a machine learning model and deploy it using REST APIs."
  },
  {
    id: 92,
    title: "Automated ML Training System",
    domain: "Machine Learning Engineer",
    level: "Intermediate",
    description: "End-to-end ML pipeline with feature engineering, training, and evaluation."
  },
  {
    id: 93,
    title: "Scalable ML Production System",
    domain: "Machine Learning Engineer",
    level: "Advanced",
    description: "Production-grade ML system with monitoring, retraining, and scalability."
  },

  {
    id: 94,
    title: "Neural Network from Scratch",
    domain: "Deep Learning Engineer",
    level: "Beginner",
    description: "Implement basic neural networks using NumPy and deep learning frameworks."
  },
  {
    id: 95,
    title: "Image Classification with CNNs",
    domain: "Deep Learning Engineer",
    level: "Intermediate",
    description: "Train convolutional neural networks for image classification tasks."
  },
  {
    id: 96,
    title: "Transformer-Based Model",
    domain: "Deep Learning Engineer",
    level: "Advanced",
    description: "Build and fine-tune transformer models for complex tasks."
  },

  {
    id: 97,
    title: "Image Classification System",
    domain: "Computer Vision Engineer",
    level: "Beginner",
    description: "Basic image recognition system using pre-trained models."
  },
  {
    id: 98,
    title: "Object Detection Application",
    domain: "Computer Vision Engineer",
    level: "Intermediate",
    description: "Detect and track objects in images or videos."
  },
  {
    id: 99,
    title: "Autonomous Vision System",
    domain: "Computer Vision Engineer",
    level: "Advanced",
    description: "Advanced vision system for autonomous driving or medical imaging."
  },

  {
    id: 100,
    title: "Text Classification Project",
    domain: "NLP Engineer",
    level: "Beginner",
    description: "Sentiment analysis and text classification using NLP techniques."
  },
  {
    id: 101,
    title: "Conversational Chatbot",
    domain: "NLP Engineer",
    level: "Intermediate",
    description: "Build chatbots using transformer-based language models."
  },
  {
    id: 102,
    title: "LLM Fine-Tuning System",
    domain: "NLP Engineer",
    level: "Advanced",
    description: "Fine-tune large language models for domain-specific tasks."
  },

  {
    id: 103,
    title: "Prompt-Based AI Application",
    domain: "Generative AI Engineer",
    level: "Beginner",
    description: "Build an AI app using prompts with large language models."
  },
  {
    id: 104,
    title: "Image Generation Platform",
    domain: "Generative AI Engineer",
    level: "Intermediate",
    description: "Generate images using diffusion or GAN-based models."
  },
  {
    id: 105,
    title: "Multimodal AI System",
    domain: "Generative AI Engineer",
    level: "Advanced",
    description: "Combine text, image, and audio models in a single AI system."
  },

  {
    id: 106,
    title: "AI System Design Blueprint",
    domain: "AI Solutions Architect",
    level: "Beginner",
    description: "Design high-level AI architecture for business use cases."
  },
  {
    id: 107,
    title: "Enterprise AI Platform",
    domain: "AI Solutions Architect",
    level: "Intermediate",
    description: "Architect scalable AI platforms integrating multiple ML services."
  },
  {
    id: 108,
    title: "Organization-Wide AI Transformation",
    domain: "AI Solutions Architect",
    level: "Advanced",
    description: "Design enterprise-wide AI systems with governance and scalability."
  },

  {
    id: 109,
    title: "Reimplementation of Research Models",
    domain: "AI Research Engineer",
    level: "Beginner",
    description: "Reproduce existing research models and experiments."
  },
  {
    id: 110,
    title: "Model Optimization Research",
    domain: "AI Research Engineer",
    level: "Intermediate",
    description: "Research model efficiency, optimization, and performance improvements."
  },
  {
    id: 111,
    title: "Novel AI Architecture Research",
    domain: "AI Research Engineer",
    level: "Advanced",
    description: "Design and test new neural network architectures."
  },

  {
    id: 112,
    title: "Bias Detection in ML Models",
    domain: "AI Ethics / Responsible AI",
    level: "Beginner",
    description: "Analyze ML models for bias, fairness, and transparency."
  },
  {
    id: 113,
    title: "Explainable AI Dashboard",
    domain: "AI Ethics / Responsible AI",
    level: "Intermediate",
    description: "Build explainability tools for ML decision-making."
  },
  {
    id: 114,
    title: "Responsible AI Governance Framework",
    domain: "AI Ethics / Responsible AI",
    level: "Advanced",
    description: "Design compliance, auditability, and ethical AI governance systems."
  }

]


export function Project({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch existing favorites on mount
  useEffect(() => {
    if (user?._id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites/${user._id}`);
      const favoriteIds = response.data.map((fav) => fav.projectId);
      setFavorites(favoriteIds);
    } catch (error) {
      // Silently handle - user may not have any favorites
      setFavorites([]);
    }
  };

  const toggleFavorite = async (project) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    setLoading(true);
    const isFavorited = favorites.includes(String(project.id));
    // Use 'p-' prefix for logic if IDs collide with other types, but keeping simple as requested
    // Assuming backend handles ID collision or we treat int IDs as project-specific
    const uniqueId = String(project.id);

    try {
      if (isFavorited) {
        // Remove from favorites
        await axios.delete(`${API_URL}/favorites/remove/${user._id}/${uniqueId}`);
        setFavorites((prev) => prev.filter((id) => id !== uniqueId));
      } else {
        // Add to favorites
        await axios.post(`${API_URL}/favorites/add`, {
          userId: user._id,
          projectId: uniqueId,
          title: project.title,
          domain: project.domain,
          level: project.level,
        });
        setFavorites((prev) => [...prev, uniqueId]);
      }
    } catch (error) {
      // Handle error silently for better UX
      if (error.response?.status === 400 && !isFavorited) {
        // Already exists, just update local state
        setFavorites((prev) => [...prev, uniqueId]);
      }
      // Don't show alert for minor errors
    } finally {
      setLoading(false);
    }
  };

  const domains = [
    "All",
    "Java Full Stack",
    "JavaScript Full Stack",
    "Python Full Stack",
    "PHP Full Stack",
    "C# Full Stack",
    "Go Full Stack",
    "MEAN Stack",
    "MERN Stack",
    "LAMP Stack",
    "Django Full Stack",
    "Spring Full Stack",
    "Cloud-Native Full Stack",
    "Serverless Full Stack",
    "Mobile Full Stack",
    "AI/ML Full Stack",
    "Blockchain Full Stack",
    "Game Full Stack",
    "Business Data Analyst",
    "Financial Data Analyst",
    "Marketing Data Analyst",
    "Healthcare Data Analyst",
    "Operations Data Analyst",
    "Product Data Analyst",
    "Data Scientist (Generalist)",
    "Applied Data Scientist",
    "AI/ML Data Scientist",
    "Big Data Scientist",
    "Research Data Scientist",
    "Quantitative Analyst",
    "Machine Learning Engineer",
    "Deep Learning Engineer",
    "Computer Vision Engineer",
    "NLP Engineer",
    "Generative AI Engineer",
    "AI Solutions Architect",
    "AI Research Engineer",
    "AI Ethics / Responsible AI"
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredProjects = projectData.filter((project) => {
    const domainMatch =
      selectedDomain === "All" || project.domain === selectedDomain;
    const levelMatch = selectedLevel === "All" || project.level === selectedLevel;
    return domainMatch && levelMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Project <span className="text-blue-600">Ideas</span></h1>
          <p className="text-gray-500 mt-1">Build these to level up your portfolio.</p>
        </div>

        <div className="flex gap-3 bg-gray-50 p-2 rounded-xl">
          <div className="flex items-center gap-2 px-3 text-gray-400">
            <BsFilter />
          </div>
          <select
            className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <div className="w-px h-6 bg-gray-300"></div>
          <select
            className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group p-6 border border-gray-100 rounded-3xl shadow-sm bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full transition-transform group-hover:scale-150
                ${project.level === 'Beginner' ? 'from-green-400 to-emerald-600' :
                project.level === 'Intermediate' ? 'from-yellow-400 to-orange-600' : 'from-red-400 to-pink-600'}`}>
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <BsFolder className="text-xl" />
              </div>
              <button
                onClick={() => toggleFavorite(project)}
                disabled={loading}
                className="text-2xl transition hover:scale-110 active:scale-95 disabled:opacity-50"
                title={user ? (favorites.includes(String(project.id)) ? "Remove from favorites" : "Add to favorites") : "Login to add favorites"}
              >
                {favorites.includes(String(project.id)) ? (
                  <AiFillHeart className="text-red-500 drop-shadow-sm" />
                ) : (
                  <AiOutlineHeart className="text-gray-300 hover:text-red-400" />
                )}
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{project.title}</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed relative z-10 line-clamp-3">{project.description}</p>

            <div className="flex gap-2 relative z-10">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold tracking-wide uppercase">{project.domain}</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase
                 ${project.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  project.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {project.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No projects found matching your filters.</p>
          <button onClick={() => { setSelectedDomain("All"); setSelectedLevel("All") }} className="mt-2 text-blue-600 font-medium hover:underline">Clear Filters</button>
        </div>
      )}
    </div>
  );
}
