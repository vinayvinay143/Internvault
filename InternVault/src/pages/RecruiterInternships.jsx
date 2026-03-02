import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsBriefcase, BsPlus, BsEye, BsTrash, BsPeople, BsCodeSlash, BsToggleOn, BsToggleOff } from "react-icons/bs";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const commonSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", "MongoDB",
    "SQL", "Git", "HTML/CSS", "TypeScript", "Express.js", "Django", "Flask",
    "Spring Boot", "AWS", "Docker", "Kubernetes", "Machine Learning", "Data Analysis"
];

export function RecruiterInternships({ user }) {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        locationType: "On-site",
        duration: "3 months",
        stipend: 15000,
        requiredSkills: [],
        requiresCodeSubmission: false,
        codeSubmissionPrompt: "",
        programmingLanguage: "Any",
        applicationDeadline: ""
    });

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        isDangerous: false
    });

    useEffect(() => {
        if (user?.role === "recruiter") {
            fetchInternships();
        }
    }, [user]);

    const fetchInternships = async () => {
        try {
            const response = await axios.get(`${API_URL}/recruiter/internships`, {
                params: { recruiterId: user._id }
            });
            setInternships(response.data);
        } catch (error) {
            console.error("Error fetching internships:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSkillToggle = (skill) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.includes(skill)
                ? prev.requiredSkills.filter(s => s !== skill)
                : [...prev.requiredSkills, skill]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/recruiter/internships`, {
                ...formData,
                recruiterId: user._id,
                companyName: user.companyName || user.username
            });

            toast.success("Internship posted successfully! 🎉");

            // Reset form
            setFormData({
                title: "",
                description: "",
                location: "",
                locationType: "On-site",
                duration: "3 months",
                stipend: 15000,
                requiredSkills: [],
                requiresCodeSubmission: false,
                codeSubmissionPrompt: "",
                programmingLanguage: "Any",
                applicationDeadline: ""
            });

            fetchInternships();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to post internship");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (e, id, currentStatus) => {
        e.stopPropagation();
        const newStatus = currentStatus === "active" ? "closed" : "active";
        try {
            await axios.put(`${API_URL}/recruiter/internships/${id}`, { status: newStatus });
            setInternships(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
            toast.success(`Internship ${newStatus === "active" ? "activated" : "closed"}`);
        } catch (error) {
            console.error("Status update failed:", error);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setModalConfig({
            isOpen: true,
            title: "Delete Internship",
            message: "Are you sure you want to delete this internship? This action cannot be undone and will remove all associated applications.",
            isDangerous: true,
            onConfirm: () => handleDelete(id)
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/recruiter/internships/${id}`);
            setInternships(prev => prev.filter(i => i._id !== id));
            toast.success("Internship deleted successfully");
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete internship");
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Internship Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Post Internship Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BsBriefcase className="text-blue-600" />
                                Post New Internship
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Internship Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        placeholder="e.g. Full Stack Development Intern"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        maxLength={1000}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                                        placeholder="Describe the internship role and responsibilities..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000</p>
                                </div>

                                {/* Location & Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                            placeholder="e.g. Mumbai, India"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location Type *
                                        </label>
                                        <select
                                            name="locationType"
                                            value={formData.locationType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                                        >
                                            <option value="On-site">On-site</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Duration & Stipend */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Duration *
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            required
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                            placeholder="e.g. 3 months"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Stipend: ₹{formData.stipend.toLocaleString()}
                                        </label>
                                        <input
                                            type="range"
                                            name="stipend"
                                            min="0"
                                            max="100000"
                                            step="5000"
                                            value={formData.stipend}
                                            onChange={handleInputChange}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>₹0</span>
                                            <span>₹1,00,000</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Required Skills */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Required Skills (Select multiple)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {commonSkills.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => handleSkillToggle(skill)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.requiredSkills.includes(skill)
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                {/* Code Submission Settings */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BsCodeSlash className="text-blue-600 text-xl" />
                                        <h3 className="font-bold text-gray-800">Code Submission Challenge</h3>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="requiresCodeSubmission"
                                                checked={formData.requiresCodeSubmission}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">Require Code Submission</span>
                                        </label>
                                    </div>

                                    {formData.requiresCodeSubmission && (
                                        <div className="space-y-4 animate-fade-in-up">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Programming Language Preference
                                                </label>
                                                <select
                                                    name="programmingLanguage"
                                                    value={formData.programmingLanguage}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none bg-white"
                                                >
                                                    <option value="Any">Any Language</option>
                                                    <option value="JavaScript">JavaScript</option>
                                                    <option value="Python">Python</option>
                                                    <option value="Java">Java</option>
                                                    <option value="C++">C++</option>
                                                    <option value="Go">Go</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Challenge Problem Statement *
                                                </label>
                                                <textarea
                                                    name="codeSubmissionPrompt"
                                                    required={formData.requiresCodeSubmission}
                                                    value={formData.codeSubmissionPrompt}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none resize-none"
                                                    placeholder="e.g. Write a function to check if a string is a palindrome..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Application Deadline */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Application Deadline *
                                    </label>
                                    <input
                                        type="date"
                                        name="applicationDeadline"
                                        required
                                        value={formData.applicationDeadline}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                                >
                                    {loading ? "Posting..." : "Post Internship"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Posted Internships */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Internships</h3>

                            {internships.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 text-sm">No internships posted yet.</p>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {internships.map(internship => (
                                        <div
                                            key={internship._id}
                                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 transition cursor-pointer"
                                            onClick={() => navigate(`/recruiter/applicants/${internship._id}`)}
                                        >
                                            <h4 className="font-bold text-gray-800 mb-1">{internship.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <BsPeople /> {internship.applicationsCount || 0}
                                                </span>
                                                {internship.requiresCodeSubmission && (
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                                                        🤖
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${internship.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {internship.status}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className={`text-xs font-semibold px-2 py-1 rounded-full transition flex items-center gap-1 ${internship.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                                                        onClick={(e) => handleStatusToggle(e, internship._id, internship.status)}
                                                        title={internship.status === "active" ? "Close Internship" : "Activate Internship"}
                                                    >
                                                        {internship.status === "active" ? <BsToggleOn size={16} /> : <BsToggleOff size={16} />}
                                                        {internship.status === "active" ? "Active" : "Closed"}
                                                    </button>
                                                    <button
                                                        className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1 ml-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/recruiter/applicants/${internship._id}`);
                                                        }}
                                                    >
                                                        <BsEye /> View
                                                    </button>
                                                    <button
                                                        className="text-red-500 text-xs font-semibold hover:text-red-700 flex items-center gap-1"
                                                        onClick={(e) => handleDeleteClick(e, internship._id)}
                                                    >
                                                        <BsTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                isDangerous={modalConfig.isDangerous}
                confirmText="Delete Internship"
            />
        </div >

    );
}

export default RecruiterInternships;
