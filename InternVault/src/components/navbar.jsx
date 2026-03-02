import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsList, BsX, BsSafe, BsTools, BsChevronDown, BsEnvelopePaper, BsFileEarmarkPerson, BsPersonCircle, BsBuilding } from "react-icons/bs";


export function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
    { name: "Code Challenges", path: "/code-challenges" },
    { name: "Intern Chatbot", path: "/internchat" },
    { name: "Report Fraud", path: "/report-fraud" },
  ];

  // TPO-specific link
  const tpoLink = { name: "TPO Internships", path: "/tpo-internships" };

  const toolsLinks = [
    { name: "Cold Email", path: "/tools/cold-email", icon: <BsEnvelopePaper className="text-lg text-indigo-500" /> },
    { name: "Resume AI", path: "/tools/resume-analyzer", icon: <BsFileEarmarkPerson className="text-lg text-blue-500" /> },
  ];


  const isHome = location.pathname === '/';
  // Navbar is transparent only if on Home AND not scrolled AND not logged in
  const isTransparent = isHome && !scrolled && !user;

  const textColorClass = isTransparent ? 'text-white hover:text-cyan-300' : 'text-gray-600 hover:text-blue-600';
  const activeColorClass = isTransparent ? 'text-cyan-300' : 'text-blue-600';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center ">
      <nav className={`w-full max-w-10xl transition-all duration-300 ${isTransparent
        ? "bg-transparent border-transparent"
        : "bg-white/90 backdrop-blur-md border border-white/40 shadow-sm"
        }`}>
        <div className="px-6 py-3 flex justify-between items-center ">
          <Link to="/" className={`text-3xl flex items-center gap-2 ${isTransparent ? 'text-white font-brand' : 'shiny-text'}`}>
            InternVault
          </Link>

          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-1 items-center">
              {navLinks
                .filter(link => {
                  // Hide Home link if user is logged in
                  if (user && link.path === '/') return false;

                  // Hide Internships, Intern Chatbot, and Report Fraud for recruiters
                  if (user?.role === 'recruiter' &&
                    (link.path === '/internships' ||
                      link.path === '/internchat' ||
                      link.path === '/report-fraud' ||
                      link.path === '/code-challenges')) {
                    return false;
                  }
                  // Hide Code Challenges for TPO
                  if (user?.role === 'tpo' && link.path === '/code-challenges') {
                    return false;
                  }
                  return true;
                })
                .map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-blue-500 ${isActive
                          ? activeColorClass
                          : textColorClass
                          }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}

              {/* TPO Internships Link - Only show for TPO users */}
              {user && (user.role || "student") === "tpo" && (
                <li>
                  <Link
                    to={tpoLink.path}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 border-transparent hover:border-blue-500 ${location.pathname === tpoLink.path
                      ? activeColorClass
                      : textColorClass
                      }`}
                  >
                    {tpoLink.name}
                  </Link>
                </li>
              )}

              {/* Recruiter Links - Only show for Recruiter users */}
              {user && user.role === "recruiter" && (
                <>
                  <li>
                    <Link
                      to="/recruiter/dashboard"
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 border-transparent hover:border-blue-500 ${location.pathname === '/recruiter/dashboard'
                        ? activeColorClass
                        : textColorClass
                        }`}
                    >
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/recruiter/internships"
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 border-transparent hover:border-blue-500 ${location.pathname === '/recruiter/internships'
                        ? activeColorClass
                        : textColorClass
                        }`}
                    >
                      My Internships
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/recruiter/code-detection"
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 border-transparent hover:border-blue-500 ${location.pathname === '/recruiter/code-detection'
                        ? activeColorClass
                        : textColorClass
                        }`}
                    >
                      Code Evaluation
                    </Link>
                  </li>
                </>
              )}

              {/* SkillVault Direct Link - Only show for students */}
              {user && (user.role || "student") === "student" && (
                <li>
                  <Link
                    to="/skillvault"
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 border-transparent hover:border-blue-500 ${location.pathname === '/skillvault'
                      ? activeColorClass
                      : textColorClass
                      }`}
                  >
                    <BsSafe /> SkillVault
                  </Link>
                </li>
              )}

              {/* Tools Dropdown - Only show for students */}
              {user && user.role === "student" && (
                <li className="relative group"
                  onMouseEnter={() => setIsToolsOpen(true)}
                  onMouseLeave={() => setIsToolsOpen(false)}>
                  <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all ${textColorClass}`}>
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
                    {user.role === 'recruiter' ? (
                      <BsBuilding className="text-blue-600 text-lg" />
                    ) : user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <BsPersonCircle className="text-blue-600 text-xl" />
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                    {user.username}
                  </span>
                  <Link
                    to={user.role === 'recruiter' ? "/recruiter/profile" : "/dashboard"}
                    className={`text-sm font-medium transition ${location.pathname === '/dashboard' || location.pathname === '/recruiter/profile'
                      ? activeColorClass
                      : isTransparent ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-blue-600'
                      }`}
                  >
                    {user.role === 'recruiter' ? "Company Profile" : "Dashboard"}
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
            className={`lg:hidden p-2 rounded-lg transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200 h-[calc(100vh-64px)] overflow-y-auto">
            <ul className="space-y-2">
              {navLinks
                .filter(link => {
                  // Hide Internships, Intern Chatbot, and Report Fraud for recruiters
                  if (user?.role === 'recruiter' &&
                    (link.path === '/internships' ||
                      link.path === '/internchat' ||
                      link.path === '/report-fraud' ||
                      link.path === '/code-challenges')) {
                    return false;
                  }
                  // Hide Code Challenges for TPO
                  if (user?.role === 'tpo' && link.path === '/code-challenges') {
                    return false;
                  }
                  return true;
                })
                .map((link) => {
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

              {/* Mobile TPO Internships - Only show for TPO users */}
              {user && (user.role || "student") === "tpo" && (
                <li>
                  <Link
                    to={tpoLink.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${location.pathname === tpoLink.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tpoLink.name}
                  </Link>
                </li>
              )}

              {/* Mobile Recruiter Links - Only show for Recruiter users */}
              {user && user.role === "recruiter" && (
                <>
                  <li>
                    <Link
                      to="/recruiter/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${location.pathname === '/recruiter/dashboard'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/recruiter/internships"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${location.pathname === '/recruiter/internships'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      My Internships
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/recruiter/code-detection"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium ${location.pathname === '/recruiter/code-detection'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      Code Evaluation
                    </Link>
                  </li>
                </>
              )}

              {/* Mobile SkillVault - Only show for students */}
              {user && (user.role || "student") === "student" && (
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

              {/* Mobile Tools - Only show for students */}
              {user && user.role === "student" && (
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
                      {user.role === 'recruiter' ? (
                        <BsBuilding className="text-blue-600 text-xl" />
                      ) : user.avatar ? (
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
                    to={user.role === 'recruiter' ? "/recruiter/profile" : "/dashboard"}
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full py-3 rounded-xl text-sm font-medium transition-colors text-center ${location.pathname === '/dashboard' || location.pathname === '/recruiter/profile'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                  >
                    {user.role === 'recruiter' ? "Company Profile" : "Dashboard"}
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