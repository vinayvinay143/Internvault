import { useState, useEffect } from "react";
import axios from "axios";
import { BsPersonCircle, BsBriefcase, BsLink45Deg, BsImage } from "react-icons/bs";

const API_URL = "http://localhost:5000/api";

export function Dashboard({ user, setUser }) {
    const [activeAds, setActiveAds] = useState([]);
    const [formData, setFormData] = useState({
        companyName: "",
        link: "",
        imageUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user?._id) {
            fetchUserAds();
        }
    }, [user]);

    const fetchUserAds = async () => {
        try {
            const response = await axios.get(`${API_URL}/ads/user/${user._id}`);
            setActiveAds(response.data);
        } catch (error) {
            console.error("Error fetching user ads:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await axios.post(`${API_URL}/ads/add`, {
                userId: user._id,
                ...formData
            });
            setMessage("Internship posted successfully! It will be live for 24 hours.");
            setFormData({ companyName: "", link: "", imageUrl: "" });
            fetchUserAds();
        } catch (error) {
            console.error("Error posting ad:", error);
            setMessage("Failed to post internship. Please try again.");
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: User Profile */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl mx-auto mb-6">
                            <BsPersonCircle />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.fullName || "User"}</h2>
                        <p className="text-gray-500 mb-6">{user.email}</p>
                        <div className="border-t border-gray-100 pt-6 text-left">
                            <h3 className="font-semibold text-gray-700 mb-3 block">My Stats</h3>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Active Posts</span>
                                <span className="font-bold text-gray-900">{activeAds.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Post Ad & History */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Host Internship Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BsBriefcase className="text-blue-600" />
                            Host an Internship
                        </h2>
                        <p className="text-gray-600 mb-6">Share your opportunity with thousands of students. Your post will appear on the home page for 24 hours.</p>

                        {message && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                {message}
                            </div>
                        )}

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
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo/Image URL</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <BsImage className="absolute left-3.5 top-3.5 text-gray-400" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                            >
                                {loading ? "Posting..." : "Post Internship"}
                            </button>
                        </form>
                    </div>

                    {/* Active Ads List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Active Posts</h3>
                        {activeAds.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No active posts yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {activeAds.map(ad => (
                                    <div key={ad._id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                                            {ad.imageUrl ? <img src={ad.imageUrl} alt="logo" className="w-full h-full object-cover" /> : <BsBriefcase className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{ad.companyName}</h4>
                                            <p className="text-xs text-gray-500">Expires: {new Date(ad.expiresAt).toLocaleString()}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
