// import { useState } from "react";
// const projectData = [
//   // Full Stack Projects
//   {
//     id: 1,
//     title: "Portfolio Website",
//     domain: "Full Stack",
//     level: "Beginner",
//     description: "A personal portfolio using HTML, CSS, JS or React."
//   },
//   {
//     id: 2,
//     title: "E-commerce Website",
//     domain: "Full Stack",
//     level: "Intermediate",
//     description: "Full MERN stack website with authentication and cart."
//   },
//   {
//     id: 3,
//     title: "Social Media App",
//     domain: "Full Stack",
//     level: "Advanced",
//     description: "Real-time chat, posts, likes, and notifications."
//   },

//   // AI/ML Projects
//   {
//     id: 4,
//     title: "Spam Email Classifier",
//     domain: "AI/ML",
//     level: "Beginner",
//     description: "Train a model to classify spam and ham emails."
//   },
//   {
//     id: 5,
//     title: "Credit Card Fraud Detection",
//     domain: "AI/ML",
//     level: "Intermediate",
//     description: "Fraud detection with imbalance handling + ML pipeline."
//   },
//   {
//     id: 6,
//     title: "Real-time Object Detection",
//     domain: "AI/ML",
//     level: "Advanced",
//     description: "YOLO/SSD model detecting objects in real time."
//   },

//   // DevOps Projects
//   {
//     id: 7,
//     title: "CI/CD Pipeline Setup",
//     domain: "DevOps",
//     level: "Intermediate",
//     description: "GitHub Actions + Docker + Kubernetes deployment."
//   }
// ];


// export function Project() {
//   const [selectedDomain, setSelectedDomain] = useState("All");
//   const [selectedLevel, setSelectedLevel] = useState("All");

//   const domains = ["All", "Full Stack", "AI/ML", "DevOps"];
//   const levels = ["All", "Beginner", "Intermediate", "Advanced"];

//   // FILTERING LOGIC
//   const filteredProjects = projectData.filter((project) => {
//     const domainMatch =
//       selectedDomain === "All" || project.domain === selectedDomain;

//     const levelMatch =
//       selectedLevel === "All" || project.level === selectedLevel;

//     return domainMatch && levelMatch;
//   });

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-6">Project Ideas Library</h1>

//       {/* Filters */}
//       <div className="flex gap-4 mb-6">
//         {/* Domain Filter */}
//         <select
//           className="p-2 border rounded-lg"
//           value={selectedDomain}
//           onChange={(e) => setSelectedDomain(e.target.value)}
//         >
//           {domains.map((domain) => (
//             <option key={domain}>{domain}</option>
//           ))}
//         </select>

