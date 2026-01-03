import { useState } from "react";
import { motion } from "framer-motion";
import { BsTrash, BsPlus, BsCheck2, BsNewspaper, BsBuilding, BsStar, BsGeoAlt, BsMap, BsRobot, BsHeadphones, BsMic, BsPlay, BsPause, BsSkipForward, BsSkipBackward, BsLightbulb, BsGraphUp } from "react-icons/bs";

// Comparison Tool
export function ComparisonTool() {
    const [offers] = useState([
        { id: 1, company: "Google", role: "SWE Intern", salary: 8000, location: "Mountain View, CA", duration: "12 weeks" },
        { id: 2, company: "Startup XYZ", role: "Full Stack Intern", salary: 4000, location: "Austin, TX", duration: "10 weeks" }
    ]);

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsCheck2 className="text-green-600" />
                    Internship Comparison Tool
                </h2>
                <p className="text-slate-500 mt-2">Compare offers side-by-side</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
                <p className="text-slate-600">Comparison table coming soon!</p>
                <div className="mt-4 space-y-4">
                    {offers.map(offer => (
                        <div key={offer.id} className="p-4 bg-slate-50 rounded-xl">
                            <h3 className="font-bold text-lg">{offer.company} - {offer.role}</h3>
                            <p className="text-slate-600">${offer.salary}/mo • {offer.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// News Feed
export function NewsFeed() {
    const news = [
        { id: 1, title: "Google Opens 500 New Internship Positions", type: "company_update", date: "2 hours ago" },
        { id: 2, title: "5 Resume Mistakes That Cost You Interviews", type: "career_tip", date: "5 hours ago" },
        { id: 3, title: "From Bootcamp to FAANG: Sarah's Journey", type: "success_story", date: "1 day ago" }
    ];

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsNewspaper className="text-blue-600" />
                    Internship News Feed
                </h2>
                <p className="text-slate-500 mt-2">Stay updated with the latest opportunities</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{item.type}</span>
                        <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Company Intelligence
export function CompanyIntelligence() {
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const companies = {
        "Google": { rating: 4.8, hiringTime: "4-6 weeks", difficulty: "Hard" },
        "Meta": { rating: 4.6, hiringTime: "3-5 weeks", difficulty: "Hard" },
        "Microsoft": { rating: 4.7, hiringTime: "5-7 weeks", difficulty: "Medium" }
    };

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsBuilding className="text-indigo-600" />
                    Company Intelligence
                </h2>
                <p className="text-slate-500 mt-2">Deep insights into company culture</p>
            </div>
            <div className="flex gap-4 mb-8 justify-center">
                {Object.keys(companies).map(c => (
                    <button
                        key={c}
                        onClick={() => setSelectedCompany(c)}
                        className={`px-6 py-3 rounded-xl font-bold ${selectedCompany === c ? "bg-indigo-600 text-white" : "bg-white text-slate-700"}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-2xl font-bold mb-4">{selectedCompany}</h3>
                <div className="space-y-3">
                    <p><span className="font-bold">Rating:</span> {companies[selectedCompany].rating} ⭐</p>
                    <p><span className="font-bold">Hiring Time:</span> {companies[selectedCompany].hiringTime}</p>
                    <p><span className="font-bold">Difficulty:</span> {companies[selectedCompany].difficulty}</p>
                </div>
            </div>
        </div>
    );
}

// AI Career Coach
export function AICareerCoach() {
    const [goals, setGoals] = useState([
        { id: 1, text: "Complete React course", completed: false },
        { id: 2, text: "Build portfolio project", completed: false },
        { id: 3, text: "Practice 5 LeetCode problems", completed: true }
    ]);

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsRobot className="text-purple-600" />
                    AI Career Coach
                </h2>
                <p className="text-slate-500 mt-2">Personalized learning path and weekly goals</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold mb-4">This Week's Goals</h3>
                <div className="space-y-3">
                    {goals.map(goal => (
                        <div key={goal.id} className={`p-4 rounded-xl flex items-center gap-3 ${goal.completed ? "bg-green-50" : "bg-slate-50"}`}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${goal.completed ? "bg-green-600 border-green-600" : "border-slate-300"}`}>
                                {goal.completed && <BsCheck2 className="text-white" />}
                            </div>
                            <span className={goal.completed ? "line-through text-slate-500" : "text-slate-900"}>{goal.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Podcast Player
export function PodcastPlayer() {
    const [playing, setPlaying] = useState(false);
    const episodes = [
        { id: 1, title: "How to Ace Your First Tech Interview", duration: "32:15" },
        { id: 2, title: "From Bootcamp to Big Tech", duration: "45:30" },
        { id: 3, title: "Negotiating Your Internship Offer", duration: "28:45" }
    ];

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsHeadphones className="text-pink-600" />
                    Career Podcast
                </h2>
                <p className="text-slate-500 mt-2">Weekly insights from industry experts</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-center gap-6 mb-6">
                    <BsMic className="text-6xl" />
                    <div>
                        <h3 className="text-2xl font-bold">{episodes[0].title}</h3>
                        <p className="text-sm opacity-90">{episodes[0].duration}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                    <button className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                        <BsSkipBackward />
                    </button>
                    <button onClick={() => setPlaying(!playing)} className="w-16 h-16 rounded-full bg-white text-pink-600 flex items-center justify-center">
                        {playing ? <BsPause className="text-2xl" /> : <BsPlay className="text-2xl" />}
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                        <BsSkipForward />
                    </button>
                </div>
            </div>
        </div>
    );
}

// AI Interview Buddy
export function AIInterviewBuddy() {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsMic className="text-red-600" />
                    AI Interview Buddy
                </h2>
                <p className="text-slate-500 mt-2">Practice interviews with real-time AI feedback</p>
            </div>
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 mx-auto ${isRecording ? "bg-red-600 animate-pulse" : "bg-red-50"}`}>
                    <BsMic className={`text-6xl ${isRecording ? "text-white" : "text-red-600"}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{isRecording ? "Recording..." : "Ready to Practice?"}</h3>
                <button
                    onClick={() => setIsRecording(!isRecording)}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>
        </div>
    );
}

// Matching Algorithm
export function MatchingAlgorithm() {
    const matches = [
        { id: 1, company: "Google", role: "Software Engineering Intern", score: 95, logo: "https://logo.clearbit.com/google.com" },
        { id: 2, company: "Stripe", role: "Backend Engineering Intern", score: 88, logo: "https://logo.clearbit.com/stripe.com" }
    ];

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsGraphUp className="text-emerald-600" />
                    Smart Matching Algorithm
                </h2>
                <p className="text-slate-500 mt-2">AI-powered job recommendations</p>
            </div>
            <div className="space-y-6">
                {matches.map(match => (
                    <div key={match.id} className="bg-white rounded-2xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">{match.role}</h3>
                                <p className="text-slate-600">{match.company}</p>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                                {match.score}
                            </div>
                        </div>
                        <button className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">
                            Quick Apply
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Internship Heatmap
export function InternshipHeatmap() {
    const locations = [
        { city: "San Francisco", state: "CA", jobs: 1250, avgSalary: 8500, competition: "High" },
        { city: "New York", state: "NY", jobs: 980, avgSalary: 7800, competition: "High" },
        { city: "Seattle", state: "WA", jobs: 750, avgSalary: 7200, competition: "Medium" },
        { city: "Austin", state: "TX", jobs: 520, avgSalary: 6500, competition: "Medium" }
    ];

    return (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 mb-12 border border-slate-200">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <BsMap className="text-blue-600" />
                    Internship Heatmap
                </h2>
                <p className="text-slate-500 mt-2">Explore opportunities by location</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-12 mb-8 text-center">
                <BsGeoAlt className="text-6xl text-blue-600 mx-auto mb-4" />
                <p className="text-slate-700 font-medium">Interactive map visualization</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {locations.map(location => (
                    <motion.div key={location.city} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-6 border-2 border-slate-200 cursor-pointer">
                        <h3 className="text-lg font-bold text-slate-900">{location.city}</h3>
                        <p className="text-sm text-slate-500 mb-4">{location.state}</p>
                        <div className="space-y-2">
                            <p className="text-sm"><span className="font-bold">{location.jobs}</span> jobs</p>
                            <p className="text-sm text-green-600 font-bold">${location.avgSalary}/mo</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${location.competition === "High" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
                                {location.competition}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
