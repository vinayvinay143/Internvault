import { useState, useEffect } from "react";
import axios from "axios";
import { BsPersonCircle, BsBriefcase, BsLink45Deg, BsImage, BsPencil, BsCheck, BsX, BsTrash } from "react-icons/bs";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";

const API_URL = "http://localhost:5000/api";

const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Callie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Dante",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliza",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Flo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Granny",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Happy",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack"
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
    const [deleteId, setDeleteId] = useState(null);

    // Profile editing state
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({
        username: "",
        phone: "",
        organization: "",
        yearOfStudy: "",
        avatar: "",
        whatsappNotifications: true
    });
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        if (user?._id) {
            fetchUserAds();
            // Initialize edit data with current user data
            setEditData({
                username: user.username || "",
                phone: user.phone || "",
                organization: user.organization || "",
                yearOfStudy: user.yearOfStudy || "",
                avatar: user.avatar || avatars[0],
                whatsappNotifications: user.whatsappNotifications !== undefined ? user.whatsappNotifications : true
            });
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

        try {
            const data = new FormData();
            data.append('userId', user._id);
            data.append('companyName', formData.companyName);
            data.append('link', formData.link);
            if (imageFile) {
                data.append('image', imageFile);
            }

            await axios.post(`${API_URL}/ads/add`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Internship posted successfully!");
            setFormData({ companyName: "", link: "", imageUrl: "" });
            setImageFile(null);
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
            const response = await axios.put(`${API_URL}/user/${user._id}`, editData);

            // Update user in state and localStorage
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!");
            setIsEditMode(false);
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
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
                                    {user.yearOfStudy && (
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

                {/* Right Column: Post Ad & History */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Host Internship Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BsBriefcase className="text-blue-600" />
                            Host an Internship
                        </h2>
                        <p className="text-gray-600 mb-6">Share your opportunity with thousands of students. Your post will appear on the home page for 24 hours.</p>



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
                                    <div key={ad._id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 group hover:border-gray-300 transition">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                                            {ad.imageUrl ? <img src={ad.imageUrl} alt="logo" className="w-full h-full object-cover" /> : <BsBriefcase className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-800">{ad.companyName}</h4>
                                            <p className="text-xs text-gray-500">Expires: {new Date(ad.expiresAt).toLocaleString()}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex-shrink-0">Active</span>
                                        <button
                                            onClick={() => setDeleteId(ad._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                            title="Delete internship"
                                        >
                                            <BsTrash size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Internship"
                message="Are you sure you want to delete this internship post? This action cannot be undone."
                confirmText="Delete"
                isDangerous={true}
            />
        </div>
    );
}
