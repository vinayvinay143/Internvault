import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowLeft, BsRobot, BsCheckCircle, BsXCircle, BsExclamationTriangle, BsCodeSlash, BsPerson, BsClock, BsWindowStack, BsClipboard, BsTrophy, BsCameraVideo, BsFileEarmarkText, BsBriefcase, BsEnvelope, BsBuilding, BsDownload, BsCalendarEvent, BsLink45Deg, BsPlusCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import { OfferLetterModal } from "../components/OfferLetterModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function RecruiterChallengeSubmissions({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [challenge, setChallenge] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [activeInternships, setActiveInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);

    // UI State
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [sortBy, setSortBy] = useState("score"); // score, wpm, date
    const [activeTab, setActiveTab] = useState("analysis"); // analysis, interview, profile

    // Modals
    const [showInternshipSelector, setShowInternshipSelector] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);

    // Interview Form State
    const [interviewForm, setInterviewForm] = useState({
        meetingLink: "",
        date: "",
        message: "",
        type: "Technical Round"
    });
    const [scheduling, setScheduling] = useState(false);

    useEffect(() => {
        if (user?.role === "recruiter") {
            fetchChallengeAndSubmissions();
            fetchInternships();
        }
    }, [id, user]);

    const fetchChallengeAndSubmissions = async () => {
        try {
            const [challengeRes, submissionsRes] = await Promise.all([
                axios.get(`${API_URL}/recruiter/code-challenges/${id}`),
                axios.get(`${API_URL}/recruiter/code-challenges/${id}/submissions`)
            ]);
            setChallenge(challengeRes.data);
            setSubmissions(submissionsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const fetchInternships = async () => {
        try {
            const response = await axios.get(`${API_URL}/recruiter/internships`, {
                params: { recruiterId: user._id }
            });
            // Filter only active internships
            const active = response.data.filter(i => i.status === 'active');
            setActiveInternships(active);
        } catch (error) {
            console.error("Error fetching internships:", error);
        }
    };

    const handleBack = () => {
        navigate("/recruiter/code-detection");
    };

    const getSortedSubmissions = () => {
        return [...submissions].sort((a, b) => {
            if (sortBy === "score") {
                return (b.aiAnalysis?.qualityScore || 0) - (a.aiAnalysis?.qualityScore || 0);
            }
            if (sortBy === "wpm") {
                return (b.proctoringData?.typingSpeedWPM || 0) - (a.proctoringData?.typingSpeedWPM || 0);
            }
            return new Date(b.submittedAt) - new Date(a.submittedAt);
        });
    };

    const handleOfferClick = () => {
        // Always show selector now, even if no internships
        setShowInternshipSelector(true);
    };

    const handleInternshipSelect = (internship) => {
        setSelectedInternship(internship);
        setShowInternshipSelector(false);
        setShowOfferModal(true);
    };

    const handleCustomOffer = () => {
        // Create a dummy internship object for custom offer
        const customInternship = {
            _id: "custom_offer_" + Date.now(),
            title: "", // Empty will prompt user to fill in modal
            stipend: "",
            location: "Remote",
            tpoId: { organization: user?.companyName || "Company" } // Mock TPO ID structure for modal compat
        };
        setSelectedInternship(customInternship);
        setShowInternshipSelector(false);
        setShowOfferModal(true);
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        setScheduling(true);

        try {
            await axios.post(`${API_URL}/recruiter/schedule-interview`, {
                studentEmail: selectedSubmission.studentEmail,
                studentName: selectedSubmission.studentName,
                meetingLink: interviewForm.meetingLink,
                date: interviewForm.date,
                message: interviewForm.message,
                interviewType: interviewForm.type
            });
            toast.success("Interview invitation sent successfully!");
            setInterviewForm({ meetingLink: "", date: "", message: "", type: "Technical Round" });
        } catch (error) {
            console.error("Schedule error:", error);
            toast.error("Failed to send invitation");
        } finally {
            setScheduling(false);
        }
    };

    const sortedSubmissions = getSortedSubmissions();

    if (user?.role !== "recruiter") {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600">This page is only accessible to Recruiter users.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-4 font-medium"
                    >
                        <BsArrowLeft /> Back to Challenges
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge?.title}</h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <BsTrophy /> AI Leaderboard - {submissions.length} Candidates
                            </p>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-purple-200"
                        >
                            <option value="score">Sort by Quality Score (High-Low)</option>
                            <option value="wpm">Sort by Speed (WPM)</option>
                            <option value="date">Sort by Recent</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Submissions List (Leaderboard) */}
                    <div className="lg:col-span-1 space-y-3 h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
                        {sortedSubmissions.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                                <BsCodeSlash className="text-4xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No submissions yet</p>
                            </div>
                        ) : (
                            sortedSubmissions.map((submission, index) => {
                                const score = submission.aiAnalysis?.qualityScore || 0;
                                const isTop3 = index < 3 && sortBy === "score";

                                return (
                                    <div
                                        key={submission._id}
                                        onClick={() => setSelectedSubmission(submission)}
                                        className={`relative bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selectedSubmission?._id === submission._id
                                            ? "border-purple-500 ring-2 ring-purple-100 bg-purple-50"
                                            : "border-gray-100 hover:border-purple-200"
                                            } ${isTop3 ? "pl-10" : ""}`}
                                    >
                                        {/* Rank Badge */}
                                        {sortBy === "score" && (
                                            <div className={`absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center font-bold text-white rounded-l-xl text-sm ${index === 0 ? "bg-yellow-400" :
                                                index === 1 ? "bg-gray-300" :
                                                    index === 2 ? "bg-orange-400" :
                                                        "bg-gray-100 text-gray-500 w-6 text-xs"
                                                }`}>
                                                {index + 1}
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {submission.studentId?.profilePic ? (
                                                    <img src={submission.studentId.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                        {submission.studentName ? submission.studentName.charAt(0) : <BsPerson />}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                                        {submission.studentName || "Anonymous"}
                                                    </h3>
                                                    <p className="text-[10px] text-gray-500">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {/* Score Badge */}
                                            <div className={`px-2 py-1 rounded-lg font-bold text-xs ${score >= 80 ? 'bg-green-100 text-green-700' :
                                                score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {score}/100
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                                                {submission.programmingLanguage}
                                            </span>
                                            {submission.proctoringData?.isSuspicious && (
                                                <span className="text-red-500 flex items-center gap-1 font-semibold">
                                                    <BsExclamationTriangle /> Suspicious
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Detailed View */}
                    <div className="lg:col-span-2">
                        {selectedSubmission ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 min-h-[600px]">
                                {/* Detail Header */}
                                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        {selectedSubmission.studentId?.avatar ? (
                                            <img src={selectedSubmission.studentId.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg shadow-blue-200" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg shadow-blue-200">
                                                {selectedSubmission.studentName ? selectedSubmission.studentName.charAt(0) : <BsPerson />}
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                                {selectedSubmission.studentName}
                                            </h2>
                                            <p className="text-sm text-gray-500">{selectedSubmission.studentEmail}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleOfferClick}
                                        className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition flex items-center gap-2"
                                    >
                                        <BsBriefcase /> Offer Internship
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-gray-200 px-6 bg-white">
                                    <button
                                        onClick={() => setActiveTab("analysis")}
                                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "analysis" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                    >
                                        <BsRobot /> AI Analysis
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("interview")}
                                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "interview" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                    >
                                        <BsCalendarEvent /> Schedule Interview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("profile")}
                                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "profile" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                    >
                                        <BsPerson /> Student Profile
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="bg-white">
                                    {/* --- TAB: AI ANALYSIS --- */}
                                    {activeTab === "analysis" && (
                                        <div className="animate-fade-in">
                                            {/* Score Card */}
                                            <div className="p-6 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-purple-900 mb-1">Code Quality Assessment</h3>
                                                    <div className="flex gap-2">
                                                        <span className="bg-white text-purple-700 px-2 py-1 rounded border border-purple-100 text-xs font-mono font-bold">
                                                            Time: {selectedSubmission.aiAnalysis?.timeComplexity || "N/A"}
                                                        </span>
                                                        <span className="bg-white text-purple-700 px-2 py-1 rounded border border-purple-100 text-xs font-mono font-bold">
                                                            Space: {selectedSubmission.aiAnalysis?.spaceComplexity || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-center bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100">
                                                    <div className="text-3xl font-bold text-purple-600">{selectedSubmission.aiAnalysis?.qualityScore || 0}</div>
                                                    <div className="text-[10px] uppercase font-bold text-gray-400">Score</div>
                                                </div>
                                            </div>

                                            {/* Code Viewer */}
                                            <div className="relative">
                                                <div className="absolute top-0 right-0 p-2">
                                                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded font-mono">
                                                        {selectedSubmission.programmingLanguage}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-900 p-4 overflow-x-auto max-h-[400px]">
                                                    <pre className="text-sm font-mono text-gray-300">
                                                        <code>{selectedSubmission.code}</code>
                                                    </pre>
                                                </div>
                                            </div>

                                            {/* Proctoring Data */}
                                            <div className="p-6 grid grid-cols-3 gap-4 bg-gray-50 border-t border-gray-100">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-gray-800">{selectedSubmission.proctoringData?.typingSpeedWPM || 0}</p>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">WPM</p>
                                                </div>
                                                <div className={`text-center ${selectedSubmission.proctoringData?.tabSwitchCount > 2 ? "text-red-600" : ""}`}>
                                                    <p className="text-2xl font-bold">{selectedSubmission.proctoringData?.tabSwitchCount || 0}</p>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Tab Switches</p>
                                                </div>
                                                <div className={`text-center ${selectedSubmission.proctoringData?.pasteCount > 0 ? "text-orange-600" : ""}`}>
                                                    <p className="text-2xl font-bold">{selectedSubmission.proctoringData?.pasteCount || 0}</p>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Pastes</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- TAB: SCHEDULE INTERVIEW --- */}
                                    {activeTab === "interview" && (
                                        <div className="p-8 animate-fade-in">
                                            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                                                    <BsCalendarEvent /> Propose Interview Time
                                                </h3>
                                                <p className="text-sm text-blue-600">
                                                    Send a Google Meet or Zoom link directly to the candidate along with a message.
                                                </p>
                                            </div>

                                            <form onSubmit={handleScheduleInterview} className="space-y-4 max-w-lg mx-auto">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Interview Type</label>
                                                    <select
                                                        value={interviewForm.type}
                                                        onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                                                    >
                                                        <option>Technical Round</option>
                                                        <option>HR Interview</option>
                                                        <option>Final Discussion</option>
                                                        <option>Live Coding Test</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Meeting Link (GMeet / Zoom)</label>
                                                    <div className="relative">
                                                        <BsLink45Deg className="absolute left-3 top-3 text-gray-400 text-xl" />
                                                        <input
                                                            type="url"
                                                            required
                                                            placeholder="https://meet.google.com/..."
                                                            value={interviewForm.meetingLink}
                                                            onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none transition"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Date & Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        required
                                                        value={interviewForm.date}
                                                        onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none transition"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Message to Candidate</label>
                                                    <textarea
                                                        rows="4"
                                                        placeholder="Add any specific instructions, e.g., 'Please have your IDE ready...'"
                                                        value={interviewForm.message}
                                                        onChange={(e) => setInterviewForm({ ...interviewForm, message: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                                                    ></textarea>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={scheduling}
                                                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-2"
                                                >
                                                    {scheduling ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><BsEnvelope /> Send Interview Invitation</>}
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {/* --- TAB: STUDENT PROFILE --- */}
                                    {activeTab === "profile" && (
                                        <div className="p-8 animate-fade-in">
                                            <div className="flex items-start gap-6 mb-8">
                                                {selectedSubmission.studentId?.avatar ? (
                                                    <img src={selectedSubmission.studentId.avatar} alt="Profile" className="w-24 h-24 rounded-2xl object-cover shadow-inner" />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400 text-4xl shadow-inner">
                                                        <BsPerson />
                                                    </div>
                                                )}
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedSubmission.studentName}</h2>
                                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                        <BsEnvelope size={14} /> {selectedSubmission.studentEmail}
                                                    </div>
                                                    {selectedSubmission.studentId?.organization && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <BsBuilding size={14} /> {selectedSubmission.studentId.organization}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <BsFileEarmarkText /> Resume / CV
                                                    </h3>
                                                    {selectedSubmission.studentId?.resume ? (
                                                        <a
                                                            href={selectedSubmission.studentId.resume.startsWith('http') ? selectedSubmission.studentId.resume : `${API_URL.replace('/api', '')}${selectedSubmission.studentId.resume}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
                                                        >
                                                            <BsDownload /> Download Resume
                                                        </a>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic text-center py-2">No resume uploaded</p>
                                                    )}
                                                </div>
                                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <BsWindowStack /> Portfolio
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {selectedSubmission.studentId?.github ? (
                                                            <a href={selectedSubmission.studentId.github} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline truncate">
                                                                GitHub
                                                            </a>
                                                        ) : (
                                                            <div className="text-sm text-gray-400 italic">GitHub not linked</div>
                                                        )}
                                                        {selectedSubmission.studentId?.linkedin ? (
                                                            <a href={selectedSubmission.studentId.linkedin} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline truncate">
                                                                LinkedIn
                                                            </a>
                                                        ) : (
                                                            <div className="text-sm text-gray-400 italic">LinkedIn not linked</div>
                                                        )}
                                                        {selectedSubmission.studentId?.website ? (
                                                            <a href={selectedSubmission.studentId.website} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline truncate">
                                                                Portfolio Website
                                                            </a>
                                                        ) : (
                                                            <div className="text-sm text-gray-400 italic">Website not linked</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-12 min-h-[400px]">
                                <BsTrophy className="text-6xl mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Candidate</h3>
                                <p className="text-sm">Click on a submission to view detailed analysis, interview options, and profile.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Internship Selector Modal */}
                {showInternshipSelector && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowInternshipSelector(false)}>
                        <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b">
                                <h3 className="text-xl font-bold text-gray-900">Select Internship Position</h3>
                                <p className="text-sm text-gray-600">Choose which internship you want to offer to <strong>{selectedSubmission.studentName}</strong>.</p>
                            </div>
                            <div className="p-4 max-h-[400px] overflow-y-auto">
                                <button
                                    onClick={handleCustomOffer}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 transition mb-3 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xl group-hover:scale-110 transition">
                                        <BsPlusCircle />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-purple-900">Create Custom Offer</h4>
                                        <p className="text-xs text-purple-700">Enter details manually (Stipend, Duration, etc.)</p>
                                    </div>
                                </button>

                                {activeInternships.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Posted Internships</p>
                                        {activeInternships.map(internship => (
                                            <button
                                                key={internship._id}
                                                onClick={() => handleInternshipSelect(internship)}
                                                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition group"
                                            >
                                                <h4 className="font-bold text-gray-800 group-hover:text-blue-700">{internship.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{internship.location} • {internship.stipend ? `₹${internship.stipend}` : 'Unpaid'}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                        <p>No active internships posted.</p>
                                        <p className="text-xs mt-1">Use "Create Custom Offer" above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Offer Letter Modal - ensure props are mapped correctly */}
                {selectedSubmission && selectedInternship && (
                    <OfferLetterModal
                        isOpen={showOfferModal}
                        onClose={() => setShowOfferModal(false)}
                        applicant={{
                            _id: selectedSubmission.studentId?._id || selectedSubmission.studentId,
                            subId: selectedSubmission.studentId?._id || selectedSubmission.studentId,
                            name: selectedSubmission.studentName,
                            email: selectedSubmission.studentEmail,
                            college: selectedSubmission.studentId?.organization || "University",
                            location: selectedSubmission.studentId?.location || "India"
                        }}
                        internship={selectedInternship}
                        internshipId={selectedInternship._id}
                        submissionId={selectedSubmission._id}
                        mode="recruiter"
                    />
                )}
            </div>
        </div>
    );
}

export default RecruiterChallengeSubmissions;
