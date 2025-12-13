import { useState, useEffect } from "react";
import axios from "axios"; // Assuming axios is installed/used
import { FaYoutube, FaGoogle } from "react-icons/fa";
import { SiUdemy } from "react-icons/si";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useOutletContext } from "react-router-dom"; // Assuming user might be passed via context if not strict props, but we'll try to get it from props or localstorage if needed. 
// However, the cleanest way is if SkillsVault passes it down, or if we use localstorage directly for user ID if props aren't drilling.
// For now, let's assume `Skillvault` layout doesn't easily pass props to Outlet without specific setup. 
// I will check if App.jsx passes user to Skillvault.
// App.jsx: <Route path="project" element={<Project user={user} />} />
// App.jsx: <Route path="courses" element={<Course />} />  <-- User NOT passed to Course.
// I will need to use localStorage to get the user ID for favorites to work, or update App.jsx.
// Updating App.jsx is better practice, but for this step I'll use localStorage to avoid App.jsx edit if possible, 
// OR I'll update App.jsx in a subsequent step.
// Actually, `App.jsx` shows `user` state. I'll read from localStorage here to be self-contained or use the prop if I fix App.jsx later.
// Let's rely on localStorage 'user' for now as it's safe.

const API_URL = "http://localhost:5000/api";

export function Course() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      // Silently handle error - user may not have any favorites yet
      setFavorites([]);
    }
  };

  const toggleFavorite = async (course) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    setLoading(true);
    // Prefix ID to avoid collision with numeric projects if needed, or just use raw ID if unique enough. 
    // Let's use string IDs for courses: "c1", "c2"...
    const uniqueId = `course_${course.id}`;
    const isFavorited = favorites.includes(uniqueId);

    try {
      if (isFavorited) {
        await axios.delete(`${API_URL}/favorites/remove/${user._id}/${uniqueId}`);
        setFavorites((prev) => prev.filter((id) => id !== uniqueId));
      } else {
        await axios.post(`${API_URL}/favorites/add`, {
          userId: user._id,
          projectId: uniqueId,
          title: `${course.name} Course`,
          domain: "Learning",
          level: "All",
        });
        setFavorites((prev) => [...prev, uniqueId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.response?.status === 400 && !isFavorited) {
        setFavorites((prev) => [...prev, uniqueId]);
      } else {
        // If 404 on remove? ignore
      }
    } finally {
      setLoading(false);
    }
  };


  const courses = [
    {
      id: 1,
      name: "HTML",
      description: "Structure of the web. Learn tags, semantics, and SEO basics.",
      image: "/html.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/results?search_query=html+course" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/html/" },
        { name: "Google", icon: <FaGoogle />, link: "https://web.dev/learn/html/" },
      ],
    },
    {
      id: 2,
      name: "CSS",
      description: "Style your pages with Flexbox, Grid, and Animations.",
      image: "/css.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/results?search_query=css+course" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/css/" },
        { name: "Google", icon: <FaGoogle />, link: "https://web.dev/learn/css/" },
      ],
    },
    {
      id: 3,
      name: "JavaScript",
      description: "The logic of the web. ES6+, DOM manipulation, and Async.",
      image: "/js.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/results?search_query=javascript+course" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/javascript/" },
        { name: "Google", icon: <FaGoogle />, link: "https://developers.google.com/learn/pathways/javascript-beginner" },
      ],
    },
    {
      id: 4,
      name: "React",
      description: "Build modern, reactive user interfaces with components.",
      image: "/react.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/results?search_query=react+course" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/react/" },
        { name: "Google", icon: <FaGoogle />, link: "https://web.dev/learn/react/" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Learning <span className="text-blue-600">Resources</span></h1>
        <p className="text-gray-500 mt-2">Curated lists from top platforms.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const uniqueId = `course_${course.id}`;

          return (
            <div
              key={course.id}
              className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative mb-4">
                <div className="absolute top-0 right-0 z-10">
                  <button
                    onClick={() => toggleFavorite(course)}
                    disabled={loading}
                    className="bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-200 transition"
                  >
                    {favorites.includes(uniqueId) ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                  </button>
                </div>
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-16 h-16 object-contain rounded-xl mb-2"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">{course.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-2">
                {course.sources.map((src, index) => (
                  <a
                    key={index}
                    href={src.link}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-600 font-medium text-xs hover:bg-blue-600 hover:text-white transition"
                  >
                    {src.icon}
                    {src.name}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
