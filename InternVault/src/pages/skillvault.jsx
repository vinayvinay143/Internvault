import { NavLink, Outlet } from "react-router-dom";

export function Skillvault() {
  return (
    <div className="p-6">

      {/* Beautiful Pill Navbar */}
      <div className="flex justify-center mb-8">
        <nav className="flex bg-white shadow-md border border-gray-200 rounded-full px-4 py-2 gap-3">

          <NavLink
            to="skills"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition font-medium
              ${isActive ? "bg-blue-500 text-white shadow" : "hover:bg-blue-100"}`
            }
          >
            Skills
          </NavLink>

          <NavLink
            to="courses"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition font-medium
              ${isActive ? "bg-blue-500 text-white shadow" : "hover:bg-blue-100"}`
            }
          >
            Courses
          </NavLink>

          <NavLink
            to="resume"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition font-medium
              ${isActive ? "bg-blue-500 text-white shadow" : "hover:bg-blue-100"}`
            }
          >
           Resume
          </NavLink>

          <NavLink
            to="skillprompt"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition font-medium
              ${isActive ? "bg-blue-500 text-white shadow" : "hover:bg-blue-100"}`
            }
          >
           Prompt
          </NavLink>

          <NavLink
            to="favorites"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition font-medium
              ${isActive ? "bg-blue-500 text-white shadow" : "hover:bg-blue-100"}`
            }
          >
            Favorites
          </NavLink>

        </nav>
      </div>
      <Outlet />
     
    </div>
  );
}

