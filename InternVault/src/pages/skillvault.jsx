import { NavLink, Outlet } from "react-router-dom";
import { BsCodeSlash, BsFileEarmarkText, BsJournalBookmark, BsLightbulb, BsKanban, BsStar } from "react-icons/bs";

export function Skillvault() {
  const links = [
    { to: ".", label: "Home", icon: <BsKanban /> },
    { to: "skills", label: "Skills", icon: <BsCodeSlash /> },
    { to: "courses", label: "Courses", icon: <BsJournalBookmark /> },
    { to: "resume", label: "Resume", icon: <BsFileEarmarkText /> },
    { to: "skillprompt", label: "Prompt", icon: <BsLightbulb /> },
    { to: "project", label: "Project", icon: <BsKanban /> },
    { to: "favorites", label: "Favorites", icon: <BsStar /> },
  ];

  return (
    <div className="mt-16 min-h-screen bg-gray-50 pt-10 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Top Navbar Navigation */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 sticky top-5 z-40 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-2 min-w-max">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "."}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                    : "text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <main className="bg-white rounded-3xl shadow-xl p-6 md:p-10 min-h-[600px] border border-gray-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

