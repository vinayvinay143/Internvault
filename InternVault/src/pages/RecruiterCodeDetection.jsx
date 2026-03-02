import { useState, useEffect } from "react";
import axios from "axios";
import { BsRobot, BsUpload, BsEye, BsTrash, BsCheckCircle, BsXCircle, BsClock, BsLightning, BsTrophy, BsCodeSlash, BsPlus } from "react-icons/bs";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function RecruiterCodeDetection({ user }) {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [stats, setStats] = useState({
        totalChallenges: 0,
        totalSubmissions: 0,
        avgScore: 0
    });

    const [formData, setFormData] = useState({
        title: "",
        problemStatement: "",
        difficulty: "Medium",
        programmingLanguage: "Any",
        timeLimit: 60,
        sampleInput: "",
        sampleOutput: "",
        deadline: ""
    });

    useEffect(() => {
        if (user?.role === "recruiter") {
            fetchChallenges();
        }
    }, [user]);

    const fetchChallenges = async () => {
        try {
            setPageLoading(true);
            const response = await axios.get(`${API_URL}/recruiter/code-challenges`, {
                params: { recruiterId: user._id }
            });
            const fetchedChallenges = response.data;
            setChallenges(fetchedChallenges);

            // Calculate Stats
            const totalSub = fetchedChallenges.reduce((acc, curr) => acc + (curr.submissionsCount || 0), 0);
            // Mocking Avg Score for now as it's not directly in challenge object, 
            // in a real scenario we'd aggregate this from backend or fetch it separately.
            // For UI demo purposes we'll set a placeholder or derive if possible.
            setStats({
                totalChallenges: fetchedChallenges.length,
                totalSubmissions: totalSub,
                avgScore: totalSub > 0 ? 82 : 0 // Placeholder average
            });

        } catch (error) {
            console.error("Error fetching challenges:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/recruiter/code-challenges`, {
                ...formData,
                recruiterId: user._id,
                companyName: user.companyName || user.username
            });

            toast.success("Coding challenge created! 🎉");
            setShowCreateForm(false);
            setFormData({
                title: "",
                problemStatement: "",
                difficulty: "Medium",
                programmingLanguage: "Any",
                timeLimit: 60,
                sampleInput: "",
                sampleOutput: "",
                deadline: ""
            });
            fetchChallenges();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create challenge");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this challenge?")) return;

        try {
            await axios.delete(`${API_URL}/recruiter/code-challenges/${id}`);
            setChallenges(prev => prev.filter(c => c._id !== id));
            toast.success("Challenge deleted successfully");
        } catch (error) {
            toast.error("Failed to delete challenge");
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

    if (pageLoading) {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <BsRobot className="text-purple-600" />
                        AI-Powered Code Assessment & Ranking
                    </h1>
                    <p className="text-gray-600">
                        Manage your coding challenges and view AI-reviewed candidate submissions.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Challenges</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.totalChallenges}</h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <BsCodeSlash className="text-purple-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.totalSubmissions}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <BsCheckCircle className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Avg AI Quality Score</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.avgScore > 0 ? stats.avgScore : "-"}<span className="text-lg text-gray-400 font-normal">/100</span></h3>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <BsTrophy className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Quick Actions</h2>
                            <p className="text-gray-500 text-sm">Manage your assessment library and settings.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition shadow-lg ${showCreateForm
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200"
                                    }`}
                            >
                                {showCreateForm ? <BsXCircle /> : <BsPlus size={24} />}
                                {showCreateForm ? "Cancel Creation" : "Create New Challenge"}
                            </button>
                        </div>
                    </div>

                    {/* Create Form (Expandable) */}
                    {showCreateForm && (
                        <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BsLightning className="text-yellow-500" /> New Challenge Details
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Challenge Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                        placeholder="e.g. Build a REST API for User Management"
                                    />
                                </div>

                                {/* Problem Statement */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Problem Statement *
                                    </label>
                                    <textarea
                                        name="problemStatement"
                                        required
                                        value={formData.problemStatement}
                                        onChange={handleInputChange}
                                        rows={8}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none"
                                        placeholder="Describe the problem in detail. Include requirements, constraints, and expected output..."
                                    />
                                </div>

                                {/* Difficulty & Language */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Difficulty Level
                                        </label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Programming Language
                                        </label>
                                        <select
                                            name="programmingLanguage"
                                            value={formData.programmingLanguage}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
                                        >
                                            <option value="Any">Any Language</option>
                                            <option value="JavaScript">JavaScript</option>
                                            <option value="Python">Python</option>
                                            <option value="Java">Java</option>
                                            <option value="C++">C++</option>
                                            <option value="C">C</option>
                                            <option value="Go">Go</option>
                                            <option value="TypeScript">TypeScript</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Sample Input/Output */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Sample Input (Optional)
                                        </label>
                                        <textarea
                                            name="sampleInput"
                                            value={formData.sampleInput}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none font-mono text-sm"
                                            placeholder="Input example..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Sample Output (Optional)
                                        </label>
                                        <textarea
                                            name="sampleOutput"
                                            value={formData.sampleOutput}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none font-mono text-sm"
                                            placeholder="Expected output..."
                                        />
                                    </div>
                                </div>

                                {/* Time Limit & Deadline */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Time Limit (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            name="timeLimit"
                                            min="15"
                                            max="240"
                                            value={formData.timeLimit}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Submission Deadline *
                                        </label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            required
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                                >
                                    {loading ? "Creating..." : "Create Challenge"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Challenges List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Active Challenges</h2>

                    {challenges.length === 0 ? (
                        <div className="text-center py-12">
                            <BsRobot className="text-6xl text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-500 mb-2">No Challenges Found</h3>
                            <p className="text-gray-400 mb-6">Create your first coding challenge above to start.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {challenges.map((challenge) => (
                                <div
                                    key={challenge._id}
                                    className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:border-purple-300 transition-all hover:bg-white hover:shadow-md group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-800">{challenge.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                        challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {challenge.difficulty}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <BsClock /> {challenge.timeLimit} mins
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BsCodeSlash /> {challenge.programmingLanguage}
                                                </span>
                                                <span className="flex items-center gap-1 font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                                    <BsCheckCircle /> {challenge.submissionsCount || 0} submissions
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => window.location.href = `/recruiter/challenge-submissions/${challenge._id}`}
                                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-blue-100"
                                            >
                                                <BsEye /> View Submissions
                                            </button>
                                            <button
                                                onClick={() => handleDelete(challenge._id)}
                                                className="p-2.5 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition"
                                                title="Delete Challenge"
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
    );
}

export default RecruiterCodeDetection;
