
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
        avatar: avatars[0],
        whatsappNotifications: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            // Only allow numbers and max 10 digits
            const formattedValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const { username, email, password, phone } = formData;

        // Email Validation

        // 1. One @ symbol
        if ((email.match(/@/g) || []).length !== 1) {
            return "Email must contain exactly one '@' symbol.";
        }

        // 6. No spaces
        if (/\s/.test(email)) {
            return "Email must not contain spaces.";
        }

        // 9. Consecutive dots or special chars (dots)
        if (/\.\./.test(email)) {
            return "Email must not contain consecutive dots.";
        }

        // Regex for overall structure:
        // ^[a-zA-Z0-9]        -> Must start with alphanumeric
        // (?:[._-][a-zA-Z0-9]+)* -> Allow dots/hyphens/underscores but not at start, and must be followed by alphanumeric (handles consecutive specials implicitly if we want, or at least ensures no special at end of local part)
        // Actually user said "Avoid consecutive dots or special characters".
        // Let's use a standard strict regex and then explicit checks if needed.

        // Rules implemented in regex:
        // - Start adjacent to @ must be alphanumeric? No, typically just not dot.
        // User rule: "Should not start or end with special characters" (implied for local part and domain part edges)

        // Local part:
        const [localPart, domainPart] = email.split('@');

        // 2 & 3. content before and after @
        if (!localPart || !domainPart) {
            return "Email must have characters before and after '@'.";
        }

        // 8. Should not start or end with special characters
        // Check local part start/end
        if (/^[^a-zA-Z0-9]/.test(localPart) || /[^a-zA-Z0-9]$/.test(localPart)) {
            return "Username part of email must not start or end with special characters.";
        }
        // Check domain part start
        if (/^[^a-zA-Z0-9]/.test(domainPart)) {
            return "Domain part of email must not start with special characters.";
        }

        // 5. Allowed chars: letters, numbers, dots (and hyphen/underscore implicitly for emails usually, but user mentioned dots specifically. Standard email allows - _)
        // Regex to validate characters allowed
        if (/[^a-zA-Z0-9._@-]/.test(email)) {
            return "Email contains invalid characters.";
        }

        // 4. Domain valid extension
        if (!domainPart.includes('.')) {
            return "Domain must include a valid extension.";
        }
        const lastDotIndex = domainPart.lastIndexOf('.');
        if (lastDotIndex === domainPart.length - 1) { // Ends with dot
            return "Email must not end with a special character (dot).";
        }
        const extension = domainPart.substring(lastDotIndex + 1);
        if (extension.length < 2) {
            return "Invalid domain extension.";
        }

        // 9. Avoid consecutive special chars (._-)
        if (/[\.\_\-]{2,}/.test(email)) {
            return "Email must not contain consecutive special characters.";
        }

        // Phone Validation
        const phoneRegex = /^\d{10}$/;
        if (!phone.match(phoneRegex)) {
            return "Phone number must be exactly 10 digits.";
        }

        // Password Validation
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (/\s/.test(password)) {
            return "Password must not contain spaces.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[@$!%*?&]/.test(password)) {
            return "Password must contain at least one special character (@$!%*?&).";
        }
        if (password === username || password === email) {
            return "Password must not be the same as the username or email.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const submissionData = {
                ...formData,
                phone: `91${formData.phone}`
            };
            await axios.post(`${API_URL}/auth/register`, submissionData);
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
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-500 font-medium">+91</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="9876543210"
                                        className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Enter your 10-digit mobile number</p>
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

                        {/* WhatsApp Notifications Opt-in */}
                        {formData.phone && (
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <input
                                    type="checkbox"
                                    id="whatsappNotifications"
                                    name="whatsappNotifications"
                                    checked={formData.whatsappNotifications}
                                    onChange={(e) => setFormData({ ...formData, whatsappNotifications: e.target.checked })}
                                    className="mt-1 w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="whatsappNotifications" className="text-sm text-gray-700 cursor-pointer">
                                    <span className="font-semibold">Get WhatsApp notifications 📱</span>
                                </label>
                            </div>
                        )}

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
