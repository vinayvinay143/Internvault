import { useState, useEffect } from "react";
import axios from "axios";
import { BsBriefcase, BsCalendar, BsCurrencyRupee, BsPeople, BsCheckCircle, BsXCircle, BsEye, BsTrash, BsToggleOn, BsToggleOff } from "react-icons/bs";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const commonSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", "MongoDB",
    "SQL", "Git", "HTML/CSS", "TypeScript", "Express.js", "Django", "Flask",
    "Spring Boot", "AWS", "Docker", "Kubernetes", "Machine Learning", "Data Analysis"
];

const commonResearchTopics = [
    "Artificial Intelligence", "Blockchain", "Cybersecurity", "Data Science",
    "IoT", "Cloud Computing", "Quantum Computing", "Bioinformatics",
    "Robotics", "Renewable Energy", "Smart Cities", "VLSI Design"
];

export function TPOInternships({ user }) {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [researchTopicInput, setResearchTopicInput] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        locationType: "On-site",
        duration: "1 month",
        startDate: "",
        stipend: 10000,
        seats: 10,
        requiredSkills: [],
        programType: "BTech",
        researchTopics: [],
        eligibility: {
            yearOfStudy: [],
            minCGPA: 0
        },
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
        if (user?.role === "tpo") {
            fetchInternships();
        }
    }, [user]);

    const fetchInternships = async () => {
        try {
            const response = await axios.get(`${API_URL}/tpo/internships`, {
                params: { tpoId: user._id }
            });
            setInternships(response.data);
        } catch (error) {
            console.error("Error fetching internships:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }));
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleAddResearchTopic = () => {
        if (researchTopicInput.trim() && !formData.researchTopics.includes(researchTopicInput.trim())) {
            setFormData(prev => ({
                ...prev,
                researchTopics: [...prev.researchTopics, researchTopicInput.trim()]
            }));
            setResearchTopicInput("");
        }
    };

    const handleRemoveResearchTopic = (topicToRemove) => {
        setFormData(prev => ({
            ...prev,
            researchTopics: prev.researchTopics.filter(topic => topic !== topicToRemove)
        }));
    };

    const handleResearchTopicKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddResearchTopic();
        }
    };

    const handleYearToggle = (year) => {
        setFormData(prev => ({
            ...prev,
            eligibility: {
                ...prev.eligibility,
                yearOfStudy: prev.eligibility.yearOfStudy.includes(year)
                    ? prev.eligibility.yearOfStudy.filter(y => y !== year)
                    : [...prev.eligibility.yearOfStudy, year]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/tpo/internships`, {
                ...formData,
                tpoId: user._id
            });

            toast.success("Internship posted successfully! 🎉");

            // Reset form
            setFormData({
                title: "",
                description: "",
                locationType: "On-site",
                duration: "1 month",
                startDate: "",
                stipend: 10000,
                seats: 10,
                requiredSkills: [],
                programType: "BTech",
                researchTopics: [],
                eligibility: {
                    yearOfStudy: [],
                    minCGPA: 0
                },
                applicationDeadline: ""
            });
            setSkillInput("");
            setResearchTopicInput("");

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
            await axios.put(`${API_URL}/tpo/internships/${id}`, { status: newStatus });
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
            message: "Are you sure you want to delete this internship? This action cannot be undone.",
            isDangerous: true,
            onConfirm: () => handleDelete(id)
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/tpo/internships/${id}`);
            setInternships(prev => prev.filter(i => i._id !== id));
            toast.success("Internship deleted successfully");
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete internship");
        }
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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">TPO Internship Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Post Internship Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BsBriefcase className="text-blue-600" />
                                Post New Internship
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Program Type Toggle */}
                                <div className="p-1 bg-gray-100 rounded-xl flex gap-1 w-fit mb-6">
                                    {["BTech", "MTech"].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                programType: type,
                                                // Clear invalid years when switching
                                                eligibility: {
                                                    ...formData.eligibility,
                                                    yearOfStudy: []
                                                }
                                            })}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${formData.programType === type
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {type} Program
                                        </button>
                                    ))}
                                </div>
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
                                        Description * (Max 300 characters)
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        maxLength={300}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                                        placeholder="Brief description of the internship..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/300</p>
                                </div>

                                {/* Duration & Start Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Duration *
                                        </label>
                                        <select
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                                        >
                                            <option value="1 week">1 Week</option>
                                            <option value="2 weeks">2 Weeks</option>
                                            <option value="1 month">1 Month</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            required
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Location Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Location Type *
                                    </label>
                                    <div className="flex gap-6">
                                        {["On-site", "Remote", "Hybrid"].map(type => (
                                            <label key={type} className={`flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg transition ${formData.locationType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="locationType"
                                                    value={type}
                                                    checked={formData.locationType === type}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 accent-blue-600"
                                                />
                                                <span className="text-sm font-medium">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Stipend Slider */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Stipend (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="stipend"
                                        required
                                        min="0"
                                        value={formData.stipend}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        placeholder="Enter stipend amount"
                                    />
                                </div>

                                {/* Seats */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Available Seats *
                                    </label>
                                    <input
                                        type="number"
                                        name="seats"
                                        required
                                        min="1"
                                        max="100"
                                        value={formData.seats}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                    />
                                </div>

                                {/* Required Skills */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Required Skills
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {formData.requiredSkills.map((skill, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:text-blue-900 focus:outline-none"
                                                >
                                                    <BsXCircle size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                            placeholder="Type a skill and press Enter (e.g. Java)"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 font-semibold text-sm hover:text-blue-800"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Press Enter to add tags</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="text-xs font-semibold text-gray-400 w-full mb-1">Common Skills:</span>
                                        {commonSkills.slice(0, 10).map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => {
                                                    if (!formData.requiredSkills.includes(skill)) {
                                                        setFormData(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, skill] }));
                                                    }
                                                }}
                                                className={`text-[10px] px-2 py-1 rounded border transition ${formData.requiredSkills.includes(skill) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                                            >
                                                + {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Research Topics (Only for MTech) */}
                                {formData.programType === "MTech" && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Research Topics *
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.researchTopics.map((topic, index) => (
                                                <span key={index} className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                                    {topic}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveResearchTopic(topic)}
                                                        className="hover:text-purple-900 focus:outline-none"
                                                    >
                                                        <BsXCircle size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={researchTopicInput}
                                                onChange={(e) => setResearchTopicInput(e.target.value)}
                                                onKeyDown={handleResearchTopicKeyDown}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                                placeholder="Type a research field and press Enter (e.g. AI/ML)"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddResearchTopic}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 font-semibold text-sm hover:text-purple-800"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Students can select these research fields</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="text-xs font-semibold text-gray-400 w-full mb-1">Common Research Fields:</span>
                                            {commonResearchTopics.map(topic => (
                                                <button
                                                    key={topic}
                                                    type="button"
                                                    onClick={() => {
                                                        if (!formData.researchTopics.includes(topic)) {
                                                            setFormData(prev => ({ ...prev, researchTopics: [...prev.researchTopics, topic] }));
                                                        }
                                                    }}
                                                    className={`text-[10px] px-2 py-1 rounded border transition ${formData.researchTopics.includes(topic) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}
                                                >
                                                    + {topic}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Eligibility */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-700">Eligibility Criteria</h3>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Year of Study</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(formData.programType === "MTech" ? ["1", "2", "Other"] : ["1", "2", "3", "4", "Other"]).map(year => (
                                                <button
                                                    key={year}
                                                    type="button"
                                                    onClick={() => handleYearToggle(year)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.eligibility.yearOfStudy.includes(year)
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {year === "Other" ? "Other" : `${year}${year === "1" ? "st" : year === "2" ? "nd" : year === "3" ? "rd" : "th"} Year`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">
                                            Minimum CGPA
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            value={formData.eligibility.minCGPA}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                eligibility: { ...prev.eligibility, minCGPA: parseFloat(e.target.value) }
                                            }))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                            placeholder="0.0 - 10.0"
                                        />
                                    </div>
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
                                            onClick={() => navigate(`/tpo/applicants/${internship._id}`)}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-gray-800">{internship.title}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${internship.programType === "MTech" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                                    {internship.programType || "BTech"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <BsPeople /> {internship.applicationsCount || 0}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <BsCurrencyRupee /> {Math.floor(internship.stipend / 1000)}k
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-orange-600 font-semibold">
                                                    {(() => {
                                                        const days = Math.ceil((new Date(internship.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
                                                        return days > 0 ? `${days} days left` : "Expires today";
                                                    })()}
                                                </span>
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
                                                            navigate(`/tpo/applicants/${internship._id}`);
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
            </div >

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                isDangerous={modalConfig.isDangerous}
                confirmText="Delete Internship"
            />
        </div>
    );
}
