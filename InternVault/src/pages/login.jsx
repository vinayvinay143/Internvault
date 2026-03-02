import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsBriefcase, BsStars, BsShieldCheck } from "react-icons/bs";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function Login({ setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      setIsLoggedIn(userData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] bg-white border border-slate-200 shadow-lg rounded-2xl p-6 md:p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/30 mb-4">
            <BsBriefcase size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back</h2>
          <p className="text-sm text-slate-500">Enter your credentials to access your account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2"
          >
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : "Sign In to Account"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-slate-50/50 backdrop-blur-xl text-slate-500">New to Platform?</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center w-full px-6 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
            >
              Create Account
            </Link>
          </div>
        </form>
      </motion.div>

    </div>
  );
}
