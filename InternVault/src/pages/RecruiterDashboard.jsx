import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsBriefcase, BsPeople, BsCheckCircle, BsPlus, BsBuilding, BsGlobe, BsGraphUp, BsPeopleFill } from "react-icons/bs";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function RecruiterDashboard({ user }) {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [stats, setStats] = useState({
        totalInternships: 0,
        totalApplicants: 0,
        aiDetected: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === "recruiter") {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/recruiter/internships`, {
                params: { recruiterId: user._id }
            });

            setInternships(response.data);

            // Calculate stats
            const totalApplicants = response.data.reduce((sum, int) => sum + (int.applicationsCount || 0), 0);
            setStats({
                totalInternships: response.data.length,
                totalApplicants,
                aiDetected: 0 // Will be calculated from applications
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user.companyName || user.username}!</p>
                </div>

                {/* Company Profile Card */}
                {user.companyName && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <BsBuilding /> {user.companyName}
                                    </div>
                                    <button
                                        onClick={() => navigate("/recruiter/profile")}
                                        className="text-sm bg-blue-500/20 hover:bg-blue-500/30 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
                                        title="Edit Company Profile"
                                    >
                                        <span className="text-xs">Edit</span>
                                    </button>
                                </h2>
                                <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                                    {user.companyWebsite && (
                                        <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition">
                                            <BsGlobe /> {user.companyWebsite.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                    {user.industry && (
                                        <span className="flex items-center gap-1">
                                            <BsGraphUp /> {user.industry}
                                        </span>
                                    )}
                                    {user.companySize && (
                                        <span className="flex items-center gap-1">
                                            <BsPeopleFill /> {user.companySize} employees
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/recruiter/internships")}
                                className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                <BsPlus size={24} /> Host a New Internship
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Internships</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.totalInternships}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <BsBriefcase className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.totalApplicants}</h3>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <BsPeople className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">AI-Generated Code</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.aiDetected}</h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 text-xl">🤖</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/recruiter/internships")}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-200"
                        >
                            <BsPlus size={24} />
                            Host an Internship
                        </button>
                        <button
                            onClick={() => navigate("/recruiter/internships")}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
                        >
                            <BsBriefcase />
                            View All Internships
                        </button>
                    </div>
                </div>

                {/* Recent Internships */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Internships</h2>

                    {internships.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No internships posted yet.</p>
                            <button
                                onClick={() => navigate("/recruiter/internships")}
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-semibold"
                            >
                                Post Your First Internship
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {internships.slice(0, 5).map((internship) => (
                                <div
                                    key={internship._id}
                                    onClick={() => navigate(`/recruiter/applicants/${internship._id}`)}
                                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 transition cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 mb-1">{internship.title}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{internship.location} • {internship.locationType}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <BsPeople /> {internship.applicationsCount || 0} applicants
                                                </span>
                                                {internship.requiresCodeSubmission && (
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                                                        🤖 Code Required
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${internship.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {internship.status}
                                            </span>
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

export default RecruiterDashboard;