//         {/* Level Filter */}
//         <select
//           className="p-2 border rounded-lg"
//           value={selectedLevel}
//           onChange={(e) => setSelectedLevel(e.target.value)}
//         >
//           {levels.map((lvl) => (
//             <option key={lvl}>{lvl}</option>
//           ))}
//         </select>
//       </div>

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredProjects.map((project) => (
//           <div
//             key={project.id}
//             className="p-4 border rounded-xl shadow bg-white hover:shadow-lg transition"
//           >
//             <h2 className="text-xl font-semibold">{project.title}</h2>
//             <p className="text-gray-600 mt-1">{project.description}</p>

//             <div className="flex gap-2 mt-3">
//               <span className="px-3 py-1 rounded-full bg-blue-200 text-sm">
//                 {project.domain}
//               </span>
//               <span className="px-3 py-1 rounded-full bg-green-200 text-sm">
//                 {project.level}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredProjects.length === 0 && (
//         <p className="text-center text-gray-500 mt-5">No projects found.</p>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFilter, BsFolder } from "react-icons/bs";

const API_URL = "http://localhost:5000/api";

const projectData = [
  {
    id: 1,
    title: "Portfolio Website",
    domain: "Full Stack",
    level: "Beginner",
    description: "A personal portfolio using HTML, CSS, JS or React.",
  },
  {
    id: 2,
    title: "E-commerce Website",
    domain: "Full Stack",
    level: "Intermediate",
    description: "Full MERN stack website with authentication and cart.",
  },
  {
    id: 3,
    title: "Social Media App",
    domain: "Full Stack",
    level: "Advanced",
    description: "Real-time chat, posts, likes, and notifications.",
  },
  {
    id: 4,
    title: "Spam Email Classifier",
    domain: "AI/ML",
    level: "Beginner",
    description: "Train a model to classify spam and ham emails.",
  },
  {
    id: 5,
    title: "Credit Card Fraud Detection",
    domain: "AI/ML",
    level: "Intermediate",
    description: "Fraud detection with imbalance handling + ML pipeline.",
  },
  {
    id: 6,
    title: "Real-time Object Detection",
    domain: "AI/ML",
    level: "Advanced",
    description: "YOLO/SSD model detecting objects in real time.",
  },
  {
    id: 7,
    title: "CI/CD Pipeline Setup",
    domain: "DevOps",
    level: "Intermediate",
    description: "GitHub Actions + Docker + Kubernetes deployment.",
  },
];

export function Project({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch existing favorites on mount
  useEffect(() => {
    if (user?._id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites/${user._id}`);
      const favoriteIds = response.data.map((fav) => fav.projectId);
      setFavorites(favoriteIds);
    } catch (error) {
      // Silently handle - user may not have any favorites
      setFavorites([]);
    }
  };

  const toggleFavorite = async (project) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    setLoading(true);
    const isFavorited = favorites.includes(String(project.id));
    // Use 'p-' prefix for logic if IDs collide with other types, but keeping simple as requested
    // Assuming backend handles ID collision or we treat int IDs as project-specific
    const uniqueId = String(project.id);

    try {
      if (isFavorited) {
        // Remove from favorites
        await axios.delete(`${API_URL}/favorites/remove/${user._id}/${uniqueId}`);
        setFavorites((prev) => prev.filter((id) => id !== uniqueId));
      } else {
        // Add to favorites
        await axios.post(`${API_URL}/favorites/add`, {
          userId: user._id,
          projectId: uniqueId,
          title: project.title,
          domain: project.domain,
          level: project.level,
        });
        setFavorites((prev) => [...prev, uniqueId]);
      }
    } catch (error) {
      // Handle error silently for better UX
      if (error.response?.status === 400 && !isFavorited) {
        // Already exists, just update local state
        setFavorites((prev) => [...prev, uniqueId]);
      }
      // Don't show alert for minor errors
    } finally {
      setLoading(false);
    }
  };

  const domains = ["All", "Full Stack", "AI/ML", "DevOps"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredProjects = projectData.filter((project) => {
    const domainMatch =
      selectedDomain === "All" || project.domain === selectedDomain;
    const levelMatch = selectedLevel === "All" || project.level === selectedLevel;
    return domainMatch && levelMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Project <span className="text-blue-600">Ideas</span></h1>
          <p className="text-gray-500 mt-1">Build these to level up your portfolio.</p>
        </div>

        <div className="flex gap-3 bg-gray-50 p-2 rounded-xl">
          <div className="flex items-center gap-2 px-3 text-gray-400">
            <BsFilter />
          </div>
          <select
            className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <div className="w-px h-6 bg-gray-300"></div>
          <select
            className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group p-6 border border-gray-100 rounded-3xl shadow-sm bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full transition-transform group-hover:scale-150
                ${project.level === 'Beginner' ? 'from-green-400 to-emerald-600' :
                project.level === 'Intermediate' ? 'from-yellow-400 to-orange-600' : 'from-red-400 to-pink-600'}`}>
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <BsFolder className="text-xl" />
              </div>
              <button
                onClick={() => toggleFavorite(project)}
                disabled={loading}
                className="text-2xl transition hover:scale-110 active:scale-95 disabled:opacity-50"
                title={user ? (favorites.includes(String(project.id)) ? "Remove from favorites" : "Add to favorites") : "Login to add favorites"}
              >
                {favorites.includes(String(project.id)) ? (
                  <AiFillHeart className="text-red-500 drop-shadow-sm" />
                ) : (
                  <AiOutlineHeart className="text-gray-300 hover:text-red-400" />
                )}
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{project.title}</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed relative z-10 line-clamp-3">{project.description}</p>

            <div className="flex gap-2 relative z-10">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold tracking-wide uppercase">{project.domain}</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase
                 ${project.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  project.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {project.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No projects found matching your filters.</p>
          <button onClick={() => { setSelectedDomain("All"); setSelectedLevel("All") }} className="mt-2 text-blue-600 font-medium hover:underline">Clear Filters</button>
        </div>
      )}
    </div>
  );
}
