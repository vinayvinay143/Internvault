import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsNewspaper, BsArrowUpRight } from "react-icons/bs";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function NewsTicker() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${API_URL}/news`);
            if (response.data.articles) {
                setNews(response.data.articles);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || news.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/30 backdrop-blur-md border-t border-white/40 shadow-lg overflow-hidden">
            <div className="relative h-12 flex items-center">
                {/* News Icon */}
                <div className="absolute left-4 z-10 flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-md">
                    <BsNewspaper className="text-sm" />
                    <span className="text-xs font-bold">LIVE NEWS</span>
                </div>

                {/* Scrolling News Container */}
                <div className="absolute left-0 right-0 overflow-hidden pl-32">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap"
                        animate={{
                            x: [0, -2000]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear"
                            }
                        }}
                    >
                        {/* Duplicate news items for seamless loop */}
                        {[...news, ...news].map((article, index) => (
                            <a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-slate-800 hover:text-blue-600 transition-colors group"
                            >
                                <span className="font-semibold">{article.title}</span>
                                <BsArrowUpRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-slate-400 mx-2">•</span>
                            </a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
