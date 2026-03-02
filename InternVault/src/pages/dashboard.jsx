import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BsPersonCircle, BsBriefcase, BsLink45Deg, BsImage, BsPencil, BsCheck, BsX, BsTrash, BsShieldCheck, BsExclamationTriangle, BsExclamationTriangleFill, BsCheckCircleFill, BsGithub, BsLinkedin, BsGlobe, BsCalendarEvent } from "react-icons/bs";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";
import { GroqService } from "../services/groq";
import { jsPDF } from "jspdf";
import { BsDownload } from "react-icons/bs";

const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliza&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mira&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Dante&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Theo&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Orion&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Smiley&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cheer&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Giggles&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jolly&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sparkle&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Chuckle&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Glow&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=SmileMore&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Happiness&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Laughs&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Radiant&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Flo&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Happy&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Joy&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunny&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bliss&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Grin&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bright&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Delight&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunbeam&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Twinkle&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Cheeky&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Playful&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Peppy&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=BrightEyes&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=GlowUp&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Chirpy&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Radiance&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Spark&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Beaming&mouth=smile",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=LightHeart&mouth=smile"
];

export function Dashboard({ user, setUser }) {
    const [activeAds, setActiveAds] = useState([]);
    const [formData, setFormData] = useState({
        companyName: "",
        link: "",
        imageUrl: "" // Can be used for legacy or if we want to allow URL input too
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null); // { status: 'Verified' | 'Flagged', reason: '...' }
    const [deleteId, setDeleteId] = useState(null);

    // Verification state
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Profile editing state
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({
        username: "",
        phone: "",
        organization: "",
        yearOfStudy: "",
        avatar: "",
        whatsappNotifications: true,
        resume: "",
        linkedin: "",
        github: "",
        website: ""
    });
    const [editLoading, setEditLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    // Applications Tracking State
    const [activeTab, setActiveTab] = useState("applications"); // Default to applications
    const [myApplications, setMyApplications] = useState([]);
    const [fetchingApps, setFetchingApps] = useState(false);

    useEffect(() => {
        if (user?._id) {
            fetchUserAds();
            fetchMyApplications(); // Fetch applications on mount

            // Initialize edit data with current user data
            setEditData({
                username: user.username || "",
                phone: user.phone || "",
                organization: user.organization || "",
                yearOfStudy: user.yearOfStudy || "",
                avatar: user.avatar || avatars[0],
                whatsappNotifications: user.whatsappNotifications !== undefined ? user.whatsappNotifications : true,
                resume: user.resume || "",
                linkedin: user.linkedin || "",
                github: user.github || "",
                website: user.website || ""
            });

            // Set default tab based on role
            if (user.role === 'tpo') {
                setActiveTab('host');
            }
        }
    }, [user]);

    const fetchUserAds = async () => {
        try {
            const response = await axios.get(`${API_URL}/ads/user/${user._id}`);
            setActiveAds(response.data);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    const fetchMyApplications = async () => {
        try {
            setFetchingApps(true);
            const response = await axios.get(`${API_URL}/applications/my`, {
                params: { studentId: user._id }
            });
            setMyApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setFetchingApps(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Reset verification when user changes input
        setVerificationStatus(null);
    };

    // Debounced verification function
    const verifyLegitimacy = useCallback(async (companyName, link) => {
        if (!companyName || !link) return;

        setIsVerifying(true);
        try {
            const response = await axios.post(`${API_URL}/ads/verify-legitimacy`, {
                companyName,
                link
            });
            setVerificationStatus(response.data);
        } catch (error) {
            console.error("Verification error:", error);
            setVerificationStatus({
                status: "Flagged",
                reason: "Unable to verify"
            });
        } finally {
            setIsVerifying(false);
        }
    }, []);

    // Trigger verification when both fields are filled
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.companyName && formData.link) {
                verifyLegitimacy(formData.companyName, formData.link);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [formData.companyName, formData.link, verifyLegitimacy]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // STRICT SECURITY: Block submission if flagged
        if (verificationStatus?.status === "Flagged") {
            toast.error(`Security Alert: ${verificationStatus.reason}. You cannot post this internship.`);
            return;
        }

        setLoading(true);

        try {
            // 1. STRICT VERIFICATION
            let verificationStatus = 'Unverified';
            let verificationReason = '';

            // Re-using the verify logic here for blocking
            toast.loading("Verifying Company & Link...", { id: "verifyToast" });

            let searchContext = "No web results found.";
            if (tavilyApiKey) {
                try {
                    const response = await fetch("https://api.tavily.com/search", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            api_key: tavilyApiKey,
                            query: `${formData.companyName} company official site reviews scam`,
                            search_depth: "basic",
                            max_results: 3
                        })
                    });
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        searchContext = data.results.map(r => `${r.title}: ${r.content}`).join("\n");
                    }
                } catch (e) {
                    console.error("Search failed", e);
                }
            }

            // 2. AI Logic - SMART STRICT MODE
            const prompt = `
                Analyze this internship hosting request for LEGITIMACY.
                
                Company Name: "${formData.companyName}"
                Provided Application Link: "${formData.link}"
                Search Context: ${searchContext}

                YOUR TASK:
                You are a security firewall. You must FLAG suspicious requests but ALLOW valid ones.

                CRITICAL CHECKS:
                1. DOMAIN MATCHING: 
                   - Does the URL domain match the Company Name? (e.g. "Microsoft" -> "microsoft.com") -> VERIFIED.
                   - Is it a TRUSTED HIRING PLATFORM? (e.g., internshala.com, linkedin.com, ycombinator.com, unstop.com, wellfound.com, glassdoor.com) -> VERIFIED.
                   
                2. SCAM DETECTION:
                   - If Link is a URL shortener (bit.ly, tinyurl) -> FLAGGED.
                   - If Link is a generic form (docs.google, forms.gle) -> FLAGGED (unless Company is a small student club).
                   - If search results warn about scams -> FLAGGED.

                3. VERDICT RULES:
                   - If it's a known job board (Internshala, etc.) -> "Verified".
                   - If domain matches company -> "Verified".
                   - If mismatch and NOT a job board -> "Flagged".

                Return JSON ONLY:
                {
                    "status": "Verified" | "Flagged",
                    "reason": "Direct, short reason (max 10 words)"
                }
            `;

            const result = await GroqService.generateJSON(prompt);

            toast.dismiss("verifyToast");

            // STRICT BLOCKING: Block if Flagged OR Unverified
            if (result.status !== 'Verified') {
                toast.error(`Blocked: ${result.reason}`, { duration: 6000, icon: '🛡️' });
                setVerificationResult(result);
                setVerifying(false);
                setLoading(false);
                return; // 🛑 BLOCK SUBMISSION 🛑
            }

            verificationStatus = result.status;
            verificationReason = result.reason;
            setVerificationResult(result);

            // 2. PROCEED TO POST
            const data = new FormData();
            data.append('userId', user._id);
            data.append('companyName', formData.companyName);
            data.append('link', formData.link);
            data.append('verificationStatus', verificationStatus);
            data.append('verificationReason', verificationReason);

            if (imageFile) {
                data.append('image', imageFile);
            }

            await axios.post(`${API_URL}/ads/add`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Verified & Posted Successfully!");
            setFormData({ companyName: "", link: "", imageUrl: "" });
            setImageFile(null);
            setVerificationStatus(null);
            setVerificationResult(null);
            fetchUserAds();
        } catch (error) {
            console.error("Error posting ad:", error);
            toast.error("Failed to post internship. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`${API_URL}/ads/${deleteId}`, {
                data: { userId: user._id }
            });
            toast.success("Internship deleted successfully!");
            fetchUserAds();
        } catch (error) {
            console.error("Error deleting ad:", error);
            toast.error(error.response?.data?.error || "Failed to delete internship.");
        }
        setDeleteId(null);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData({
            ...editData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Reset to original user data
        setEditData({
            username: user.username || "",
            phone: user.phone || "",
            organization: user.organization || "",
            yearOfStudy: user.yearOfStudy || "",
            avatar: user.avatar || avatars[0],
            whatsappNotifications: user.whatsappNotifications !== undefined ? user.whatsappNotifications : true
        });
    };

    const handleSaveProfile = async () => {
        setEditLoading(true);

        try {
            const formData = new FormData();
            formData.append("username", editData.username);
            formData.append("phone", editData.phone);
            formData.append("organization", editData.organization);
            formData.append("yearOfStudy", editData.yearOfStudy);
            formData.append("avatar", editData.avatar);
            formData.append("whatsappNotifications", editData.whatsappNotifications);
            formData.append("linkedin", editData.linkedin);
            formData.append("github", editData.github);
            formData.append("website", editData.website);

            // Append Resume File if selected
            if (resumeFile) {
                formData.append("resume", resumeFile);
            }

            const response = await axios.put(`${API_URL}/user/${user._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Update user in state and localStorage
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!");
            setIsEditMode(false);
            setResumeFile(null); // Reset file input
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.error || "Failed to update profile. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };



    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                <p className="text-gray-600">You need to be logged in to access the dashboard.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: User Profile */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                        {/* Avatar */}
                        {isEditMode ? (
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">Choose Avatar</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {avatars.map((avatar, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setEditData({ ...editData, avatar })}
                                            className={`cursor-pointer rounded-full transition-all ${editData.avatar === avatar
                                                ? 'ring-4 ring-blue-500 scale-110'
                                                : 'opacity-60 hover:opacity-100 hover:scale-105'
                                                }`}
                                        >
                                            <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-auto rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <BsPersonCircle className="text-blue-600 text-4xl" />
                                )}
                            </div>
                        )}

                        {/* Profile Information */}
                        {isEditMode ? (
                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editData.username}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email (Read-only)</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editData.phone}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="919876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Organization</label>
                                    <input
                                        type="text"
                                        name="organization"
                                        value={editData.organization}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="University Name"
                                    />
                                </div>
                                {user.role !== 'tpo' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Year of Study</label>
                                        <select
                                            name="yearOfStudy"
                                            value={editData.yearOfStudy}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="whatsappNotifications"
                                        name="whatsappNotifications"
                                        checked={editData.whatsappNotifications}
                                        onChange={handleEditChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="whatsappNotifications" className="text-xs text-gray-700 cursor-pointer">
                                        WhatsApp Notifications
                                    </label>
                                </div>

                                {user.role === 'student' && (
                                    <>
                                        <div className="pt-2 border-t border-gray-100 mt-2">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Update Resume (PDF/DOCX)</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setResumeFile(e.target.files[0])}
                                                className="w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-xs file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                cursor-pointer"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">LinkedIn</label>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                value={editData.linkedin}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                placeholder="https://linkedin.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">GitHub</label>
                                            <input
                                                type="url"
                                                name="github"
                                                value={editData.github}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Portfolio</label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={editData.website}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                placeholder="https://myportfolio.com"
                                            />
                                        </div>
                                    </>
                                )}



                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={editLoading}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <BsCheck size={20} /> {editLoading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={editLoading}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <BsX size={20} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.username || "User"}</h2>
                                <p className="text-gray-500 mb-2 text-sm">{user.email}</p>

                                {/* Role Badge */}
                                <div className="mb-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.role === "tpo"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {user.role === "tpo" ? "👔 TPO" : "🎓 Student"}
                                    </span>
                                </div>



                                <div className="border-t border-gray-100 pt-6 text-left space-y-3">
                                    {user.phone && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">Phone:</span>
                                            <p className="font-medium text-gray-800">{user.phone}</p>
                                        </div>
                                    )}
                                    {user.organization && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">Organization:</span>
                                            <p className="font-medium text-gray-800">{user.organization}</p>
                                        </div>
                                    )}

                                    {/* Student Specific Details */}
                                    {user.role === 'student' && (
                                        <>
                                            {user.resume && (
                                                <div className="pt-2">
                                                    <a
                                                        href={`${API_URL.replace('/api', '')}${user.resume}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition"
                                                    >
                                                        <BsDownload /> Download Resume
                                                    </a>
                                                </div>
                                            )}

                                            <div className="flex gap-3 justify-center pt-2">
                                                {user.linkedin && (
                                                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition text-xl">
                                                        <BsLinkedin />
                                                    </a>
                                                )}
                                                {user.github && (
                                                    <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition text-xl">
                                                        <BsGithub />
                                                    </a>
                                                )}
                                                {user.website && (
                                                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition text-xl">
                                                        <BsGlobe />
                                                    </a>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {user.yearOfStudy && user.role !== 'tpo' && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">Year of Study:</span>
                                            <p className="font-medium text-gray-800">
                                                {user.yearOfStudy === "Other" ? "Other" : `${user.yearOfStudy}${user.yearOfStudy === "1" ? "st" : user.yearOfStudy === "2" ? "nd" : user.yearOfStudy === "3" ? "rd" : "th"} Year`}
                                            </p>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-100 pt-3">
                                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">My Stats</h3>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Active Posts</span>
                                            <span className="font-bold text-gray-900">{activeAds.length}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="mt-6 w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-2 text-sm"
                                >
                                    <BsPencil /> Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column: Applications & Hosting */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Tabs */}
                    <div className="bg-white p-2 rounded-xl border border-gray-100 flex gap-2 w-fit">
                        {user.role !== 'tpo' && (
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                My Applications
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('host')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'host' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {user.role === 'tpo' ? 'Manage Internships' : 'Host Internship'}
                        </button>
                    </div>

                    {activeTab === 'applications' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BsCheckCircleFill className="text-blue-600" /> My Applications
                            </h2>

                            {fetchingApps ? (
                                <div className="text-center py-8 text-gray-500">Loading applications...</div>
                            ) : myApplications.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <BsBriefcase className="mx-auto text-4xl text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">You haven't applied to any internships yet.</p>
                                    <a href="/internships" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Browse Internships</a>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map(app => (
                                        <div key={app._id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition group bg-white">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{app.internshipId?.title || app.internshipTitle || "Internship Offer"}</h3>
                                                    <p className="text-gray-500 text-sm mb-1">{app.internshipId?.tpoId?.organization || app.companyName || "Organization"}</p>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <span className="text-gray-400">Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className={`px-4 py-2 rounded-full text-sm font-bold capitalize flex items-center gap-2 ${(app.status === 'offer_sent' || app.status === 'accepted') ? 'bg-green-100 text-green-700' :
                                                        (app.status === 'selected' || app.status === 'pending') ? 'bg-yellow-100 text-yellow-700' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {(app.status === 'offer_sent' || app.status === 'accepted') && <BsCheckCircleFill />}
                                                        {(app.status === 'pending' || app.status === 'selected') && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                                                        {app.status === 'offer_sent' ? 'Offer Received' : (app.status === 'selected' ? 'Pending' : app.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar Visual */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                                    <span className={app.status !== 'rejected' ? 'text-blue-600 font-bold' : ''}>Applied</span>
                                                    <span className={(app.status === 'selected' || app.status === 'offer_sent' || app.status === 'accepted') ? 'text-green-600 font-bold' : ''}>Under Review</span>
                                                    <span className={(app.status === 'offer_sent' || app.status === 'accepted') ? 'text-green-600 font-bold' : (app.status === 'rejected' ? 'text-red-500 font-bold' : '')}>
                                                        {(app.status === 'offer_sent' || app.status === 'accepted') ? 'Selected' : (app.status === 'rejected' ? 'Rejected' : 'Decision Pending')}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                                                    <div className={`h-full rounded-full transition-all duration-1000 ${(app.status === 'offer_sent' || app.status === 'accepted') ? 'w-full bg-green-500' :
                                                        app.status === 'rejected' ? 'w-full bg-red-400' :
                                                            'w-1/2 bg-yellow-400'
                                                        }`}></div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    {/* Interview Section */}
                                                    {app.interview?.scheduled && (
                                                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm">
                                                            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                                                <BsCalendarEvent className="text-purple-600" /> Interview Details
                                                            </h4>
                                                            <div className="space-y-1.5 text-purple-800">
                                                                <p className="flex justify-between"><span>Type:</span> <span className="font-semibold">{app.interview.type || 'Interview'}</span></p>
                                                                <p className="flex justify-between"><span>Date:</span> <span className="font-semibold">{new Date(app.interview.date).toLocaleDateString()}</span></p>
                                                                <p className="flex justify-between"><span>Time:</span> <span className="font-semibold">{new Date(app.interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                                                                {app.interview.link && (
                                                                    <a
                                                                        href={app.interview.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
                                                                    >
                                                                        <BsLink45Deg className="text-sm" /> Join Now
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Offer Letter Section */}
                                                    {app.offerLetterUrl && (
                                                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm">
                                                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-1.5">
                                                                <BsCheckCircleFill className="text-green-600 text-xs" /> Offer Letter
                                                            </h4>
                                                            <div className="space-y-2 text-green-800">
                                                                <p className="text-xs">Congratulations! Your official offer letter is ready.</p>
                                                                <a
                                                                    href={`${API_URL.replace('/api', '')}${app.offerLetterUrl}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm"
                                                                    download
                                                                >
                                                                    <BsDownload className="text-sm" /> Download Offer
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rejection Reason Display */}
                                                {app.status === 'rejected' && app.rejectionReason && (
                                                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-800 flex items-start gap-2 mt-4">
                                                        <BsExclamationTriangleFill className="mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="font-bold block text-xs uppercase tracking-wide opacity-70 mb-0.5">Application Update</span>
                                                            <p>{app.rejectionReason}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Host Internship Section */
                        <div className="space-y-8">
                            {/* Host Internship Form */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <BsBriefcase className="text-blue-600" />
                                    {user.role === "tpo" ? "Post Internship Opportunity" : "Host an Internship"}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {user.role === "tpo"
                                        ? "Share internship opportunities from your institution with thousands of students. Your post will appear on the home page for 24 hours."
                                        : "Share your opportunity with thousands of students. Your post will appear on the home page for 24 hours."
                                    }
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="companyName"
                                                required
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                                placeholder="e.g. Acme Corp"
                                            />
                                            <BsBriefcase className="absolute left-3.5 top-3.5 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Verification Section - Status Display Only */}
                                    {verificationResult && (
                                        <div className={`relative z-50 bg-blue-50 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 ${verificationResult.status === 'Verified'
                                            ? 'bg-green-50 border-green-200 text-green-800'
                                            : 'bg-red-50 border-red-200 text-red-800'
                                            }`}>
                                            <div className="flex items-center gap-2 font-bold mb-1">
                                                {verificationResult.status === 'Verified'
                                                    ? <><BsCheckCircleFill className="text-green-600" /> Detected: Legitimate Opportunity</>
                                                    : <><BsExclamationTriangleFill className="text-red-500" /> Detected: Suspicious / Unverified</>
                                                }
                                            </div>
                                            <p className="opacity-90 text-sm">{verificationResult.reason}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Application Link</label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                name="link"
                                                required
                                                value={formData.link}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                                placeholder="https://..."
                                            />
                                            <BsLink45Deg className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
                                        </div>

                                        {/* Verification Status */}
                                        {isVerifying && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                                                <span>Verifying legitimacy...</span>
                                            </div>
                                        )}

                                        {verificationStatus && !isVerifying && (
                                            <div className={`relative z-50 mt-3 p-3 rounded-lg flex items-start gap-2 ${verificationStatus.status === "Verified"
                                                ? "bg-green-50 border border-green-200"
                                                : "bg-yellow-50 border border-yellow-200"
                                                }`}>
                                                {verificationStatus.status === "Verified" ? (
                                                    <>
                                                        <BsShieldCheck className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-green-800 text-sm">Verified</p>
                                                            <p className="text-green-700 text-xs">{verificationStatus.reason}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <BsExclamationTriangle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-red-800 text-sm">Security Alert: Flagged</p>
                                                            <p className="text-red-700 text-xs">{verificationStatus.reason}</p>
                                                            <p className="text-red-600 text-xs mt-1 font-semibold">Posting is disabled for this link.</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={(e) => setImageFile(e.target.files[0])}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <BsImage className="absolute left-3.5 top-3.5 text-gray-400" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || verifying}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {loading ? "Posting..." : "Post Internship"}
                                    </button>
                                </form>
                            </div>

                            {/* Active Ads List */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-800">Your Active Posts</h3>
                                {activeAds.length === 0 ? (
                                    <p className="text-gray-500">No active posts yet.</p>
                                ) : (
                                    activeAds.map(ad => (
                                        <div key={ad._id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <img src={ad.imageUrl} alt={ad.companyName} className="w-10 h-10 rounded-lg object-cover" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{ad.companyName}</h4>
                                                    <p className="text-xs text-gray-500">Posted: {new Date(ad.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setDeleteId(ad._id); }}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                            >
                                                <BsTrash />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Internship"
                message="Are you sure you want to delete this internship post? This action cannot be undone."
            />
        </div >
    );
}
