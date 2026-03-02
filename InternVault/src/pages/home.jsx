import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BsArrowRight,
  BsShieldCheck,
  BsLightningCharge,
  BsCodeSquare,
  BsStars,
  BsPeople,
  BsBuildings,
  BsBriefcase,
  BsArrowUpRight,
  BsX,
  BsStar,
  BsSearch,
  BsGraphUp,
  BsPersonPlus,
  BsFileEarmarkText,
  BsSend,
  BsMic,
  BsBullseye,
  BsChatDots,
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsHeart
} from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import ImageSlider from "../components/ImageSlider";
import { NewsTicker } from "../components/NewsTicker";
import { WelcomeAnimation } from "../components/WelcomeAnimation";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function Home() {
  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAds, setDismissedAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* New Internship Notification Logic */
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const fetchActiveAds = async () => {
    try {
      const response = await axios.get(`${API_URL}/ads/active`);
      setActiveAds(response.data);
    } catch (error) {
      console.error("Error fetching active ads:", error);
      setActiveAds([]);
    } finally {
      setLoading(false);
    }
  };

  /* Unified Notification Logic - Cycling (TPO + Ads + Recruiter) */
  const fetchUnseenInternships = async () => {
    try {
      const [tpoResponse, adsResponse, recruiterResponse, codeResponse] = await Promise.allSettled([
        axios.get(`${API_URL}/tpo/internships/all/active`),
        axios.get(`${API_URL}/ads/active`),
        axios.get(`${API_URL}/recruiter/internships/active`),
        axios.get(`${API_URL}/student/code-challenges`)
      ]);

      let tpoInternships = [];
      let adInternships = [];
      let recruiterInternships = [];
      let codeChallenges = [];

      if (tpoResponse.status === 'fulfilled' && tpoResponse.value.data) {
        tpoInternships = tpoResponse.value.data;
      }

      if (adsResponse.status === 'fulfilled' && adsResponse.value.data) {
        adInternships = adsResponse.value.data;
      }

      if (recruiterResponse.status === 'fulfilled' && recruiterResponse.value.data) {
        recruiterInternships = recruiterResponse.value.data.map(job => ({
          ...job,
          isRecruiter: true
        }));
      }

      if (codeResponse.status === 'fulfilled' && codeResponse.value.data) {
        codeChallenges = codeResponse.value.data.map(challenge => ({
          ...challenge,
          isCodeChallenge: true,
          companyName: challenge.companyName || "Code Challenge"
        }));
      }

      // Merge and sort by createdAt desc (newest first)
      const allInternships = [...tpoInternships, ...adInternships, ...recruiterInternships, ...codeChallenges].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Get seen IDs from local storage
      const storedSeenIds = localStorage.getItem("seenInternshipIds");
      let seenIds = [];
      try {
        seenIds = storedSeenIds ? JSON.parse(storedSeenIds) : [];
        if (!Array.isArray(seenIds)) seenIds = [];
      } catch (e) {
        console.error("Error parsing seen IDs", e);
        seenIds = [];
      }

      const storedUser = localStorage.getItem("user");
      let currentUserId = null;
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          currentUserId = userObj._id || userObj.id;
        } catch (e) {
          console.error("Error parsing user", e);
        }
      }

      const unseen = allInternships.filter(item => {
        // Filter out own posts
        const tpoIdToCompare = item.tpoId?._id || item.tpoId;
        const userIdToCompare = item.userId;
        const recruiterIdToCompare = item.recruiterId;
        const isHost = (tpoIdToCompare && String(tpoIdToCompare) === String(currentUserId)) ||
          (userIdToCompare && String(userIdToCompare) === String(currentUserId)) ||
          (recruiterIdToCompare && String(recruiterIdToCompare) === String(currentUserId));

        if (isHost) return false;

        // Filter out seen
        return !seenIds.includes(item._id);
      });

      console.log(`Found ${unseen.length} unseen internships`);
      setNotificationQueue(unseen);

    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification && !showNotification) {
      setCurrentNotification(notificationQueue[0]);
      setShowNotification(true);
    }
  }, [notificationQueue, currentNotification, showNotification]);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const loggedIn = !!storedUser;
    setIsLoggedIn(loggedIn);

    // Get user details
    let userObj = null;
    if (storedUser) {
      try {
        userObj = JSON.parse(storedUser);
        setUser(userObj);
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }

    fetchActiveAds();
    if (loggedIn && userObj) {
      if (userObj.role === 'recruiter') {
        navigate("/recruiter/dashboard");
      } else {
        fetchUnseenInternships();
      }
    }
  }, []);

  const visibleAds = activeAds.filter(ad => !dismissedAds.includes(ad._id));

  useEffect(() => {
    if (visibleAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % visibleAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [visibleAds.length]);

  const dismissNotification = () => {
    setShowNotification(false);
    if (currentNotification) {
      // Add to seen list in localStorage
      const storedSeenIds = localStorage.getItem("seenInternshipIds");
      let seenIds = [];
      try {
        seenIds = storedSeenIds ? JSON.parse(storedSeenIds) : [];
        if (!Array.isArray(seenIds)) seenIds = [];
      } catch (e) { seenIds = []; }

      if (!seenIds.includes(currentNotification._id)) {
        const newSeenIds = [...seenIds, currentNotification._id];
        localStorage.setItem("seenInternshipIds", JSON.stringify(newSeenIds));
      }

      // Remove from queue after delay for animation
      setTimeout(() => {
        setNotificationQueue(prev => prev.slice(1));
        setCurrentNotification(null);
      }, 300);
    }
  };

  // Render content based on user role
  const renderContent = () => {
    // 1. PUBLIC VIEW (Not Logged In)
    if (!isLoggedIn || !user) {
      return (
        <>
          {/* Hero Section - Vibrant Gradient Design */}
          <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-32 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">
              {/* Decorative Circles */}
              <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Wavy Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <path d="M0,64 C360,20 720,20 1080,64 C1260,86 1350,96 1440,96 L1440,120 L0,120 Z" fill="#f8fafc" />
              </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Discover Your Perfect <br />
                  <span className="text-cyan-300">Internship Match</span>
                </h1>

                <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed max-w-xl">
                  Connect with verified companies, build your skills, and launch your career with confidence. Everything you need in one platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/internships"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 text-center"
                  >
                    Explore Internships
                  </Link>
                </div>
              </motion.div>

              {/* Right Illustration Area - Laptop Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:flex items-center justify-center"
              >
                <div className="relative w-full h-[500px]">
                  {/* Laptop Mockup */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px]"
                  >
                    {/* Laptop Screen */}
                    <div className="relative bg-slate-800 rounded-t-2xl p-3 shadow-2xl">
                      {/* Screen Content */}
                      <div className="bg-white rounded-lg overflow-hidden h-64">
                        {/* Mock Dashboard */}
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 h-full">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                              <div className="text-xs font-bold text-slate-700 font-brand">InternVault</div>
                            </div>
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                          </div>

                          {/* Dashboard Cards */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white rounded-lg p-2 shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <BsBriefcase className="text-blue-600 text-xs" />
                                </div>
                                <div className="text-[10px] font-semibold text-slate-700">Internships</div>
                              </div>
                              <div className="text-lg font-bold text-slate-900">5,000+</div>
                            </div>
                            <div className="bg-white rounded-lg p-2 shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                  <BsShieldCheck className="text-purple-600 text-xs" />
                                </div>
                                <div className="text-[10px] font-semibold text-slate-700">Verified</div>
                              </div>
                              <div className="text-lg font-bold text-slate-900">100%</div>
                            </div>
                          </div>

                          {/* Chart Visualization */}
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <div className="flex items-end gap-1 h-16">
                              <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t" style={{ height: '60%' }}></div>
                              <div className="flex-1 bg-gradient-to-t from-purple-400 to-purple-300 rounded-t" style={{ height: '80%' }}></div>
                              <div className="flex-1 bg-gradient-to-t from-indigo-400 to-indigo-300 rounded-t" style={{ height: '70%' }}></div>
                              <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t" style={{ height: '90%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Laptop Base */}
                      <div className="h-2 bg-slate-700 rounded-b-2xl"></div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full"></div>
                    </div>
                  </motion.div>

                  {/* Floating Feature Badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-16 right-8 bg-white rounded-xl shadow-lg p-3 w-36"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <BsShieldCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">Scam Free</div>
                        <div className="text-sm font-bold text-slate-900">100%</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-32 left-4 bg-white rounded-xl shadow-lg p-3 w-36"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <BsStars className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">AI Match</div>
                        <div className="text-sm font-bold text-slate-900">Smart</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Decorative circles */}
                  <div className="absolute top-8 left-12 w-20 h-20 bg-blue-300/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-16 right-16 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl"></div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Feature Cards Section - Below Hero */}
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <BsShieldCheck />,
                    title: "Scam-Free Guarantee",
                    desc: "AI-powered verification ensures 100% authentic opportunities",
                    color: "text-green-600",
                    bg: "bg-green-50"
                  },
                  {
                    icon: <BsStars />,
                    title: "Smart AI Matching",
                    desc: "Get personalized internship recommendations based on your profile",
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                  },
                  {
                    icon: <BsLightningCharge />,
                    title: "One-Click Apply",
                    desc: "Apply to multiple internships instantly with your saved profile",
                    color: "text-amber-600",
                    bg: "bg-amber-50"
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Comprehensive Features Section */}
          <section className="my-32 py-16 bg-white relative mx-4 shadow-sm rounded-2xl">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Complete Platform</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 text-slate-900">Everything You Need in One Place</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">From finding internships to landing your dream job - InternVault provides all the tools and resources you need to succeed.</p>
              </div>

              {/* Core Features */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BsBriefcase className="text-blue-600" /> Core Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <BsSearch className="text-2xl" />,
                      title: "Internship Search",
                      desc: "Browse thousands of verified internship opportunities from top companies",
                      link: "/internships",
                      color: "text-blue-600",
                      bg: "bg-blue-50"
                    },
                    {
                      icon: <BsShieldCheck className="text-2xl" />,
                      title: "InternChat - Scam Detector",
                      desc: "AI-powered chatbot to verify company authenticity and detect fake offers",
                      link: "/internchat",
                      color: "text-green-600",
                      bg: "bg-green-50"
                    },
                    {
                      icon: <BsFileEarmarkText className="text-2xl" />,
                      title: "Resume Builder & ATS Optimizer",
                      desc: "Create ATS-friendly resumes and optimize them for maximum impact",
                      link: "/tools",
                      color: "text-purple-600",
                      bg: "bg-purple-50"
                    },
                    {
                      icon: <BsCodeSquare className="text-2xl" />,
                      title: "SkillVault",
                      desc: "Access curated learning roadmaps and skill development resources",
                      link: "/skillvault",
                      color: "text-indigo-600",
                      bg: "bg-indigo-50"
                    }
                  ].map((feature, i) => (
                    <Link
                      key={i}
                      to={feature.link}
                      className="group p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                    >
                      <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm font-semibold">
                        Explore <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Interview & Career Tools */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BsChatDots className="text-purple-600" /> Interview & Career Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <BsChatDots className="text-xl" />,
                      title: "Interview Dojo",
                      desc: "Practice with AI-powered mock interviews",
                      link: "/interview-dojo",
                      color: "text-purple-600",
                      bg: "bg-purple-50"
                    },
                    {
                      icon: <BsLightningCharge className="text-xl" />,
                      title: "Cold Email Generator",
                      desc: "Create personalized outreach emails to recruiters",
                      link: "/cold-email",
                      color: "text-teal-600",
                      bg: "bg-teal-50"
                    },
                    {
                      icon: <BsStars className="text-xl" />,
                      title: "Skill Radar",
                      desc: "Visualize your skill profile and identify gaps",
                      link: "/tools",
                      color: "text-pink-600",
                      bg: "bg-pink-50"
                    },
                    {
                      icon: <BsBuildings className="text-xl" />,
                      title: "News Feed",
                      desc: "Stay updated with latest internship news and trends",
                      link: "/news",
                      color: "text-cyan-600",
                      bg: "bg-cyan-50"
                    }
                  ].map((tool, i) => (
                    <Link
                      key={i}
                      to={tool.link}
                      className="group p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <div className={`w-10 h-10 ${tool.bg} ${tool.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        {tool.icon}
                      </div>
                      <h4 className="font-bold text-base mb-1 text-slate-900">{tool.title}</h4>
                      <p className="text-xs text-slate-600">{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* For Recruiters & TPOs */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BsBuildings className="text-emerald-600" /> For Recruiters & TPOs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <BsFileEarmarkText className="text-2xl" />,
                      title: "Post Internships",
                      desc: "Create and manage internship listings, reach thousands of qualified students",
                      color: "text-blue-600",
                      bg: "bg-blue-50"
                    },
                    {
                      icon: <BsPersonPlus className="text-2xl" />,
                      title: "Applicant Management",
                      desc: "Track, filter, and manage applications with advanced analytics",
                      color: "text-purple-600",
                      bg: "bg-purple-50"
                    },
                    {
                      icon: <BsCodeSquare className="text-2xl" />,
                      title: "Code Challenges",
                      desc: "Create coding assessments and evaluate technical skills",
                      color: "text-indigo-600",
                      bg: "bg-indigo-50"
                    }
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                        {feature.icon}
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Features */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BsStars className="text-amber-500" /> Additional Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Project Showcase", icon: <BsCodeSquare /> },
                    { name: "Favorites & Bookmarks", icon: <BsStar /> },
                    { name: "Student Dashboard", icon: <BsGraphUp /> },
                    { name: "Report Fraud", icon: <BsShieldCheck /> },
                    { name: "Courses & Learning", icon: <BsFileEarmarkText /> },
                    { name: "Skill Assessments", icon: <BsCodeSquare /> },
                    { name: "Host Internships", icon: <BsBriefcase /> },
                    { name: "Real-time Notifications", icon: <BsLightningCharge /> }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="text-blue-600 text-lg">{item.icon}</div>
                      <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-16 text-center">
                <div className="inline-block p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
                  <p className="text-blue-100 mb-6 max-w-md">Join thousands of students who have already found their dream internships through InternVault</p>
                  <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition">
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </section >

          {/* InternChat Section */}

        </>
      );
    }

    // 2. LOGGED IN VIEW (Welcome Animation)
    // Don't show for recruiters
    if (user?.role === 'recruiter') {
      return null;
    }

    return <WelcomeAnimation user={user} />;

    // Default fallback
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Main Content */}
      <div className="relative">

        {/* Dynamic Content Based on Role */}
        {renderContent()}

        {/* New Internship Notification Popup - Unified (Glassmorphism) */}
        <AnimatePresence>
          {isLoggedIn && user?.role !== 'recruiter' && showNotification && currentNotification && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-16 right-6 z-50 w-80 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={dismissNotification}
                className="absolute top-2 right-2 w-6 h-6 text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-full transition-all z-10 flex items-center justify-center"
              >
                <BsX size={18} />
              </button>

              {/* Horizontal compact layout */}
              <div className="flex items-center gap-3 p-3">
                {/* Logo */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-blue-900/10 ${currentNotification.isCodeChallenge ? "bg-gradient-to-br from-purple-500 to-pink-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  } `}>
                  {currentNotification.imageUrl ? (
                    <img src={currentNotification.imageUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                  ) : currentNotification.isCodeChallenge ? (
                    <BsCodeSquare size={20} />
                  ) : (
                    <BsBriefcase size={20} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-xs font-bold text-emerald-700">New Opportunity</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-tight truncate mb-0.5">
                    {currentNotification.title || currentNotification.companyName}
                  </h4>

                  <p className="text-xs text-slate-500 truncate font-medium">
                    {currentNotification.tpoId?.organization || currentNotification.companyName || "Student Hosted"}
                  </p>
                </div>

                {/* Action button */}
                {currentNotification.tpoId || currentNotification.isRecruiter || currentNotification.isCodeChallenge ? (
                  <Link
                    to={currentNotification.isCodeChallenge ? `/code-challenge/${currentNotification._id}` : `/internship/${currentNotification._id}`}
                    onClick={dismissNotification}
                    className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    {currentNotification.isCodeChallenge ? "Solve" : "View"}
                    <BsArrowRight className="text-xs" />
                  </Link>
                ) : (
                  <a
                    href={currentNotification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismissNotification}
                    className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    Apply
                    <BsArrowUpRight className="text-xs" />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* News Ticker - Hide for recruiters */}
        {user?.role !== 'recruiter' && <NewsTicker />}

      </div>

    </div>
  );
}
