import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsX, BsSafe, BsShieldCheck } from "react-icons/bs";


export function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
    { name: "Prompts", path: "/prompts" },
    { name: "Intern Chatbot", path: "/intern-chat" },
    { name: "Skill Vault", path: "/skillvault", special: true },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center ">
      <nav className="w-full max-w-10xl bg-white/70 backdrop-blur-md border border-white/40 transition-all duration-300">
        <div className="px-6 py-3 flex justify-between items-center ">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            InternVault
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.isButton ? (
                    <button
                      onClick={link.onClick}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent ${link.special
                        ? "text-blue-700 hover:border-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:border-blue-600"
                        }`}
                    >
                      {link.special && <BsSafe className="text-xl" />}
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">
                    {user.username}
                  </span>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-black transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${link.special
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {link.special && <BsSafe className="text-xl" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="text-center text-sm font-semibold text-gray-700">
                    Signed in as {user.username}
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors text-center"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}