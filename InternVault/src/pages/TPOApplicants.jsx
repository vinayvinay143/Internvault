import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft, BsPerson, BsEnvelope, BsPhone, BsCheckCircle, BsXCircle, BsDownload, BsFileEarmarkText, BsGeoAlt, BsBuilding, BsSend } from "react-icons/bs";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { ApplicantAnalytics } from "../components/ApplicantAnalytics";
import { OfferLetterModal } from "../components/OfferLetterModal";
import { ConfirmModal } from "../components/ConfirmModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function TPOApplicants({ user }) {
    const { internshipId } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResume, setSelectedResume] = useState(null);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectingApplicantId, setRejectingApplicantId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        isDangerous: false,
        confirmText: "Confirm"
    });

    // Export to CSV
    const exportToCSV = () => {
        if (applicants.length === 0) {
            toast.error("No applicants to export");
            return;
        }

        // Filter applicants if selection is made, otherwise export all
        const dataToExport = selectedIds.length > 0
            ? applicants.filter(app => selectedIds.includes(app._id))
            : applicants;

        const headers = ["Name", "Email", "Phone", "Gender", "College", "Branch", "Year", "City", "Status", "Research Interests"];

        const csvContent = [
            headers.join(","),
            ...dataToExport.map(app => [
                `"${app.name || ''}"`,
                `"${app.email || ''}"`,
                `"${app.phone || ''}"`,
                `"${app.gender || ''}"`,
                `"${app.college || ''}"`,
                `"${app.branch || ''}"`,
                `"${app.yearOfStudy || ''}"`,
                `"${app.location || ''}"`,
                `"${app.status}"`,
                `"${app.researchInterests ? app.researchInterests.join('; ') : ''}"`
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

    const handleBulkAction = async (actionStatus) => {
        if (selectedIds.length === 0) return;

        setModalConfig({
            isOpen: true,
            title: `Confirm Bulk ${actionStatus === 'selected' ? 'Selection' : 'Rejection'}`,
            message: `Are you sure you want to mark ${selectedIds.length} applicants as ${actionStatus}?`,
            isDangerous: actionStatus === 'rejected',
            confirmText: actionStatus === 'selected' ? 'Accept All' : 'Reject All',
            onConfirm: () => executeBulkAction(actionStatus)
        });
    };

    const executeBulkAction = async (actionStatus) => {

        try {
            // Using Promise.all for parallel requests (Optimistic UI update possible too)
            // Ideally backend should have a bulk endpoint, but loop works for MVP
            const promises = selectedIds.map(id =>
                axios.put(`${API_URL}/tpo/applicants/${id}/select`, { status: actionStatus })
            );

            await Promise.all(promises);

            toast.success(`Updated ${selectedIds.length} applicants to ${actionStatus}`);

            // Refresh Data
            setApplicants(prev => prev.map(app =>
                selectedIds.includes(app._id) ? { ...app, status: actionStatus } : app
            ));
            setSelectedIds([]);

        } catch (error) {
            console.error("Bulk update error:", error);
            toast.error("Failed to update some applicants");
        }
    };

    // Email Modal State
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);

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

            // Get emails of selected applicants
            const selectedApplicants = applicants.filter(app => selectedIds.includes(app._id));
            const recipients = selectedApplicants.map(app => app.email);

            console.log("Sending bulk email to:", recipients);
            console.log("Subject:", emailSubject);
            console.log("Message:", emailMessage);

            const response = await axios.post(`${API_URL}/tpo/email/bulk`, {
                recipients,
                subject: emailSubject,
                message: emailMessage
            });

            console.log("Email response:", response.data);
            toast.success(`Email sent to ${recipients.length} applicants!`);
            setShowEmailModal(false);
            setEmailSubject("");
            setEmailMessage("");
            setSelectedIds([]);

        } catch (error) {
            console.error("Email error:", error);
            console.error("Error response:", error.response?.data);

            // Show more specific error message
            if (error.response?.status === 500 && error.response?.data?.error?.includes("Invalid login")) {
                toast.error("Email service not configured. Please contact administrator.");
            } else {
                toast.error(error.response?.data?.error || "Failed to send emails");
            }
        } finally {
            setSendingEmail(false);
        }
    };

    useEffect(() => {
        if (user?.role === "tpo") {
            fetchInternshipDetails();
        }
    }, [user, internshipId]);

    const fetchInternshipDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/tpo/applicants/${internshipId}`);
            // Note: Endpoint returns array of applications if directly calling /tpo/applicants/:id
            // If the backend route structure is different (e.g. returning { internship, applicants }), adjust here.
            // Based on previous view_file of route, /tpo/applicants/:id returns [applicants array].
            // BUT we also need internship details. 
            // Previous code used `${API_URL}/tpo/internships/${internshipId}/applicants` which might be a different route or I need to fetch separately.
            // Let's check the route file again. 
            // Route /tpo/applicants/:internshipId returns `applicants` list populated with studentId.
            // It does NOT return internship details wrapper.
            // So we need to fetch internship details separately or rely on what we have.
            // I'll assume we need to fetch Internship details too.
            // I'll fetch internship separately.

            const [appResponse, internResponse] = await Promise.all([
                axios.get(`${API_URL}/tpo/applicants/${internshipId}`),
                axios.get(`${API_URL}/tpo/internships/${internshipId}`)
            ]);

            setApplicants(appResponse.data);
            setInternship(internResponse.data);

        } catch (error) {
            console.error("Error fetching data:", error);
            // Fallback if one fails or if route is different
            // toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, status, reason = "") => {
        try {
            await axios.put(`${API_URL}/tpo/applicants/${applicationId}/select`, {
                status,
                rejectionReason: reason
            });
            toast.success(`Application ${status}!`);

            // Close modal if open
            setShowRejectModal(false);
            setRejectionReason("");
            setRejectingApplicantId(null);

            // Update local state
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status, rejectionReason: reason } : app
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
            await axios.put(`${API_URL}/tpo/applicants/${rejectingApplicantId}/reject`, {
                rejectionReason: rejectionReason.trim()
            });

            toast.success("Application rejected");
            setApplicants(prev => prev.map(app =>
                app._id === rejectingApplicantId ? { ...app, status: "rejected", rejectionReason: rejectionReason.trim() } : app
            ));

            setShowRejectModal(false);
            setRejectingApplicantId(null);
            setRejectionReason("");
        } catch (error) {
            console.error("Error rejecting application:", error);
            toast.error("Failed to reject application");
        } finally {
            setRejecting(false);
        }
    };

    const openRejectModal = (applicantId) => {
        setRejectingApplicantId(applicantId);
        setShowRejectModal(true);
    };

    const openOfferLetterModal = (applicant) => {
        setSelectedApplicant(applicant);
        setShowOfferModal(true);
    };

    if (user?.role !== "tpo") {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600">This page is only accessible to TPO users.</p>
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
                        onClick={() => navigate("/tpo-internships")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                        <BsArrowLeft /> Back to Internships
                    </button>

                    {internship && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                            <p className="text-gray-600 mb-4">{internship.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                <span className="flex items-center gap-1">
                                    <strong>Duration:</strong> {internship.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <strong>Stipend:</strong> ₹{internship.stipend?.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <strong>Applicants:</strong> {applicants.length}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters & Export Toolbar */}
                <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={applicants.length > 0 && selectedIds.length === applicants.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedIds(applicants.map(a => a._id));
                                } else {
                                    setSelectedIds([]);
                                }
                            }}
                        />
                        <span className="text-gray-700 font-medium">Select All</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-2 animate-fade-in">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                    {selectedIds.length} Selected
                                </span>
                                <button
                                    onClick={() => handleBulkAction('selected')} // Placeholder
                                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center gap-1"
                                >
                                    <BsCheckCircle /> Accept
                                </button>
                                <button
                                    onClick={() => handleBulkAction('rejected')} // Placeholder
                                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-1"
                                >
                                    <BsXCircle /> Reject
                                </button>
                            </div>
                        )}

                        <button
                            onClick={exportToCSV}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition flex items-center gap-2"
                        >
                            <BsDownload /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Analytics Section */}
                {applicants.length > 0 && <ApplicantAnalytics applicants={applicants} />}

                {/* Applicants List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Applicants ({applicants.length})</h2>

                    {applicants.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No applicants yet for this internship.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applicants.map((application) => (
                                <div
                                    key={application._id}
                                    className={`border rounded-xl p-6 transition flex gap-4 ${selectedIds.includes(application._id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 flex-1">
                                        {/* Applicant Info */}
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl uppercase shrink-0">
                                                    {application.name ? application.name.charAt(0) : "U"}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        {application.name || "Unknown Student"}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                                                        <span className="flex items-center gap-1"><BsEnvelope className="text-xs" /> {application.email}</span>
                                                        <span className="flex items-center gap-1"><BsPhone className="text-xs" /> {application.phone}</span>
                                                        <span className="flex items-center gap-1"><BsGeoAlt className="text-xs" /> {application.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Research Interests (for MTech) */}
                                            {application.researchInterests && application.researchInterests.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                                                        Selected Research Fields
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {application.researchInterests.map((interest, idx) => (
                                                            <span key={idx} className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-200">
                                                                {interest}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Extended Details Box */}
                                            <div className="bg-gray-50 rounded-xl p-5 text-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Academic & Personal</h4>
                                                    <p className="flex justify-between"><span className="text-gray-500">College:</span> <span className="font-medium text-gray-900 text-right">{application.college}</span></p>
                                                    <p className="flex justify-between"><span className="text-gray-500">Branch:</span> <span className="font-medium text-gray-900 text-right">{application.branch}</span></p>
                                                    <p className="flex justify-between"><span className="text-gray-500">Year:</span> <span className="font-medium text-gray-900 text-right">{application.yearOfStudy}</span></p>
                                                    <p className="flex justify-between"><span className="text-gray-500">Gender:</span> <span className="font-medium text-gray-900 text-right">{application.gender}</span></p>
                                                    <p className="flex justify-between"><span className="text-gray-500">Aadhar/PAN:</span> <span className="font-medium text-gray-900 text-right">{application.aadhar}</span></p>
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Professional & Docs</h4>
                                                    <div className="flex flex-col gap-2">
                                                        {application.resumeUrl ? (
                                                            <button
                                                                onClick={() => setSelectedResume(application.resumeUrl)}
                                                                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline bg-blue-50 p-2 rounded-lg border border-blue-100 text-center justify-center w-full"
                                                            >
                                                                <BsFileEarmarkText /> View Resume
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 italic text-center p-2 bg-gray-100 rounded-lg">No Resume</span>
                                                        )}

                                                        {application.govIdUrl ? (
                                                            <button
                                                                onClick={() => setSelectedResume(application.govIdUrl)}
                                                                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline bg-blue-50 p-2 rounded-lg border border-blue-100 text-center justify-center w-full"
                                                            >
                                                                <BsFileEarmarkText /> View Gov ID
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 italic text-center p-2 bg-gray-100 rounded-lg">No Gov ID</span>
                                                        )}

                                                        {application.collegeIdUrl ? (
                                                            <button
                                                                onClick={() => setSelectedResume(application.collegeIdUrl)}
                                                                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline bg-blue-50 p-2 rounded-lg border border-blue-100 text-center justify-center w-full"
                                                            >
                                                                <BsFileEarmarkText /> View College ID
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 italic text-center p-2 bg-gray-100 rounded-lg">No College ID</span>
                                                        )}

                                                        <div className="flex gap-4 justify-center mt-1">
                                                            {application.linkedin ? <a href={application.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900 underline">LinkedIn</a> : <span className="text-gray-300">LinkedIn</span>}
                                                            {application.github ? <a href={application.github} target="_blank" rel="noreferrer" className="text-gray-800 hover:text-black underline">GitHub</a> : <span className="text-gray-300">GitHub</span>}
                                                            {application.portfolio ? <a href={application.portfolio} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800 underline">Portfolio</a> : <span className="text-gray-300">Portfolio</span>}
                                                        </div>
                                                    </div>

                                                    {application.accommodation && application.accommodation !== 'Not Applicable' && (
                                                        <div className="bg-yellow-50 border border-yellow-100 p-2 rounded text-xs text-yellow-800 mt-2">
                                                            <span className="font-bold">Accommodation:</span> {application.accommodation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:min-w-[140px] shrink-0">
                                            <div className="mb-2 text-center md:text-right">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${application.status === "selected" ? "bg-green-100 text-green-700" :
                                                        application.status === "rejected" ? "bg-red-100 text-red-700" :
                                                            "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {application.status}
                                                </span>
                                            </div>

                                            {application.status === "applied" && (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(application._id, "selected")}
                                                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm shadow-sm"
                                                    >
                                                        <BsCheckCircle /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setRejectingApplicantId(application._id);
                                                            setShowRejectModal(true);
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition font-semibold text-sm"
                                                    >
                                                        <BsXCircle /> Reject
                                                    </button>
                                                </div>
                                            )}

                                            {application.status === "selected" && (
                                                <button
                                                    onClick={() => openOfferLetterModal(application)}
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm shadow-sm mb-2"
                                                >
                                                    <BsSend /> Send Offer Letter
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Resume Preview Modal */}
            {
                selectedResume && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedResume(null)}>
                        <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <BsFileEarmarkText /> Document Preview
                                </h3>
                                <button onClick={() => setSelectedResume(null)} className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                    <BsXCircle size={24} />
                                </button>
                            </div>
                            <div className="flex-1 bg-gray-100 p-4 relative">
                                {selectedResume.toLowerCase().endsWith('.pdf') || selectedResume.startsWith('blob:') ? (
                                    <iframe
                                        src={(selectedResume.startsWith('http') ? selectedResume : API_URL.replace('/api', '') + selectedResume)}
                                        className="w-full h-full rounded border bg-white"
                                        title="Resume"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                        <BsFileEarmarkText size={64} className="text-blue-200" />
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-gray-700">Preview not available</p>
                                            <p className="text-sm">This file format (.docx/doc) cannot be previewed in the browser.</p>
                                        </div>
                                        <a
                                            href={(selectedResume.startsWith('http') ? selectedResume : API_URL.replace('/api', '') + selectedResume)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition transform hover:-translate-y-1"
                                        >
                                            Download File
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Rejection Modal */}
            {
                showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-scale-in">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Application</h3>
                            <p className="text-gray-600 mb-4 text-sm">Please provide a reason for rejecting this application. This will be visible to the student.</p>

                            <textarea
                                className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                rows="4"
                                placeholder="e.g. Skills do not match requirements, Position filled, etc."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                autoFocus
                            ></textarea>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(rejectingApplicantId, "rejected", rejectionReason)}
                                    disabled={!rejectionReason.trim()}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Offer Letter Modal */}
            <OfferLetterModal
                isOpen={showOfferModal}
                onClose={() => setShowOfferModal(false)}
                applicant={selectedApplicant}
                internship={internship}
                internshipId={internshipId}
                tpoOrg={user?.organization}
            />

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                isDangerous={modalConfig.isDangerous}
                confirmText={modalConfig.confirmText}
            />
        </div >
    );
}

export default TPOApplicants;
