import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft, BsPerson, BsEnvelope, BsPhone, BsCheckCircle, BsXCircle, BsCode, BsDownload, BsCalendarEvent, BsSticky, BsSearch, BsThreeDotsVertical, BsSend } from "react-icons/bs";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function RecruiterApplicants({ user }) {
    const { internshipId } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCode, setSelectedCode] = useState(null);
    const [filter, setFilter] = useState("all"); // all, ai-generated, human-written

    // New Features State
    const [selectedIds, setSelectedIds] = useState([]);
    const [skillFilter, setSkillFilter] = useState("");

    // Bulk Email State
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);

    // Interview Modal State
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewData, setInterviewData] = useState({
        applicationId: "",
        studentId: "",
        studentEmail: "",
        studentName: "",
        date: "",
        link: "",
        type: "Video Call",
        message: ""
    });
    const [schedulingInterview, setSchedulingInterview] = useState(false);

    // Notes State
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteContent, setNoteContent] = useState("");

    // Rejection Modal State
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectApplicationId, setRejectApplicationId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejecting, setRejecting] = useState(false);

    useEffect(() => {
        if (user?.role === "recruiter") {
            fetchData();
        }
    }, [user, internshipId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [internResponse, appResponse] = await Promise.all([
                axios.get(`${API_URL}/recruiter/internships/${internshipId}`),
                axios.get(`${API_URL}/recruiter/applicants/${internshipId}`)
            ]);

            setInternship(internResponse.data);
            setApplicants(appResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            await axios.put(`${API_URL}/recruiter/applicants/${applicationId}/status`, { status });
            toast.success(`Application ${status}!`);

            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status } : app
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update application status");
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        try {
            setRejecting(true);
            await axios.put(`${API_URL}/recruiter/applicants/${rejectApplicationId}/status`, {
                status: "rejected",
                rejectionReason: rejectionReason.trim()
            });

            toast.success("Application rejected");
            setApplicants(prev => prev.map(app =>
                app._id === rejectApplicationId ? { ...app, status: "rejected", rejectionReason: rejectionReason.trim() } : app
            ));

            setShowRejectModal(false);
            setRejectApplicationId(null);
            setRejectionReason("");
        } catch (error) {
            console.error("Error rejecting application:", error);
            toast.error("Failed to reject application");
        } finally {
            setRejecting(false);
        }
    };

    const exportToCSV = () => {
        if (filteredApplicants.length === 0) {
            toast.error("No applicants to export");
            return;
        }

        const dataToExport = selectedIds.length > 0
            ? applicants.filter(app => selectedIds.includes(app._id))
            : filteredApplicants;

        const headers = ["Name", "Email", "Phone", "Score", "Applied At", "Status", "Note"];

        const csvContent = [
            headers.join(","),
            ...dataToExport.map((app) => [
                `"${app.name || ''}"`,
                `"${app.email || ''}"`,
                `"${app.phone || ''}"`,
                `"${app.aiAnalysis?.qualityScore || 0}"`,
                `"${new Date(app.appliedAt).toLocaleDateString()}"`,
                `"${app.status}"`,
                `"${app.privateNotes || ''}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `applicants_${internshipId}_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkEmail = async () => {
        if (selectedIds.length === 0) {
            toast.error("No applicants selected");
            return;
        }

        if (!emailSubject.trim() || !emailMessage.trim()) {
            toast.error("Subject and message are required");
            return;
        }

        try {
            setSendingEmail(true);

            const selectedApplicants = applicants.filter(app => selectedIds.includes(app._id));
            const recipients = selectedApplicants.map(app => app.email);

            await axios.post(`${API_URL}/recruiter/email/bulk`, {
                recipients,
                subject: emailSubject,
                message: emailMessage
            });

            toast.success(`Email sent to ${recipients.length} applicants!`);
            setShowEmailModal(false);
            setEmailSubject("");
            setEmailMessage("");
            setSelectedIds([]);

        } catch (error) {
            console.error("Email error:", error);
            toast.error(error.response?.data?.error || "Failed to send emails");
        } finally {
            setSendingEmail(false);
        }
    };

    const handleSaveNote = async (applicationId) => {
        try {
            await axios.put(`${API_URL}/recruiter/applicants/${applicationId}/note`, {
                privateNotes: noteContent
            });

            toast.success("Note saved!");
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, privateNotes: noteContent } : app
            ));
            setEditingNoteId(null);
            setNoteContent("");
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note");
        }
    };

    const getIntegrityBadge = (proctoringData) => {
        if (!proctoringData) {
            return <span className="text-gray-400 text-xs">Not monitored</span>;
        }

        const { verdict, isSuspicious } = proctoringData;

        if (isSuspicious) {
            return (
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${verdict === "Highly Suspicious" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                        ⚠️ {verdict}
                    </span>
                </div>
            );
        } else {
            return (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    ✅ Clean Record
                </span>
            );
        }
    };

    const filteredApplicants = applicants.filter(app => {
        if (filter === "all") return true;
        if (filter === "suspicious") return app.proctoringData?.isSuspicious;
        if (filter === "clean") return !app.proctoringData?.isSuspicious;
        return true;
    });

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
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading applicants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/recruiter/internships")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                        <BsArrowLeft /> Back to Internships
                    </button>

                    {internship && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                            <p className="text-gray-600 mb-4">{internship.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                <span><strong>Location:</strong> {internship.location} ({internship.locationType})</span>
                                <span><strong>Duration:</strong> {internship.duration}</span>
                                <span><strong>Stipend:</strong> ₹{internship.stipend?.toLocaleString()}</span>
                                <span><strong>Applicants:</strong> {applicants.length}</span>
                                {internship.requiresCodeSubmission && (
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                        🤖 Code Submission Required
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters & Actions Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

                    {/* Filter Group */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {internship?.requiresCodeSubmission && (
                            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${filter === "all" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter("clean")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${filter === "clean" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                    Clean
                                </button>
                                <button
                                    onClick={() => setFilter("suspicious")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${filter === "suspicious" ? "bg-red-100 text-red-700" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                    Suspicious
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, skill..."
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            />
                        </div>
                    </div>

                    {/* Bulk Actions Group */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {selectedIds.length > 0 ? (
                            <div className="flex items-center gap-2 animate-fade-in">
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {selectedIds.length}
                                </span>
                                <button
                                    onClick={() => setShowEmailModal(true)}
                                    className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-900 transition flex items-center gap-2"
                                >
                                    <BsEnvelope size={14} /> Email
                                </button>
                            </div>
                        ) : null}

                        <button
                            onClick={exportToCSV}
                            className="bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                        >
                            <BsDownload size={14} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Leaderboard Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        🏆 Leaderboard <span className="text-gray-500 text-lg font-normal">({filteredApplicants.length})</span>
                    </h2>

                    {/* Sort Options */}
                    <select
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                            const sortType = e.target.value;
                            setApplicants(prev => {
                                const sorted = [...prev];
                                if (sortType === 'score') {
                                    return sorted.sort((a, b) => (b.aiAnalysis?.qualityScore || 0) - (a.aiAnalysis?.qualityScore || 0));
                                }
                                if (sortType === 'wpm') {
                                    return sorted.sort((a, b) => (b.proctoringData?.typingSpeedWPM || 0) - (a.proctoringData?.typingSpeedWPM || 0));
                                }
                                return sorted;
                            });
                        }}
                    >
                        <option value="score">Sort by Quality Score (High to Low)</option>
                        <option value="wpm">Sort by Speed (WPM)</option>
                    </select>
                </div>

                {/* Applicants List (Leaderboard) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    {filteredApplicants.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No applicants yet for this internship.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredApplicants
                                .sort((a, b) => (b.aiAnalysis?.qualityScore || 0) - (a.aiAnalysis?.qualityScore || 0)) // Force default sort
                                .map((application, index) => {
                                    const analysis = application.aiAnalysis || {};
                                    const score = analysis.qualityScore || 0;
                                    const isTop3 = index < 3;

                                    return (
                                        <div
                                            key={application._id}
                                            className={`relative border rounded-xl p-6 transition hover:border-purple-300 ${isTop3 ? 'bg-gradient-to-r from-purple-50 to-white border-purple-200' : 'bg-white'}`}
                                        >
                                            {/* Rank Badge */}
                                            <div className={`absolute -left-3 -top-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg z-10 ${index === 0 ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-200' :
                                                index === 1 ? 'bg-gray-300 text-gray-800 border-2 border-gray-100' :
                                                    index === 2 ? 'bg-orange-400 text-orange-900 border-2 border-orange-200' :
                                                        'bg-gray-800 text-gray-200 text-sm w-8 h-8 -left-2 -top-2'
                                                }`}>
                                                #{index + 1}
                                            </div>

                                            {/* Checkbox for Bulk Actions */}
                                            <div className="absolute right-4 top-4 z-20">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={selectedIds.includes(application._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds([...selectedIds, application._id]);
                                                        } else {
                                                            setSelectedIds(selectedIds.filter(id => id !== application._id));
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pl-4">
                                                {/* Applicant Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
                                                            {application.name ? application.name.charAt(0) : "U"}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                                {application.name || "Unknown Student"}
                                                                {isTop3 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200">Top Performer</span>}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                                                                <span className="flex items-center gap-1"><BsEnvelope className="text-xs" /> {application.email}</span>
                                                                <span className="flex items-center gap-1"><BsPhone className="text-xs" /> {application.phone}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* AI Analysis Report */}
                                                    {internship?.requiresCodeSubmission && application.codeSubmission && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            {/* Quality Card */}
                                                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-bold text-purple-900 text-sm uppercase tracking-wide">Code Quality</h4>
                                                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-purple-700 font-bold shadow-sm border border-purple-100">
                                                                        <span className="text-lg">{score}/100</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2 mb-2">
                                                                    {analysis.timeComplexity && (
                                                                        <span className="text-xs font-mono bg-white text-purple-700 px-2 py-1 rounded border border-purple-200">
                                                                            ⏳ {analysis.timeComplexity}
                                                                        </span>
                                                                    )}
                                                                    {analysis.spaceComplexity && (
                                                                        <span className="text-xs font-mono bg-white text-purple-700 px-2 py-1 rounded border border-purple-200">
                                                                            💾 {analysis.spaceComplexity}
                                                                        </span>
                                                                    )}
                                                                    <span className={`text-xs px-2 py-1 rounded border font-semibold ${analysis.qualityScore >= 80 ? 'bg-green-100 text-green-700 border-green-200' :
                                                                        analysis.qualityScore >= 50 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                                            'bg-red-100 text-red-700 border-red-200'
                                                                        }`}>
                                                                        {analysis.codeQualityRating || "Not Rated"}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-purple-800 italic">
                                                                    "{analysis.feedback || "AI Analysis pending..."}"
                                                                </p>
                                                            </div>

                                                            {/* Proctoring Card (Compact) */}
                                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Behavior</h4>
                                                                    {getIntegrityBadge(application.proctoringData)}
                                                                </div>
                                                                <div className="flex gap-3 text-xs text-gray-600">
                                                                    <div>WPM: <strong>{application.proctoringData?.typingSpeedWPM || 0}</strong></div>
                                                                    <div>Switches: <strong>{application.proctoringData?.tabSwitchCount || 0}</strong></div>
                                                                </div>
                                                                <button
                                                                    onClick={() => setSelectedCode({ code: application.codeSubmission, language: application.codeLanguage || "javascript" })}
                                                                    className="flex items-center gap-1 text-blue-600 font-semibold hover:underline text-xs mt-3"
                                                                >
                                                                    <BsCode /> View Code
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Resume */}
                                                    {application.resumeUrl && (
                                                        <a
                                                            href={application.resumeUrl.startsWith('http') ? application.resumeUrl : `${API_URL.replace('/api', '')}${application.resumeUrl}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-600 font-semibold hover:underline text-sm"
                                                        >
                                                            📄 View Resume
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Private Notes Section */}
                                                <div className="mt-3 bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h5 className="text-xs font-bold text-yellow-800 flex items-center gap-1">
                                                            <BsSticky /> Private Notes
                                                        </h5>
                                                        {editingNoteId !== application._id ? (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingNoteId(application._id);
                                                                    setNoteContent(application.privateNotes || "");
                                                                }}
                                                                className="text-xs text-yellow-700 hover:text-yellow-900 font-semibold"
                                                            >
                                                                Edit
                                                            </button>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => setEditingNoteId(null)} className="text-xs text-gray-500">Cancel</button>
                                                                <button onClick={() => handleSaveNote(application._id)} className="text-xs text-blue-600 font-bold">Save</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {editingNoteId === application._id ? (
                                                        <textarea
                                                            className="w-full text-xs p-2 border rounded bg-white text-gray-700 mb-1"
                                                            rows={2}
                                                            value={noteContent}
                                                            onChange={(e) => setNoteContent(e.target.value)}
                                                            placeholder="Add internal note..."
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-700 italic">
                                                            {application.privateNotes || <span className="text-gray-400 text-xs">No notes added.</span>}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-row md:flex-col gap-2 md:min-w-[140px]">
                                                    <div className="mb-2">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${application.status === "selected" ? "bg-green-100 text-green-700" :
                                                            application.status === "rejected" ? "bg-red-100 text-red-700" :
                                                                "bg-yellow-100 text-yellow-700"
                                                            }`}>
                                                            {application.status}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setInterviewData({
                                                                applicationId: application._id,
                                                                studentId: application.studentId,
                                                                studentEmail: application.email,
                                                                studentName: application.name,
                                                                date: "",
                                                                link: "",
                                                                type: "Video Call",
                                                                message: ""
                                                            });
                                                            setShowInterviewModal(true);
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-white text-purple-700 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition font-semibold text-sm mt-2"
                                                    >
                                                        <BsCalendarEvent /> Schedule Interview
                                                    </button>

                                                    {application.status === "pending" && (
                                                        <button
                                                            onClick={() => {
                                                                setRejectApplicationId(application._id);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold text-sm mt-2"
                                                        >
                                                            <BsXCircle /> Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Code Viewer Modal */}
            {
                selectedCode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCode(null)}>
                        <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <BsCode /> Submitted Code ({selectedCode.language || "Unknown"})
                                </h3>
                                <button onClick={() => setSelectedCode(null)} className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                    <BsXCircle size={24} />
                                </button>
                            </div>
                            <div className="flex-1 bg-gray-900 p-6 overflow-auto">
                                <pre className="text-green-400 font-mono text-sm">
                                    <code>{selectedCode.code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Email Modal */}
            {
                showEmailModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}>
                        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><BsEnvelope /> Bulk Email ({selectedIds.length} Recipients)</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Email Subject"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <textarea
                                    placeholder="Message body..."
                                    rows={6}
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                ></textarea>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button
                                        onClick={handleBulkEmail}
                                        disabled={sendingEmail}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {sendingEmail ? "Sending..." : <><BsSend /> Send Emails</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Interview Modal */}
            {
                showInterviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInterviewModal(false)}>
                        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 text-purple-700">
                                <BsCalendarEvent /> Schedule Interview
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Send an interview invitation to <strong>{interviewData.studentName}</strong>.
                            </p>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={interviewData.date}
                                            onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Interview Type</label>
                                        <select
                                            value={interviewData.type}
                                            onChange={(e) => setInterviewData({ ...interviewData, type: e.target.value })}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                        >
                                            <option>Video Call</option>
                                            <option>Phone Call</option>
                                            <option>In-Person</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Meeting Link / Location</label>
                                    <input
                                        type="text"
                                        placeholder="https://meet.google.com/..."
                                        value={interviewData.link}
                                        onChange={(e) => setInterviewData({ ...interviewData, link: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea
                                        placeholder="Add specific instructions..."
                                        rows={3}
                                        value={interviewData.message}
                                        onChange={(e) => setInterviewData({ ...interviewData, message: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setShowInterviewModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button
                                        onClick={async () => {
                                            // Handle Schedule Interview
                                            setSchedulingInterview(true);
                                            try {
                                                await axios.post(`${API_URL}/recruiter/schedule-interview`, {
                                                    applicationId: interviewData.applicationId, // Send Application ID
                                                    studentEmail: interviewData.studentEmail,
                                                    studentName: interviewData.studentName,
                                                    meetingLink: interviewData.link,
                                                    date: interviewData.date,
                                                    message: interviewData.message,
                                                    interviewType: interviewData.type
                                                });
                                                toast.success("Interview invitation sent successfully!");
                                                setShowInterviewModal(false);
                                                // Update local state if needed (optional)
                                            } catch (error) {
                                                console.error("Schedule error:", error);
                                                toast.error("Failed to schedule interview");
                                            } finally {
                                                setSchedulingInterview(false);
                                            }
                                        }}
                                        disabled={schedulingInterview}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {schedulingInterview ? "Scheduling..." : "Send Invitation"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Rejection Modal */}
            {
                showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}>
                        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BsXCircle className="text-red-600" /> Reject Application
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Please provide a reason for rejecting this application. This will be visible to the student.
                            </p>
                            <textarea
                                placeholder="Enter rejection reason..."
                                rows={4}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                            ></textarea>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason("");
                                        setRejectApplicationId(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={rejecting || !rejectionReason.trim()}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {rejecting ? "Rejecting..." : "Confirm Rejection"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default RecruiterApplicants;
