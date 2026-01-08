import express from "express";
import axios from "axios";

const router = express.Router();

// Fallback news data if API key is missing or API fails
const fallbackNews = [
    {
        title: "Tech Giants Announce 10,000+ New Internship Positions for 2026",
        description: "Major technology companies including Google, Microsoft, and Meta have announced a significant expansion of their internship programs.",
        url: "https://example.com/news/tech-internships-2026",
        source: { name: "Tech News Daily" },
        publishedAt: new Date().toISOString(),
        urlToImage: null
    },
    {
        title: "Remote Internships See 300% Growth in Job Market",
        description: "The shift to remote work continues to reshape internship opportunities, with companies offering more flexible positions.",
        url: "https://example.com/news/remote-internships",
        source: { name: "Career Insights" },
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        urlToImage: null
    },
    {
        title: "Top Skills Employers Look for in 2026 Interns",
        description: "Industry survey reveals the most in-demand technical and soft skills for internship candidates.",
        url: "https://example.com/news/top-skills-2026",
        source: { name: "Hiring Trends" },
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        urlToImage: null
    },
    {
        title: "Startup Internships Offer Higher Compensation Than Ever",
        description: "Early-stage companies compete with tech giants by offering competitive salaries and equity to interns.",
        url: "https://example.com/news/startup-compensation",
        source: { name: "Startup Weekly" },
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        urlToImage: null
    },
    {
        title: "AI and Machine Learning Internships in High Demand",
        description: "Companies across industries seek interns with AI/ML skills as automation accelerates.",
        url: "https://example.com/news/ai-ml-demand",
        source: { name: "Tech Career Guide" },
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        urlToImage: null
    }
];

// GET /api/news - Fetch latest internship/job market news
router.get("/", async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;

        // If no API key, return fallback data
        if (!apiKey) {
            console.log("⚠️  NEWS_API_KEY not found, using fallback news data");
            return res.json({
                status: "ok",
                totalResults: fallbackNews.length,
                articles: fallbackNews
            });
        }

        // Fetch from NewsAPI
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: 'internship OR "job market" OR "hiring trends" OR "career opportunities"',
                sortBy: "publishedAt",
                language: "en",
                pageSize: 20,
                apiKey: apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error.message);

        // Return fallback data on error
        res.json({
            status: "ok",
            totalResults: fallbackNews.length,
            articles: fallbackNews
        });
    }
});

export default router;
