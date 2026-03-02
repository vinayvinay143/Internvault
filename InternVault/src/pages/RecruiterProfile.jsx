import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsBuilding, BsGlobe, BsGraphUp, BsPeopleFill, BsPerson, BsTelephone, BsSave } from "react-icons/bs";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function RecruiterProfile({ user, setUser }) {
    const [formData, setFormData] = useState({
        username: "",
        phone: "",
        companyName: "",
        companyWebsite: "",
        industry: "",
        companySize: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                phone: user.phone || "",
                companyName: user.companyName || "",
                companyWebsite: user.companyWebsite || "",
                industry: user.industry || "",
                companySize: user.companySize || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`${API_URL}/auth/user/${user._id}`, formData);

            // Update local storage and app state
            const updatedUser = { ...user, ...response.data };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // If setUser is passed from App.jsx, update global state
            if (setUser) {
                setUser(updatedUser);
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
                    <p className="text-gray-600">Personalize your registered company data.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Details Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BsBuilding className="text-blue-600" /> Company Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Website</label>
                                    <div className="relative">
                                        <BsGlobe className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="url"
                                            name="companyWebsite"
                                            placeholder="https://example.com"
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            value={formData.companyWebsite}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Industry</label>
                                    <div className="relative">
                                        <BsGraphUp className="absolute left-3 top-3 text-gray-400" />
                                        <select
                                            name="industry"
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
                                            value={formData.industry}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Industry</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="E-commerce">E-commerce</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Consulting">Consulting</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Company Size</label>
                                    <div className="relative">
                                        <BsPeopleFill className="absolute left-3 top-3 text-gray-400" />
                                        <select
                                            name="companySize"
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Size</option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201-500">201-500 employees</option>
                                            <option value="501-1000">501-1000 employees</option>
                                            <option value="1000+">1000+ employees</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6"></div>

                        {/* Personal Contact Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BsPerson className="text-blue-600" /> Recruiter Contact
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <div className="relative">
                                        <BsTelephone className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
                            >
                                {loading ? "Updating..." : <><BsSave /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
