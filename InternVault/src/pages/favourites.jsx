import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose, AiOutlineStar, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFolder } from "react-icons/bs";
import { FaYoutube, FaGoogle } from "react-icons/fa";
import { SiUdemy, SiCoursera } from "react-icons/si";
import { Link } from "react-router-dom";

// Consider moving this to a config file
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function Favorites({ user }) {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/favorites/${user._id}`);
      setFavs(response.data);
    } catch (err) {
      setError("Failed to load favorites");
      console.error('❌ Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await axios.delete(`${API_URL}/favorites/remove/${favoriteId}`);
      setFavs((prev) => prev.filter((fav) => fav._id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  // Helper function to get the appropriate icon for each source
  const getSourceIcon = (sourceName) => {
    const name = sourceName.toLowerCase();
    if (name.includes('youtube')) return <FaYoutube />;
    if (name.includes('udemy')) return <SiUdemy />;
    if (name.includes('coursera')) return <SiCoursera />;
    return <FaGoogle />;
  };

  // --- Render States ---

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
          <AiOutlineStar className="text-5xl text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Please log in to your account to view and manage your saved projects and internships.
        </p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium">Loading your favorites...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-2xl text-center text-red-600 border border-red-100">
        <p className="font-semibold">{error}</p>
        <button onClick={fetchFavorites} className="mt-4 text-sm underline hover:text-red-800">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My <span className="text-blue-600">Favorites</span></h1>
          <p className="text-gray-500 mt-1">Manage your saved items.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 font-medium text-sm">
          {favs.length} Saved Items
        </div>
      </div>

      {favs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-4">No favorites yet.</p>
          <Link to="/skillvault/project" className="text-blue-600 font-medium hover:underline">
            Browse Projects to Add
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favs.map((fav) => {
            // Check if this item has course sources
            const hasSources = fav.sources && Array.isArray(fav.sources) && fav.sources.length > 0;

            return (
              <div
                key={fav._id}
                className="group p-6 border border-gray-100 rounded-3xl shadow-sm bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full transition-transform group-hover:scale-150
                    ${fav.level === 'Beginner' ? 'from-green-400 to-emerald-600' :
                    fav.level === 'Intermediate' ? 'from-yellow-400 to-orange-600' :
                      fav.level === 'Advanced' ? 'from-red-400 to-pink-600' :
                        'from-blue-400 to-indigo-600'}`}>
                </div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  {hasSources && fav.image ? (
                    <img
                      src={fav.image}
                      alt={fav.title}
                      className="w-16 h-16 object-contain rounded-xl mb-2"
                    />
                  ) : (
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <BsFolder className="text-xl" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFavorite(fav._id)}
                    className="text-2xl transition hover:scale-110 active:scale-95"
                    title="Remove from favorites"
                  >
                    <AiFillHeart className="text-red-500 drop-shadow-sm" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{fav.title}</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed relative z-10 line-clamp-3">
                  {fav.description || "No description available."}
                </p>

                {/* Display course links if they exist */}
                {hasSources ? (
                  <div className="space-y-2 relative z-10">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Learning Resources:</p>
                    <div className="flex flex-wrap gap-2">
                      {fav.sources.map((src, index) => (
                        <a
                          key={index}
                          href={src.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-600 font-medium text-xs hover:bg-blue-600 hover:text-white transition"
                        >
                          {getSourceIcon(src.name)}
                          {src.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 relative z-10">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold tracking-wide uppercase">
                      {fav.domain || "General"}
                    </span>
                    {fav.level && fav.level !== 'Course' && (
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase
                         ${fav.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          fav.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            fav.level === 'Advanced' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'}`}>
                        {fav.level}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
