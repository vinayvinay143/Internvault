import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload, AiOutlineEye } from "react-icons/ai";

const API_URL = "http://localhost:5000/api";

export function Resume() {
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
      // Silently handle error
      setFavorites([]);
    }
  };

  const toggleFavorite = async (resume) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    setLoading(true);
    const uniqueId = `resume_${resume.id}`;
    const isFavorited = favorites.includes(uniqueId);

    try {
      if (isFavorited) {
        await axios.delete(`${API_URL}/favorites/remove/${user._id}/${uniqueId}`);
        setFavorites((prev) => prev.filter((id) => id !== uniqueId));
      } else {
        await axios.post(`${API_URL}/favorites/add`, {
          userId: user._id,
          projectId: uniqueId,
          title: `Resume Template ${resume.id}`,
          domain: "Career",
          level: "Draft",
        });
        setFavorites((prev) => [...prev, uniqueId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.response?.status === 400 && !isFavorited) {
        setFavorites((prev) => [...prev, uniqueId]);
      }
    } finally {
      setLoading(false);
    }
  };

  const resumes = [
    { id: 1, image: "/resume1.png", file: "/resume1.pdf" },
    // Adding more mock data for better UI demo
    { id: 2, image: "/resume1.png", file: "#" },
    { id: 3, image: "/resume1.png", file: "#" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Resume <span className="text-blue-600">Templates</span></h1>
        <p className="text-gray-500 mt-2">ATS-friendly formats to get you hired.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {resumes.map((item) => {
          const uniqueId = `resume_${item.id}`;
          return (
            <div
              key={item.id}
              className="group bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition duration-500 hover:-translate-y-2 relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => toggleFavorite(item)}
                  disabled={loading}
                  className="bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 shadow-md border border-gray-100 transition"
                >
                  {favorites.includes(uniqueId) ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                </button>
              </div>

              <div className="w-full h-64 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
                {/* Placeholder for actual resume preview if image fails */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">Preview</div>
                <img
                  src={item.image}
                  alt={`Resume ${item.id}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 relative z-10"
                />
              </div>

              <div className="flex gap-3 w-full">
                <a
                  href={item.file}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition"
                >
                  <AiOutlineEye /> View
                </a>

                <a
                  href={item.file}
                  download
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition shadow-lg shadow-gray-200"
                >
                  <AiOutlineDownload /> Save
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
