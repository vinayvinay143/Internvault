import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsList, BsX, BsSafe, BsTools, BsChevronDown, BsStars, BsEnvelopePaper, BsFileEarmarkPerson, BsMic, BsPersonCircle } from "react-icons/bs";

export function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
    { name: "Intern Chatbot", path: "/internchat" },
  ];

  const toolsLinks = [
    { name: "Cold Email", path: "/tools/cold-email", icon: <BsEnvelopePaper className="text-lg text-indigo-500" /> },
    { name: "Resume AI", path: "/tools/resume-analyzer", icon: <BsFileEarmarkPerson className="text-lg text-blue-500" /> },
    { name: "Interview Dojo", path: "/tools/interview-dojo", icon: <BsMic className="text-lg text-purple-500" /> },
    { name: "Skill Radar", path: "/tools/skill-radar", icon: <BsStars className="text-lg text-amber-500" /> },

  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center ">
      <nav className="w-full max-w-10xl bg-white/70 backdrop-blur-md border border-white/40 transition-all duration-300">
        <div className="px-6 py-3 flex justify-between items-center ">
          <Link to="/" className="text-3xl shiny-text">
            InternVault
          </Link>

          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-1 items-center">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 ${isActive
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600'
                        }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}

              {/* SkillVault Direct Link - Only show when logged in */}
              {user && (
                <li>
                  <Link
                    to="/skillvault"
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 ${location.pathname === '/skillvault'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-600'
                      }`}
                  >
                    <BsSafe /> SkillVault
                  </Link>
                </li>
              )}

              {/* Tools Dropdown - Only show when logged in */}
              {user && (
                <li className="relative group"
                  onMouseEnter={() => setIsToolsOpen(true)}
                  onMouseLeave={() => setIsToolsOpen(false)}>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all">
                    <BsTools /> Tools <BsChevronDown size={10} />
                  </button>

                  {isToolsOpen && (
                    <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                        {toolsLinks.map((tool) => {
                          const isActive = location.pathname === tool.path;
                          return (
                            <Link
                              key={tool.name}
                              to={tool.path}
                              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                            >
                              {tool.icon} {tool.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <BsPersonCircle className="text-blue-600 text-xl" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {user.username}
                  </span>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition ${location.pathname === '/dashboard'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                      }`}
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
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200 h-[calc(100vh-64px)] overflow-y-auto">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}

              {/* Mobile SkillVault - Only show when logged in */}
              {user && (
                <div className="py-2 border-t border-gray-100 my-2">
                  <li className="list-none">
                    <Link
                      to="/skillvault"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${location.pathname === '/skillvault'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                    >
                      <BsSafe /> SkillVault
                    </Link>
                  </li>
                </div>
              )}

              {/* Mobile Tools - Only show when logged in */}
              {user && (
                <div className="py-2 border-t border-b border-gray-100 my-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Tools</p>
                  {toolsLinks.map((tool) => {
                    const isActive = location.pathname === tool.path;
                    return (
                      <li key={tool.name}>
                        <Link
                          to={tool.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                        >
                          {tool.icon} {tool.name}
                        </Link>
                      </li>
                    );
                  })}
                </div>
              )}
            </ul>

            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  {/* User Avatar in Mobile */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <BsPersonCircle className="text-blue-600 text-2xl" />
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {user.username}
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full py-3 rounded-xl text-sm font-medium transition-colors text-center ${location.pathname === '/dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
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