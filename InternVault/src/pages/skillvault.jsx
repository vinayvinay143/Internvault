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
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 p-1.5 mb-8 sticky top-24 z-40 mx-auto max-w-fit overflow-x-auto no-scrollbar ring-1 ring-black/5">
          <nav className="flex items-center gap-1 min-w-max">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "."}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden md:inline">{link.label}</span>
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
