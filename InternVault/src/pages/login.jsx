import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export function Login({ setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP LOGIN (replace with Firebase later)
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "test@gmail.com" && password === "123456") {
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      alert("Login Successful!");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

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

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 
          transition font-semibold"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account? <span className="text-blue-500 cursor-pointer">Sign up</span>
        </p>
      </form>
    </div>
  );
}
