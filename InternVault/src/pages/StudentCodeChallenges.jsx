import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsRobot, BsClock, BsCode, BsCheckCircle, BsXCircle } from "react-icons/bs";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function StudentCodeChallenges({ user }) {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [mySubmissions, setMySubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, easy, medium, hard

    useEffect(() => {
        if (user) {
            fetchChallenges();
            fetchMySubmissions();
        }
    }, [user]);

    const fetchChallenges = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/code-challenges`);
            setChallenges(response.data);
        } catch (error) {
            console.error("Error fetching challenges:", error);
            toast.error("Failed to load challenges");
        } finally {
            setLoading(false);
        }
    };

    const fetchMySubmissions = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/my-code-submissions`, {
                params: { studentId: user._id }
            });
            setMySubmissions(response.data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const hasSubmitted = (challengeId) => {
        return mySubmissions.some(sub => sub.challengeId === challengeId);
    };

    const getSubmissionStatus = (challengeId) => {
        const submission = mySubmissions.find(sub => sub.challengeId === challengeId);
        return submission?.status || null;
    };

    const filteredChallenges = challenges.filter(challenge => {
        if (filter === "all") return true;
        return challenge.difficulty.toLowerCase() === filter;
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
                    <p className="text-gray-600">Please login to view coding challenges.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading challenges...</p>
                </div>
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
                        Coding Challenges
                    </h1>
                    <p className="text-gray-600">
                        Solve coding problems and showcase your skills. All submissions are analyzed by AI for authenticity.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === "all"
                                ? "bg-purple-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        All Challenges
                    </button>
                    <button
                        onClick={() => setFilter("easy")}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === "easy"
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Easy
                    </button>
                    <button
                        onClick={() => setFilter("medium")}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === "medium"
                                ? "bg-yellow-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Medium
                    </button>
                    <button
                        onClick={() => setFilter("hard")}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === "hard"
                                ? "bg-red-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Hard
                    </button>
                </div>

                {/* Challenges Grid */}
                {filteredChallenges.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <BsRobot className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Challenges Available</h3>
                        <p className="text-gray-600">Check back later for new coding challenges.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChallenges.map((challenge) => {
                            const submitted = hasSubmitted(challenge._id);
                            const status = getSubmissionStatus(challenge._id);
                            const isExpired = new Date(challenge.deadline) < new Date();

                            return (
                                <div
                                    key={challenge._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                                >
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-800 flex-1">
                                                {challenge.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            by {challenge.companyName}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                    challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {challenge.difficulty}
                                            </span>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                {challenge.programmingLanguage}
                                            </span>
                                            {submitted && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status === 'selected' ? 'bg-green-100 text-green-700' :
                                                        status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            status === 'analyzed' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {status === 'selected' && <BsCheckCircle />}
                                                    {status === 'rejected' && <BsXCircle />}
                                                    {status === 'selected' ? 'Selected' :
                                                        status === 'rejected' ? 'Rejected' :
                                                            status === 'analyzed' ? 'Analyzed' :
                                                                'Submitted'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Problem Preview */}
                                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                                        {challenge.problemStatement}
                                    </p>

                                    {/* Stats */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <BsClock />
                                            <span>Time Limit: {challenge.timeLimit} minutes</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BsCode />
                                            <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => navigate(`/code-challenge/${challenge._id}`)}
                                        disabled={isExpired && !submitted}
                                        className={`w-full py-2.5 rounded-xl font-semibold transition ${isExpired && !submitted
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : submitted
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                    >
                                        {isExpired && !submitted
                                            ? 'Expired'
                                            : submitted
                                                ? 'View Submission'
                                                : 'Solve Challenge'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentCodeChallenges;
