import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BsNewspaper, BsArrowUpRight, BsClock } from "react-icons/bs";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function NewsFeed() {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return "Just now";
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                        <BsNewspaper />
                        <span className="text-sm font-bold">LATEST NEWS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Internship & Career News
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Stay updated with the latest trends, opportunities, and insights in the job market.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                                <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* News Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((article, index) => (
                            <motion.a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                {article.urlToImage && (
                                    <div className="h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={article.urlToImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Source & Date */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold text-blue-600">
                                            {article.source.name}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <BsClock />
                                            {formatDate(article.publishedAt)}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h3>

                                    {/* Description */}
                                    {article.description && (
                                        <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                                            {article.description}
                                        </p>
                                    )}

                                    {/* Read More */}
                                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                                        Read More
                                        <BsArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && news.length === 0 && (
                    <div className="text-center py-20">
                        <BsNewspaper className="text-6xl text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No News Available</h3>
                        <p className="text-slate-600">Check back later for the latest updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
