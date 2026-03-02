
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsGithub, BsLinkedin, BsGlobe, BsLink45Deg } from "react-icons/bs";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Callie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Dante",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliza"
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
        whatsappNotifications: true,
        role: "student",
        companyName: "",
        companyWebsite: "",
        industry: "",
        companySize: "",
        resume: "",
        linkedin: "",
        github: "",
        website: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else if (name === "phone") {
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
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'phone') {
                    data.append(key, `91${formData.phone}`);
                } else if (key === 'resume') {
                    // Only append if it's a file (or string if we kept logic for link fallback, but now it's file)
                    if (formData.resume) data.append(key, formData.resume);
                } else {
                    data.append(key, formData[key]);
                }
            });

            await axios.post(`${API_URL}/auth/register`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center p-6 pt-28 bg-gray-50/50">

            {/* ✅ Success Toast Popup */}
            {success && (
                <div style={{
                    position: "fixed",
                    top: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    animation: "slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }}>
                    <style>{`
                        @keyframes slideDown {
                            0%   { opacity: 0; transform: translateX(-50%) translateY(-60px); }
                            100% { opacity: 1; transform: translateX(-50%) translateY(0px); }
                        }
                    `}</style>
                    <div style={{
                        background: "linear-gradient(135deg, #16a34a, #15803d)",
                        color: "white",
                        padding: "14px 28px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(22, 163, 74, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "15px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        minWidth: "320px",
                        justifyContent: "center",
                    }}>
                        <span style={{ fontSize: "22px" }}>✅</span>
                        <div>
                            <div>Account Created Successfully!</div>
                            <div style={{ fontSize: "12px", fontWeight: "400", opacity: 0.85 }}>Redirecting to login...</div>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Visual/Avatar Selection */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col">
                    <h2 className="text-3xl font-bold mb-2">Join <span className="font-brand">InternVault</span></h2>
                    <p className="opacity-80 mb-6">Select your role to get started.</p>

                    {/* Role Selection */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold mb-3 uppercase tracking-wide">I am a:</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "student" })}
                                className={`py-3 px-2 rounded-xl font-semibold transition-all text-sm ${formData.role === "student"
                                    ? "bg-white text-blue-600 shadow-lg"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                            >
                                🎓 Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "tpo" })}
                                className={`py-3 px-2 rounded-xl font-semibold transition-all text-sm ${formData.role === "tpo"
                                    ? "bg-white text-blue-600 shadow-lg"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                            >
                                👔 TPO
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "recruiter" })}
                                className={`py-3 px-2 rounded-xl font-semibold transition-all text-sm ${formData.role === "recruiter"
                                    ? "bg-white text-blue-600 shadow-lg"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                            >
                                💼 Recruiter
                            </button>
                        </div>
                    </div>

                    {/* Avatar Selection - Only for Students */}
                    {formData.role === "student" && (
                        <>
                            <p className="text-sm font-semibold mb-3 uppercase tracking-wide">Choose your avatar:</p>
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
                        </>
                    )}

                    {/* TPO Info */}
                    {formData.role === "tpo" && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <h3 className="font-bold mb-2">TPO Access</h3>
                            <p className="text-sm opacity-90">
                                As a Training and Placement Officer, you'll have access to post internship opportunities and manage placements for your institution.
                            </p>
                        </div>
                    )}

                    {/* Recruiter Info */}
                    {formData.role === "recruiter" && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <h3 className="font-bold mb-2">🤖 AI Code Detection</h3>
                            <p className="text-sm opacity-90">
                                As a Recruiter, you can post internships and request code submissions. Our AI will automatically detect if code is AI-generated and identify the tool used!
                            </p>
                        </div>
                    )}
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
                            {formData.role === "student" && (
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
                            )}
                        </div>

                        {/* Student Profile Links - Show for Student Only */}
                        {formData.role === "student" && (
                            <div className="space-y-4 pt-2 pb-2">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-1">Professional Links</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1 relative">
                                        <label className="text-sm font-medium text-gray-700">Resume / CV File (PDF/DOCX)</label>
                                        <div className="relative">
                                            <BsLink45Deg className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="file"
                                                name="resume"
                                                accept=".pdf,.doc,.docx"
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative">
                                        <label className="text-sm font-medium text-gray-700">LinkedIn Profile</label>
                                        <div className="relative">
                                            <BsLinkedin className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="url"
                                                name="linkedin"
                                                placeholder="https://linkedin.com/in/..."
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative">
                                        <label className="text-sm font-medium text-gray-700">GitHub Profile</label>
                                        <div className="relative">
                                            <BsGithub className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="url"
                                                name="github"
                                                placeholder="https://github.com/..."
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                value={formData.github}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative">
                                        <label className="text-sm font-medium text-gray-700">Portfolio Website</label>
                                        <div className="relative">
                                            <BsGlobe className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="url"
                                                name="website"
                                                placeholder="https://myportfolio.com"
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                value={formData.website}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Organization/College - Show for Student and TPO */}
                        {(formData.role === "student" || formData.role === "tpo") && (
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
                        )}

                        {/* Company Fields - Show only for Recruiters */}
                        {formData.role === "recruiter" && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Company Name *</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        placeholder="e.g. Tech Solutions Inc."
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Company Website</label>
                                        <input
                                            type="url"
                                            name="companyWebsite"
                                            placeholder="https://company.com"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            value={formData.companyWebsite}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Industry</label>
                                        <select
                                            name="industry"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
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
                                    <select
                                        name="companySize"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
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
                            </>
                        )}

                        {/* WhatsApp Notifications Opt-in */}
                        {formData.phone && formData.role === "student" && (
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
