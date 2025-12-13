import { useState, useEffect } from "react";
import axios from "axios";
import { BsX } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000/api";

export function AdBanner() {
    const [ads, setAds] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check local storage for dismissal
        const dismissed = localStorage.getItem("adBannerDismissed");
        if (dismissed) {
            // If dismissed, check if expired (optional logic, but simple dismissal persists here)
            // For now, simple session-like dismissal or permanent. 
            // User asked "last only 24 hrs it will disapper once the other use click X button"
            // Let's assume X hides it for the session or permanently for THAT batch.
            // Let's implement timestamp check: if new ads come, maybe show again?
            // Simpler: Just check if explicit 'dismissed' exists.
            // But user wants to see "add in the home page like add remenber" -> likely means reminders? 
            // Or likely "Ads" as in advertisements. "add" -> "Ad".

            // Let's fetch anyway to see if there are ads.
        }

        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const response = await axios.get(`${API_URL}/ads/active`);
            // Filter out dismissed ads if tracking individually, but simpler is global dismiss for now
            // or just show list.
            setAds(response.data);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // localStorage.setItem("adBannerDismissed", "true"); // Uncomment to persist across reloads if desired
    };

    if (!isVisible || ads.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 right-4 md:right-8 z-50 max-w-sm w-full"
            >
                <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden relative">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 flex justify-between items-center">
                        <span className="text-white font-bold text-sm tracking-wide">🔥 Hot Internships (24h left)</span>
                        <button onClick={handleDismiss} className="text-white/80 hover:text-white transition">
                            <BsX className="text-2xl" />
                        </button>
                    </div>

                    {/* Content (Carousel or List) */}
                    <div className="p-4 max-h-60 overflow-y-auto custom-scrollbar space-y-3 bg-blue-50/30">
                        {ads.map((ad) => (
                            <div key={ad._id} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden flex-shrink-0">
                                    {ad.imageUrl ? <img src={ad.imageUrl} alt={ad.companyName} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-gray-400">N/A</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{ad.companyName}</h4>
                                    <a href={ad.link} target="_blank" className="text-xs text-blue-600 hover:text-blue-700 font-medium truncate block">
                                        Apply Now &rarr;
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
