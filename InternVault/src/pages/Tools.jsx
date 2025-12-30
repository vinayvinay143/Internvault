import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { BsBullseye, BsPlusCircle, BsCloudArrowUp, BsCupHot, BsCheckCircle, BsExclamationTriangle, BsSearch, BsTools } from "react-icons/bs";

const ROLES_LIST = [
    "Frontend Intern", "Backend Intern", "Software Developer Intern", "Web Development Intern",
    "Frontend Developer Intern", "Backend Developer Intern", "Full Stack Developer Intern",
    "Mobile App Developer Intern", "UI/UX Design Intern", "Data Science Intern",
    "Machine Learning Intern", "Artificial Intelligence Intern", "Cloud Engineering Intern",
    "DevOps Intern", "Cybersecurity Intern", "Database Developer Intern", "Game Development Intern",
    "Embedded Systems Intern", "IoT Developer Intern", "QA/Testing Intern",
    "Site Reliability Engineering Intern", "Systems Programming Intern", "Data Engineering Intern",
    "Network Engineering Intern", "IT Support Intern", "Product Management Intern",
    "Business Analyst Intern", "Research Intern", "Blockchain Developer Intern",
    "AR/VR Developer Intern", "Robotics Intern", "Computer Vision Intern",
    "Natural Language Processing Intern", "Big Data Intern", "Cloud Security Intern",
    "Infrastructure Engineering Intern", "Platform Engineering Intern", "API Development Intern",
    "Automation Intern", "Quality Assurance Automation Intern", "Security Analyst Intern",
    "Penetration Testing Intern", "Firmware Engineering Intern", "Hardware Engineering Intern",
    "Operating Systems Intern", "Compiler Development Intern", "Networking Intern",
    "Technical Support Intern", "IT Infrastructure Intern", "Software Testing Intern",
    "Application Development Intern", "Technology Consulting Intern"
];

const getSkillsForRole = (role) => {
    const r = role.toLowerCase();

    // Web & Frontend
    if (r.includes("frontend") || r.includes("web") || r.includes("ui/ux") || r.includes("full stack")) {
        return [
            { subject: "JavaScript/React", A: 90, fullMark: 100 },
            { subject: "CSS/Tailwind", A: 85, fullMark: 100 },
            { subject: "HTML/Accessibility", A: 80, fullMark: 100 },
            { subject: "Version Control", A: 70, fullMark: 100 },
            { subject: "API Integration", A: 75, fullMark: 100 },
            { subject: "Responsive Design", A: 85, fullMark: 100 }
        ];
    }
    // Backend & Systems
    if (r.includes("backend") || r.includes("api") || r.includes("systems programming") || r.includes("application")) {
        return [
            { subject: "Node.js/Python", A: 90, fullMark: 100 },
            { subject: "Databases (SQL/NoSQL)", A: 85, fullMark: 100 },
            { subject: "API Design (REST/GraphQL)", A: 80, fullMark: 100 },
            { subject: "Authentication", A: 70, fullMark: 100 },
            { subject: "Server Management", A: 60, fullMark: 100 },
            { subject: "Testing/Debugging", A: 75, fullMark: 100 }
        ];
    }
    // Data & AI
    if (r.includes("data") || r.includes("machine learning") || r.includes("artificial intelligence") || r.includes("research") || r.includes("computer vision") || r.includes("nlp") || r.includes("big data")) {
        return [
            { subject: "Python/R", A: 90, fullMark: 100 },
            { subject: "Machine Learning", A: 85, fullMark: 100 },
            { subject: "Data Visualization", A: 80, fullMark: 100 },
            { subject: "Statistics", A: 75, fullMark: 100 },
            { subject: "SQL/Pandas", A: 70, fullMark: 100 },
            { subject: "Deep Learning", A: 60, fullMark: 100 }
        ];
    }
    // DevOps & Cloud
    if (r.includes("cloud") || r.includes("devops") || r.includes("sre") || r.includes("infrastructure") || r.includes("platform")) {
        return [
            { subject: "AWS/Azure/GCP", A: 90, fullMark: 100 },
            { subject: "Docker/Kubernetes", A: 85, fullMark: 100 },
            { subject: "CI/CD Pipelines", A: 80, fullMark: 100 },
            { subject: "Linux/Scripting", A: 75, fullMark: 100 },
            { subject: "Networking", A: 70, fullMark: 100 },
            { subject: "Monitoring", A: 60, fullMark: 100 }
        ];
    }
    // Mobile
    if (r.includes("mobile") || r.includes("ios") || r.includes("android")) {
        return [
            { subject: "React Native/Flutter", A: 90, fullMark: 100 },
            { subject: "Swift/Kotlin", A: 85, fullMark: 100 },
            { subject: "Mobile UI/UX", A: 80, fullMark: 100 },
            { subject: "State Management", A: 75, fullMark: 100 },
            { subject: "API Consumption", A: 70, fullMark: 100 },
            { subject: "App Store Deploy", A: 60, fullMark: 100 }
        ];
    }
    // Security
    if (r.includes("security") || r.includes("cyber") || r.includes("penetration")) {
        return [
            { subject: "Network Security", A: 90, fullMark: 100 },
            { subject: "Ethical Hacking", A: 85, fullMark: 100 },
            { subject: "Cryptography", A: 80, fullMark: 100 },
            { subject: "Risk Analysis", A: 75, fullMark: 100 },
            { subject: "Security Tools", A: 70, fullMark: 100 },
            { subject: "Compliance", A: 60, fullMark: 100 }
        ];
    }
    // Hardware/Embedded
    if (r.includes("embedded") || r.includes("iot") || r.includes("firmware") || r.includes("hardware") || r.includes("robotics")) {
        return [
            { subject: "C/C++", A: 90, fullMark: 100 },
            { subject: "Microcontrollers", A: 85, fullMark: 100 },
            { subject: "Circuit Design", A: 80, fullMark: 100 },
            { subject: "RTOS", A: 75, fullMark: 100 },
            { subject: "Sensors/Actuators", A: 70, fullMark: 100 },
            { subject: "Debugging", A: 60, fullMark: 100 }
        ];
    }

    // Default Mix
    return [
        { subject: "Programming Logic", A: 85, fullMark: 100 },
        { subject: "Problem Solving", A: 80, fullMark: 100 },
        { subject: "Communication", A: 75, fullMark: 100 },
        { subject: "Tools & IDEs", A: 70, fullMark: 100 },
        { subject: "Project Management", A: 60, fullMark: 100 },
        { subject: "Documentation", A: 65, fullMark: 100 }
    ];
};

