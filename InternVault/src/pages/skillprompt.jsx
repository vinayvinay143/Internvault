import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

export function SkillPrompt() {
  const [copiedId, setCopiedId] = useState(null);

  const skills = [
  // Core Programming
  "Python", "JavaScript", "Java", "C", "C++", "C#", "Go", "Rust", "PHP", "Ruby",
  "HTML & CSS", "TypeScript", "Swift", "Kotlin", "R", "MATLAB", "Shell Scripting", "Perl", "Scala", "Dart",

  // Web Development
  "React", "Angular", "Vue.js", "Next.js", "Svelte", "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
  "ASP.NET", "Tailwind CSS", "Bootstrap", "jQuery", "GraphQL", "REST APIs", "WebSockets", "Responsive Design", "Accessibility Standards", "Web Performance Optimization",

  // Mobile Development
  "React Native", "Flutter", "Android Development", "iOS Development", "Xamarin", "Mobile UI/UX", "App Deployment", "API Integration", "Cross-Platform Development", "SwiftUI",

  // Databases & Data
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle DB", "Firebase", "Elasticsearch", "Data Warehousing",
  "Data Structures", "Algorithms", "ETL Pipelines", "Data Cleaning", "Data Visualization", "Tableau", "Power BI", "Excel Advanced", "Hadoop", "Apache Spark",

  // AI & Machine Learning
  "Machine Learning", "Deep Learning", "AI Concepts", "Neural Networks", "Computer Vision", "NLP", "Reinforcement Learning", "Generative AI", "LLMs", "MLOps",
  "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV", "Transformers", "AI Ethics", "Explainable AI", "AI Deployment", "AI in Healthcare",

  // Cloud & DevOps
  "Cloud Computing", "AWS", "Microsoft Azure", "Google Cloud", "Serverless Computing", "Microservices", "Docker", "Kubernetes", "Terraform", "Ansible",
  "DevOps", "CI/CD Pipelines", "Jenkins", "Git", "GitHub", "GitLab", "Monitoring (Prometheus, Grafana)", "Logging Systems", "Agile Practices", "Site Reliability Engineering",

  // Cybersecurity
  "Cybersecurity", "Network Security", "Ethical Hacking", "Penetration Testing", "Cryptography", "Cloud Security", "Incident Response", "Threat Intelligence", "Risk Management", "Compliance Standards",

  // Emerging Tech
  "Blockchain", "Smart Contracts", "Ethereum", "Web3", "NFTs", "DeFi", "AR/VR Development", "Unity", "Unreal Engine", "Metaverse Applications",
  "IoT", "Embedded Systems", "Edge Computing", "5G Networks", "Robotics", "ROS", "Quantum Computing", "Qiskit", "Space Tech", "Biotechnology",

  // Professional & Business Skills
  "Digital Marketing", "SEO", "SEM", "Content Strategy", "Email Marketing", "Social Media Marketing", "Influencer Marketing", "Business Analytics", "Product Management", "UI/UX Design",
  "Wireframing", "Prototyping", "Figma", "Adobe XD", "Leadership", "Agile & Scrum", "Project Management", "Entrepreneurship", "Communication Skills", "Critical Thinking",
    // Cloud & Infrastructure
  "Multi-Cloud Strategy", "Hybrid Cloud", "Cloud FinOps (Cost Optimization)", "Cloud-native Security", "Service Mesh (Istio, Linkerd)",
  "Cloud Monitoring", "Cloud Automation", "Cloud Migration", "Cloud Governance", "Cloud Disaster Recovery",

  // Cybersecurity Deep Skills
  "Zero Trust Architecture", "Red Teaming", "Blue Teaming", "Digital Forensics", "Malware Analysis",
  "Secure Coding Practices", "Application Security", "Identity & Access Management (IAM)", "Security Information & Event Management (SIEM)", "Blockchain Security",

  // Emerging Tech
  "Digital Twins", "Smart Cities Tech", "Brain-Computer Interfaces", "Bioinformatics", "Space Technology Systems",
  "Nanotechnology", "Wearable Tech Development", "Smart Manufacturing (Industry 4.0)", "Drone Technology", "3D Printing",

  // Creative & Design Tech
  "Motion Graphics (After Effects)", "3D Modeling (Blender, Maya)", "Game Physics Engines", "AR Storytelling", "Generative Design",
  "Virtual Production", "Interactive Media Design", "Creative Coding (Processing, p5.js)", "Digital Illustration", "Sound Design",

  // Business & Strategy
  "Design Thinking", "Lean Six Sigma", "Strategic Foresight", "Change Management", "Innovation Management",
  "Business Process Automation", "Enterprise Architecture", "Financial Modeling", "Risk Analysis", "Corporate Governance",

  // Soft Skills & Leadership
  "Negotiation", "Emotional Intelligence", "Conflict Resolution", "Leadership in Tech", "Cross-functional Collaboration",
  "Team Facilitation", "Decision-Making Under Uncertainty", "Critical Problem Solving", "Adaptability", "Mentoring & Coaching",
  // Advanced Programming & Paradigms
  "Haskell", "F#", "Functional Programming Concepts", "Parallel Programming", "Concurrent Programming",
  "Compiler Design", "Low-Level Assembly", "Systems Programming", "Embedded C", "Microcontroller Programming",

  // Advanced Data & Analytics
  "Data Mining", "Knowledge Graphs", "Semantic Web", "Time Series Analysis", "Geospatial Analytics (GIS)",
  "Data Governance", "Data Privacy", "Data Cataloging", "DataOps", "Streaming Analytics",

  // AI & ML Specializations
  "Federated Learning", "Edge AI", "AI for Robotics", "AI in Finance", "AI in Climate Tech",
  "Synthetic Data Generation", "AI Model Compression", "Transfer Learning", "Few-Shot Learning", "AI Safety Research",

];

  const basePrompt = (skill) => `
You are my personal Skill Coach. Teach me the skill: **${skill}**
Explain everything in a simple, beginner-friendly way as if I am learning from zero.

1. Explain Like I'm 10 (ELI10)
2. Prerequisite concepts
3. Step-by-step roadmap (Beginner → Intermediate → Advanced)
4. Hands-on examples
5. Projects for all levels
6. 30-Day learning plan
7. Real-world use cases
8. Interview Q&A
9. Common mistakes
10. Final summary checklist

Start now by teaching me: **${skill}**
`;

  const copyPrompt = async (skill, id) => {
    await navigator.clipboard.writeText(basePrompt(skill));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          AI Learning <span className="text-blue-600">Assistant</span>
        </h1>
        <p className="text-gray-500">
          Select a topic below and copy the prompt to use with ChatGPT or Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {skills.map((skill, index) => (
          <button
            key={index}
            onClick={() => copyPrompt(skill, index)}
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 text-left flex flex-col justify-between h-32"
          >
            <h2 className="text-lg font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
              {skill}
            </h2>

            <div className={`mt-auto self-start flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-300
              ${copiedId === index ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
              {copiedId === index ? <FaCheck /> : <FaCopy />}
              {copiedId === index ? "Copied" : "Copy Prompt"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
