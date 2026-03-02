import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsBuilding, BsCalendar, BsCash, BsClock, BsGeoAlt, BsPeople, BsCheckCircleFill, BsArrowLeft, BsX, BsFileEarmarkText } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

// Import Ace Editor
import AceEditor from "react-ace";
import ace from "ace-builds";

// Use webpack-resolver or manual path setting for Vite
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

// Fix for "Unable to infer path to ace"
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-noconflict/");
ace.config.setModuleUrl("ace/mode/javascript_worker", "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-noconflict/worker-javascript.js");

export function StudentInternshipDetail({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [selectedResearchInterests, setSelectedResearchInterests] = useState([]);
    const [codeSubmission, setCodeSubmission] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [editorTheme, setEditorTheme] = useState("monokai");
    const [isRunning, setIsRunning] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetchInternshipDetails();
        if (user) {
            checkApplicationStatus();
        }
    }, [id, user]);

    useEffect(() => {
        if (internship?.requiresCodeSubmission) {
            const lang = internship.programmingLanguage;
            if (lang && lang !== "Any") {
                setSelectedLanguage(lang.toLowerCase().replace('c++', 'c_cpp'));
            } else {
                setSelectedLanguage("javascript");
            }
        }
    }, [internship]);

    const fetchInternshipDetails = async () => {
        try {
            // Try TPO endpoint first
            let response;
            try {
                response = await axios.get(`${API_URL}/tpo/internships/${id}`);
                setInternship({ ...response.data, source: 'TPO' });
            } catch (tpoError) {
                // If TPO fails, try recruiter endpoint
                try {
                    response = await axios.get(`${API_URL}/recruiter/internships/${id}`);
                    setInternship({ ...response.data, source: 'Recruiter' });
                } catch (recruiterError) {
                    throw new Error("Internship not found");
                }
            }
        } catch (error) {
            console.error("Error fetching internship:", error);
            toast.error("Failed to load internship details");
            navigate("/internships");
        } finally {
            setLoading(false);
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/applications/my?studentId=${user._id}`);
            const myApplications = response.data;
            const applied = myApplications.some(app =>
                (app.internshipId?._id || app.internshipId) === id
            );
            setHasApplied(applied);
        } catch (error) {
            console.error("Error checking application status:", error);
        }
    };

    const handleRunCode = async () => {
        if (!codeSubmission.trim()) {
            toast.error("Please write some code first");
            return;
        }

        setIsRunning(true);
        setExecutionResult(null);

        // Language mapping for Piston API
        const langMap = {
            'javascript': { language: 'javascript', version: '18.15.0' },
            'python': { language: 'python', version: '3.10.0' },
            'java': { language: 'java', version: '15.0.2' },
            'c_cpp': { language: 'cpp', version: '10.2.0' }
        };

        const config = langMap[selectedLanguage] || langMap['javascript'];

        try {
            // Call our own backend proxy to avoid CORS issues
            const token = localStorage.getItem("token");
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.post(`${API_URL}/student/execute`, {
                language: config.language,
                version: config.version,
                files: [{ content: codeSubmission }]
            }, { headers });

            if (response.data && response.data.run) {
                setExecutionResult(response.data.run);
            } else {
                throw new Error("Invalid response from execution API");
            }
        } catch (error) {
            console.error("Execution Detailed Error:", error);
            const errorMsg = error.response?.data?.details?.message || error.response?.data?.error || error.message || "Unknown execution error";
            toast.error(`Execution failed: ${errorMsg}`);
            setExecutionResult({
                stderr: `Error: ${errorMsg}\n\nOur server could not process the execution request or the external service is down.`,
                code: 1
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to apply");
            navigate("/login");
            return;
        }

        const formData = new FormData(e.target);
        formData.append("studentId", user._id);
        formData.append("skillMatchPercentage", 85); // Hardcoded for demo

        // Program Type Matching Validation
        const selectedDegree = formData.get("degree");
        if (internship.programType && selectedDegree && internship.programType !== selectedDegree) {
            toast.error(`Error: This internship is specifically for ${internship.programType} students. Your selected degree is ${selectedDegree}.`);
            return;
        }

        if (internship.programType === "MTech" && selectedResearchInterests.length > 0) {
            formData.append("researchInterests", selectedResearchInterests.join(', '));
        }

        // Fix for Aadhar autofill: rename field in FormData to match backend
        if (formData.has("aadharNo")) {
            formData.append("aadhar", formData.get("aadharNo"));
            formData.delete("aadharNo");
        }

        // Add code submission if required
        if (internship.requiresCodeSubmission) {
            formData.append("codeSubmission", codeSubmission);
            formData.append("codeLanguage", selectedLanguage);
        }

        try {
            setApplying(true);
            await axios.post(`${API_URL}/internships/${id}/apply`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Application Submitted! Track it in Dashboard.");
            setHasApplied(true);
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error(error.response?.data?.error || "Failed to apply");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!internship) return <div className="min-h-screen flex items-center justify-center">Internship not found</div>;

    const isRemote = internship.locationType === 'Remote' || internship.title?.toLowerCase().includes('remote') || internship.description?.toLowerCase().includes('remote');

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/internships")}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                >
                    <BsArrowLeft className="mr-2" /> Back to Internships
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                            <BsBuilding size={200} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{internship.title}</h1>
                                    <div className="flex flex-wrap gap-4 text-blue-100 font-medium">
                                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                            <BsBuilding /> {internship.source === 'Recruiter' ? internship.companyName : (internship.tpoId?.organization || "Organization")}
                                        </span>
                                        <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                            <BsGeoAlt /> {internship.location || "Remote / On-Site"}
                                        </span>
                                        <span className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 font-bold ${internship.programType === "MTech" ? "bg-purple-500/30 text-white" : "bg-blue-500/30 text-white"}`}>
                                            {internship.programType || "BTech"} Program
                                        </span>
                                    </div>
                                </div>
                                {internship.tpoId?.avatar && (
                                    <img src={internship.tpoId.avatar} alt="Logo" className="w-20 h-20 rounded-xl bg-white p-1 object-contain" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">About the Internship</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Key Responsibilities & Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {internship.requiredSkills?.map((skill, index) => (
                                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {internship.programType === "MTech" && internship.researchTopics?.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-purple-600 pl-4">Research Topics</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {internship.researchTopics.map((topic, index) => (
                                            <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Eligibility</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Minimum CGPA: {internship.eligibility?.minCGPA}</li>
                                    <li>Years: {internship.eligibility?.yearOfStudy?.join(", ")}</li>
                                </ul>
                            </section>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Overview</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><BsCash className="text-lg" /> Stipend</span>
                                        <span className="font-semibold text-gray-900">₹{internship.stipend}/mo</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><BsClock className="text-lg" /> Duration</span>
                                        <span className="font-semibold text-gray-900">{internship.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><BsCalendar className="text-lg" /> Deadline</span>
                                        <span className="font-semibold text-red-600">{new Date(internship.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><BsPeople className="text-lg" /> Openings</span>
                                        <span className="font-semibold text-gray-900">{internship.seats} seats</span>
                                    </div>
                                </div>

                                {user?.role === 'tpo' ? (
                                    <div className="bg-gray-100 text-gray-500 p-4 rounded-xl text-center font-bold flex flex-col items-center gap-2 border border-gray-200">
                                        <BsPeople className="text-2xl" />
                                        TPO View Only
                                    </div>
                                ) : !hasApplied ? (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 group"
                                    >
                                        <span>Apply Now</span>
                                        <BsArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold flex flex-col items-center gap-2">
                                        <BsCheckCircleFill className="text-2xl" />
                                        Application Sent
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="bg-blue-600 p-6 sm:p-8 text-white shrink-0 relative">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Application Form</h2>
                                <p className="text-blue-100">Applying for {internship.title}</p>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition text-white"
                                >
                                    <BsX size={24} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-gray-50 flex-grow">
                                <form onSubmit={handleApply} className="space-y-6">

                                    {/* Personal Details */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                                <input type="text" name="name" defaultValue={user?.username} required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                                <input type="email" name="email" defaultValue={user?.email} required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                                <input type="tel" name="phone" required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="+91..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                                                <select name="gender" required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="aadharInput">Aadhar / PAN Number <span className="text-red-500">*</span></label>
                                                <input
                                                    id="aadharInput"
                                                    type="text"
                                                    name="aadharNo"
                                                    required
                                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="ID Proof Number"
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location <span className="text-red-500">*</span></label>
                                                <input type="text" name="location" required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="City, State" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Details */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">College Name <span className="text-red-500">*</span></label>
                                                <input type="text" name="college" required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Full College Name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
                                                <input type="text" name="branch" required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="e.g. CSE, ECE" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree <span className="text-red-500">*</span></label>
                                                <select name="degree" defaultValue={user?.degree || ""} required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                                    <option value="">Select Degree</option>
                                                    <option value="BTech">B.Tech</option>
                                                    <option value="MTech">M.Tech</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study <span className="text-red-500">*</span></label>
                                                <select name="yearOfStudy" required className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                                    <option value="">Select Year</option>
                                                    <option value="1st Year">1st Year</option>
                                                    <option value="2nd Year">2nd Year</option>
                                                    {/* Show 3rd/4th years only if it's potentially a BTech program (we'll let the user choose, but MTech is usually 2 years) */}
                                                    <option value="3rd Year">3rd Year</option>
                                                    <option value="4th Year">4th Year</option>
                                                    <option value="Graduated">Graduated</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resume & Links */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Resume & Profiles</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF/DOCX) <span className="text-red-500">*</span></label>
                                                <input type="file" name="resume" accept=".pdf,.doc,.docx" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg p-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Government ID (PDF/Image) <span className="text-red-500">*</span></label>
                                                <input type="file" name="govId" accept=".pdf,.png,.jpg,.jpeg" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg p-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">College ID (PDF/Image) <span className="text-red-500">*</span></label>
                                                <input type="file" name="collegeId" accept=".pdf,.png,.jpg,.jpeg" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg p-2" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                                <input type="url" name="linkedin" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Optional" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                                                <input type="url" name="github" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Optional" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / Website</label>
                                                <input type="url" name="portfolio" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Optional" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* MTech Research Interests Selection */}
                                    {internship.programType === "MTech" && internship.researchTopics?.length > 0 && (
                                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">Research Interests</h3>
                                            <p className="text-sm text-gray-600">Select the research fields you are interested in:</p>
                                            <div className="flex flex-wrap gap-3">
                                                {internship.researchTopics.map((topic, index) => (
                                                    <label key={index} className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all border ${selectedResearchInterests.includes(topic) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"}`}>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={selectedResearchInterests.includes(topic)}
                                                            onChange={() => {
                                                                if (selectedResearchInterests.includes(topic)) {
                                                                    setSelectedResearchInterests(prev => prev.filter(t => t !== topic));
                                                                } else {
                                                                    setSelectedResearchInterests(prev => [...prev, topic]);
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm font-medium">{topic}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Code Challenge Section */}
                                    {internship.requiresCodeSubmission && (
                                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 border-b border-orange-200 pb-2 flex items-center gap-2">
                                                <span className="text-xl">🤖</span> Code Challenge
                                            </h3>
                                            <div className="bg-white p-4 rounded-lg border border-orange-100 italic text-sm text-gray-700">
                                                <p className="font-bold mb-1">Problem Statement:</p>
                                                {internship.codeSubmissionPrompt || "Please solve the required coding challenge."}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                            Programming Language
                                                        </label>
                                                        {internship.programmingLanguage === "Any" ? (
                                                            <select
                                                                value={selectedLanguage}
                                                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                                            >
                                                                <option value="javascript">JavaScript</option>
                                                                <option value="python">Python</option>
                                                                <option value="java">Java</option>
                                                                <option value="c_cpp">C / C++</option>
                                                            </select>
                                                        ) : (
                                                            <span className="font-bold text-gray-800 bg-orange-100 px-3 py-1.5 rounded-lg text-sm border border-orange-200">
                                                                {internship.programmingLanguage}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 text-right">
                                                                Editor Theme
                                                            </label>
                                                            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditorTheme("monokai")}
                                                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorTheme === 'monokai' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                                >
                                                                    Dark
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditorTheme("github")}
                                                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorTheme === 'github' ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                                                >
                                                                    Light
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Run Button */}
                                                        <button
                                                            type="button"
                                                            onClick={handleRunCode}
                                                            disabled={isRunning}
                                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                                                        >
                                                            {isRunning ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                                    Running...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-lg">▶</span> Run Code
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Code Editor */}
                                                <div className="rounded-xl overflow-hidden border-2 border-gray-800 shadow-2xl group relative">
                                                    <div className="bg-gray-800 text-gray-400 px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center border-b border-gray-700">
                                                        <span>source_code.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'java' ? 'java' : 'cpp'}</span>
                                                        <div className="flex gap-1.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                                        </div>
                                                    </div>
                                                    <AceEditor
                                                        mode={selectedLanguage === "Any" ? "javascript" : selectedLanguage.toLowerCase().replace('c++', 'c_cpp')}
                                                        theme={editorTheme}
                                                        onChange={(value) => setCodeSubmission(value)}
                                                        name="code_editor"
                                                        value={codeSubmission}
                                                        editorProps={{ $blockScrolling: true }}
                                                        setOptions={{
                                                            enableBasicAutocompletion: true,
                                                            enableLiveAutocompletion: true,
                                                            enableSnippets: true,
                                                            showLineNumbers: true,
                                                            tabSize: 4,
                                                            fontSize: 14,
                                                            useWorker: false,
                                                            behavioursEnabled: true,
                                                            wrapBehavioursEnabled: true
                                                        }}
                                                        width="100%"
                                                        height="350px"
                                                        className="group-focus-within:border-orange-500 transition-colors"
                                                    />
                                                </div>

                                                {/* Terminal / Output Area */}
                                                <div className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${executionResult ? 'border-gray-800 h-auto' : 'border-gray-200 h-10'}`}>
                                                    <div
                                                        className="bg-gray-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center cursor-pointer"
                                                        onClick={() => setExecutionResult(executionResult ? null : executionResult)}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="text-blue-400 text-xs">$_</span> Terminal Output
                                                        </span>
                                                        {executionResult && (
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${executionResult.code === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                Exit Code: {executionResult.code}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {executionResult ? (
                                                        <div className="bg-black p-4 font-mono text-xs overflow-y-auto max-h-[200px] leading-relaxed">
                                                            {executionResult.stdout && (
                                                                <div className="text-gray-300 whitespace-pre-wrap mb-2">
                                                                    <span className="text-green-500 opacity-50 block mb-1">stdout:</span>
                                                                    {executionResult.stdout}
                                                                </div>
                                                            )}
                                                            {executionResult.stderr && (
                                                                <div className="text-gray-400 whitespace-pre-wrap">
                                                                    <span className="text-red-500 opacity-70 block mb-1">stderr / errors:</span>
                                                                    {executionResult.stderr}
                                                                </div>
                                                            )}
                                                            {!executionResult.stdout && !executionResult.stderr && (
                                                                <div className="text-gray-500 italic">Program executed with no output.</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 italic">Run your code to see results here...</div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                        AI Comparison Active
                                                    </div>
                                                    <div>
                                                        {codeSubmission.length} characters • {selectedLanguage}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Accommodation - Conditional */}
                                    {!isRemote && (
                                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Accommodation</h3>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Do you require accommodation arrangements?</label>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="accommodation" value="Yes, I need accommodation" required className="text-blue-600 focus:ring-blue-500" />
                                                    <span className="text-sm text-gray-700">Yes, please arrange accommodation</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="accommodation" value="No, I will manage" required className="text-blue-600 focus:ring-blue-500" />
                                                    <span className="text-sm text-gray-700">No, I will arrange my own</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="hidden sm:block text-gray-600 font-bold px-6 py-3 hover:bg-gray-200 rounded-xl transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="w-full sm:w-auto flex-1 bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {applying ? "Submitting..." : "Submit Application"}
                                        </button>
                                    </div>
                                    <p className="text-xs text-center text-gray-400">Your details will be shared with the recruiter.</p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
