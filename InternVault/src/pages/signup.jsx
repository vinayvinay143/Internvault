import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

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

export function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        organization: "",
        yearOfStudy: "",
        avatar: avatars[0]
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post(`${API_URL}/auth/register`, formData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-6 bg-gray-50/50">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Visual/Avatar Selection */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col">
                    <h2 className="text-3xl font-bold mb-2">Join InternVault</h2>
                    <p className="opacity-80 mb-8">Select your avatar to get started.</p>

                    <div className="grid grid-cols-3 gap-3">
                        {avatars.map((avatar, index) => (
                            <div
                                key={index}
                                onClick={() => setFormData({ ...formData, avatar })}
                                className={`bg-white/20 p-2 rounded-xl cursor-pointer transition-all hover:bg-white/30 ${formData.avatar === avatar ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-auto rounded-full bg-white/10" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h3>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+1 234 567 890"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Year of Study</label>
                                <select
                                    name="yearOfStudy"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
                                    value={formData.yearOfStudy}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Organization / College</label>
                            <input
                                type="text"
                                name="organization"
                                placeholder="University Name"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                value={formData.organization}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="Create a password"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
