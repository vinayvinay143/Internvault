import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export function Login({ setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
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
      if (isRegister) {
        // Registration
        const username = e.target.username.value;
        const response = await axios.post(`${API_URL}/auth/register`, {
          username,
          email,
          password,
        });

        // Auto-login after registration
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        const userData = loginResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedIn(userData);
        navigate("/");
      } else {
        // Login
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedIn(userData);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center">
          {isRegister ? "Create Account" : "Login"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Username (only for registration) */}
        {isRegister && (
          <div className="flex flex-col gap-1">
            <label className="font-medium">Username</label>
            <input
              type="text"
              name="username"
              required
              minLength={3}
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
              focus:ring-blue-400 focus:outline-none"
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
            focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 relative">
          <label className="font-medium">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={6}
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
            focus:ring-blue-400 focus:outline-none"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-xl cursor-pointer"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 
          transition font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {isRegister ? "Login" : "Sign up"}
          </span>
        </p>
      </form>
    </div>
  );
}