const DUMMY_ROLES = ROLES_LIST.reduce((acc, role) => {
    acc[role] = getSkillsForRole(role);
    return acc;
}, {});

export function SkillRadar() {
    const [role, setRole] = useState("Frontend Intern");
    const [mySkills, setMySkills] = useState([60, 50, 40, 30, 80, 50]); // Initial dummy user data
    const [isEditing, setIsEditing] = useState(false);

    const data = DUMMY_ROLES[role].map((item, index) => ({
        ...item,
        B: mySkills[index] // User skills
    }));

    const handleSkillChange = (index, value) => {
        const newSkills = [...mySkills];
        newSkills[index] = parseInt(value);
        setMySkills(newSkills);
    };

    const getGapAnalysis = () => {
        // Find skill with max gap (Market - You)
        const improvementNeeded = [...data].sort((a, b) => (b.A - b.B) - (a.A - a.B))[0];
        // Find skill with highest user score
        const strongestSkill = [...data].sort((a, b) => b.B - a.B)[0];

        return {
            strong: strongestSkill ? strongestSkill.subject : "N/A",
            weak: improvementNeeded ? improvementNeeded.subject : "N/A"
        };
    };

    const analysis = getGapAnalysis();

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsBullseye className="text-indigo-600" /> Skill Gap Radar
                </h2>
                <p className="text-slate-500 mt-2">
                    Visualize where you stand against industry standards.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Controls */}
                <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {Object.keys(DUMMY_ROLES).map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Your Skills</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs text-indigo-600 font-bold hover:underline"
                        >
                            {isEditing ? "Done" : "Edit Levels"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={item.subject}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{item.subject}</span>
                                    <span className="font-bold text-slate-900">{item.B}%</span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={item.B}
                                        onChange={(e) => handleSkillChange(index, e.target.value)}
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                ) : (
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.B}%` }}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-800 mb-1 flex items-center gap-2">
                            <BsCloudArrowUp />
                            Gap Analysis
                        </h4>
                        <p className="text-sm text-indigo-700 leading-relaxed">
                            You are strong in <strong>{analysis.strong}</strong> but need to improve in <strong>{analysis.weak}</strong> to match the {role} profile.
                        </p>
                    </div>

                </div>

                {/* Chart */}
                <div className="w-full lg:w-2/3 bg-white p-4 md:p-10 rounded-3xl border border-slate-200 shadow-xl min-h-[500px] flex flex-col items-center justify-center relative">
                    <ResponsiveContainer width="100%" height={450}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 14 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Market Standard"
                                dataKey="A"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fill="#818cf8"
                                fillOpacity={0.2}
                            />
                            <Radar
                                name="You"
                                dataKey="B"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="#34d399"
                                fillOpacity={0.4}
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-6 right-6 flex flex-col gap-2 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#818cf8]"></span> Market Standard
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#34d399]"></span> You
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export function CoffeeDetector() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);

    const analyzeJob = () => {
        if (!text.trim()) return;

        const redFlags = [
            "coffee runs", "data entry", "administrative tasks", "unpaid",
            "wear many hats", "scanning documents", "cold calling", "scheduling",
            "errands", "cleaning", "answering phones", "assistant support"
        ];

        const greenFlags = [
            "mentorship", "production code", "code review", "ci/cd",
            "pair programming", "agile", "shipping features", "shadowing",
            "learning budget", "workshop", "feedback", "real projects"
        ];

        const lowerText = text.toLowerCase();

        const foundRed = redFlags.filter(flag => lowerText.includes(flag));
        const foundGreen = greenFlags.filter(flag => lowerText.includes(flag));

        // Base score 50. Green +10, Red -15.
        let score = 50;
        score += foundGreen.length * 10;
        score -= foundRed.length * 15;

        // Clamp 0-100
        score = Math.min(100, Math.max(0, score));

        let verdict = "";
        let color = "";

        if (score >= 80) {
            verdict = "Golden Opportunity 🌟";
            color = "text-green-600";
        } else if (score >= 50) {
            verdict = "Standard Internship 🤷‍♂️";
            color = "text-blue-600";
        } else {
            verdict = "Coffee Run Alert ☕️";
            color = "text-red-600";
        }

        setResult({ score, verdict, color, foundRed, foundGreen });
    };

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-slate-900">
                    <BsCupHot className="text-amber-700" />
                    The Coffee Run Detector
                </h2>
                <p className="text-slate-500 mt-2">
                    Paste a job description below. We'll tell you if you'll be coding or fetching lattes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Input Area */}
                <div className="flex flex-col gap-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste Job Description here..."
                        className="w-full h-64 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none transition-all shadow-sm"
                    />
                    <button
                        onClick={analyzeJob}
                        disabled={!text}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <BsSearch />
                        Analyze Job
                    </button>
                </div>

                {/* Results Area */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                    {result ? (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Score Circle */}
                            <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="none"
                                        className={result.color}
                                        strokeDasharray={377}
                                        strokeDashoffset={377 - (377 * result.score) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className={`absolute text-4xl font-black ${result.color}`}>{result.score}</span>
                            </div>

                            <h3 className={`text-2xl font-bold text-center mb-8 ${result.color}`}>{result.verdict}</h3>

                            <div className="space-y-4">
                                {result.foundGreen.length > 0 && (
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                        <p className="flex items-center gap-2 font-bold text-green-700 mb-2">
                                            <BsCheckCircle /> Green Flags
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.foundGreen.map(flag => (
                                                <span key={flag} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium capitalize">
                                                    {flag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.foundRed.length > 0 && (
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <p className="flex items-center gap-2 font-bold text-red-700 mb-2">
                                            <BsExclamationTriangle /> Red Flags
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.foundRed.map(flag => (
                                                <span key={flag} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium capitalize">
                                                    {flag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.foundGreen.length === 0 && result.foundRed.length === 0 && (
                                    <p className="text-center text-slate-400 text-sm">No specific keywords found. Proceed with caution.</p>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="text-center text-slate-400">
                            <BsCupHot size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Waiting for analysis...</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export function Tools() {
    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                    <BsTools className="text-blue-600" />
                    Career Tools
                </h1>
                <p className="text-gray-600">Advanced tools to help you land your dream job.</p>
            </div>

            <SkillRadar />
            <CoffeeDetector />
        </div>
    );
}
