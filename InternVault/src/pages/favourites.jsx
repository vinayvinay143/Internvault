import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";

// Consider moving this to a config file
const API_URL = "http://localhost:5000/api";

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
      // Error handled via UI state
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await axios.delete(`${API_URL}/favorites/remove/${favoriteId}`);
      setFavs((prev) => prev.filter((fav) => fav._id !== favoriteId));
    } catch (err) {
      // Silently handle error - item might already be removed
    }
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
          <h1 className="text-3xl font-bold text-gray-800">My <span className="text-blue-600">Dashboard</span></h1>
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
          {favs.map((fav) => (
            <div key={fav._id} className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => removeFavorite(fav._id)}
                  className="bg-white/80 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm border border-gray-100"
                  title="Remove"
                >
                  <AiOutlineClose />
                </button>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                   ${fav.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    fav.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {fav.level || 'Project'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-2 pr-8 leading-tight line-clamp-2">{fav.title}</h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">{fav.description || "No description available."}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {fav.domain || "General"}
                </span>
                <button className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
