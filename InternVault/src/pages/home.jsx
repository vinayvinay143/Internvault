import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  BsStar
} from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import ImageSlider from "../components/ImageSlider";
import SkillVaultSlider from "../components/SkillVaultSlider";
import ToolsSlider from "../components/ToolsSlider";
import { NewsTicker } from "../components/NewsTicker";
import s16 from "../images/s16.png";

const API_URL = "http://localhost:5000/api";

export function Home() {
  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAds, setDismissedAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser);

    fetchActiveAds();
  }, []);

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

  const dismissAd = (adId) => {
    setDismissedAds([...dismissedAds, adId]);
    setCurrentAdIndex(0);
  };

  const visibleAds = activeAds.filter(ad => !dismissedAds.includes(ad._id));

  useEffect(() => {
    if (visibleAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % visibleAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [visibleAds.length]);

  const currentAd = visibleAds[currentAdIndex];

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
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="mt-16 bg-slate-50 text-slate-900 font-sans overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-5xl mx-auto"
        >


          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Unlock Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              Dream Career
              <svg className="absolute w-full h-2 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            Connect with top-tier companies, verify your skills, and land the internship you deserve. <span className="text-slate-900 font-semibold">Fast. Secure. Verified.</span>
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            {!isLoggedIn && (
              <Link to="/signup" className="group relative px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-base overflow-hidden shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  Start Your Journey
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
            <Link to="/internships" className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md">
              Browse Opportunities
            </Link>
          </motion.div>

          {/* Floaters Decoration */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 1, duration: 1 } }
            }}
            className="absolute top-1/2 left-0 w-full h-full pointer-events-none hidden lg:block"
          >
            {/* Left Floater */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="absolute top-0 left-10 p-3 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <BsShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Status</p>
                <p className="text-xs font-bold text-slate-800">Verified Offer</p>
              </div>
            </motion.div>

            {/* Right Floater */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="absolute top-20 right-10 p-3 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <BsLightningCharge size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Speed</p>
                <p className="text-xs font-bold text-slate-800">Instant Apply</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Highlights - Replacements for Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 py-8 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm rounded-3xl"
          >
            {[
              { label: "AI Matching", value: "Smart Search", icon: <BsStars />, color: "text-amber-500", bg: "bg-amber-100" },
              { label: "Verification", value: "100% Genuine", icon: <BsShieldCheck />, color: "text-green-600", bg: "bg-green-100" },
              { label: "Cost", value: "Always Free", icon: <BsPeople />, color: "text-blue-600", bg: "bg-blue-100" },
              { label: "Upskilling", value: "Real Projects", icon: <BsCodeSquare />, color: "text-purple-600", bg: "bg-purple-100" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-medium">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* Value Props */}
      <section className="my-32 py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-slate-900">Premium Features for <br />Premium Careers</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We've reimagined the internship search experience to put you in control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BsShieldCheck className="text-3xl text-white" />,
                title: "100% Verified Listings",
                desc: "Every opportunity is manually vetted by our team and AI. No outdated listings, no scams, just real jobs.",
                color: "bg-blue-500",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: <BsCodeSquare className="text-3xl text-white" />,
                title: "Skill Validation",
                desc: "Prove your worth with our built-in skill assessments. Stand out to recruiters with verified badges.",
                color: "bg-purple-500",
                gradient: "from-purple-500 to-indigo-600"
              },
              {
                icon: <GoOrganization className="text-3xl text-white" />,
                title: "Direct Access",
                desc: "Skip the black hole. Apply directly to hiring managers and get feedback on your applications.",
                color: "bg-emerald-500",
                gradient: "from-emerald-500 to-teal-600"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group p-1 rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-white hover:from-blue-100 hover:to-indigo-100 transition-colors duration-500"
              >
                <div className="bg-white p-6 h-full rounded-[1.3rem] relative overflow-hidden">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Verification Section */}
      <section className="my-32 py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start order-2 lg:order-1"
            >
              <ImageSlider />
            </motion.div>

            {/* Right Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left order-1 lg:order-2"
            >


              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Still Don't Know Which One is{" "}
                <motion.span
                  initial={{ backgroundPosition: "200% center" }}
                  animate={{ backgroundPosition: "-200% center" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto]"
                >
                  Real or Fake?
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                Don't risk your career with fake internship offers. Our AI-powered chatbot analyzes company details, reviews, and registration data to give you instant verification results.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link
                  to="/internchat"
                  className="group inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors duration-300"
                >
                  Try Our InternChatbot
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>


      </section>

      {/* SkillVault Section */}
      <section className="my-32 py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left order-1"
            >

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Still Stuck on{" "}
                <motion.span
                  initial={{ backgroundPosition: "200% center" }}
                  animate={{ backgroundPosition: "-200% center" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto]"
                >
                  What to Learn?
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                Don't have the skills to apply for internships? No worries! Visit our SkillVault to discover curated learning paths, hands-on projects, and resources to build job-ready skills.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/skillvault"
                  className="group inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors duration-300"
                >
                  Explore SkillVault
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end order-2"
            >
              <SkillVaultSlider />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="my-32 py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start order-2 lg:order-1"
            >
              <ToolsSlider />
            </motion.div>

            {/* Right Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left order-1 lg:order-2"
            >

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Need the Right{" "}
                <motion.span
                  initial={{ backgroundPosition: "200% center" }}
                  animate={{ backgroundPosition: "-200% center" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto]"
                >
                  Tools to Succeed?
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                Discover essential tools and resources to boost your productivity. From project templates to interview prep, we've got everything you need to stand out.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/tools"
                  className="group inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors duration-300"
                >
                  Explore Tools
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Internship Hosting Section */}
      <section className="my-32 py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left order-1"
            >

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Found a Verified{" "}
                <motion.span
                  initial={{ backgroundPosition: "200% center" }}
                  animate={{ backgroundPosition: "-200% center" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto]"
                >
                  Internship?
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                You don't need to be a recruiter to help! Students can host and share verified internship opportunities they've found. Contribute to the community by posting authentic roles for your peers.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/host"
                  className="group inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors duration-300"
                >
                  Share an Internship
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end order-2"
            >
              <div className="w-full max-w-[600px]">
                <img
                  src={s16}
                  alt="Host internships on InternVault"
                  className="hosting-image w-full h-auto object-contain"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Live Notification Popup */}
      <AnimatePresence mode="wait">
        {!loading && currentAd && (
          <motion.div
            key={currentAd._id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => dismissAd(currentAd._id)}
              className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm hover:bg-red-50 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 transition-all z-10 shadow-sm"
              aria-label="Dismiss notification"
            >
              <BsX className="text-lg" />
            </button>

            {/* Minimal horizontal layout */}
            <div className="flex items-center gap-3 p-4">
              {/* Compact logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                {currentAd.imageUrl ? (
                  <img
                    src={currentAd.imageUrl}
                    alt={currentAd.companyName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BsBriefcase className="text-xl text-blue-600" />
                )}
              </div>

              {/* Compact content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-semibold text-green-700">
                    {Math.max(0, Math.floor((new Date(currentAd.expiresAt) - new Date()) / (1000 * 60 * 60)))}h left
                  </span>
                  {currentAd.verificationStatus === 'Verified' && (
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      <BsShieldCheck /> Verified
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-gray-900 text-sm leading-tight truncate mb-0.5">
                  {currentAd.companyName}
                </h4>

                <p className="text-xs text-gray-500">New internship opportunity</p>
              </div>

              {/* Compact action button */}
              <a
                href={currentAd.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                Apply
                <BsArrowUpRight className="text-xs" />
              </a>
            </div>

            {/* Progress indicator for multiple ads */}
            {visibleAds.length > 1 && (
              <div className="flex gap-1 px-4 pb-3">
                {visibleAds.map((_, index) => (
                  <div
                    key={index}
                    className={`h-0.5 flex-1 rounded-full transition-all ${index === currentAdIndex ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* News Ticker */}
      <NewsTicker />

    </div>
  );
}
