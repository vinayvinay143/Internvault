import { useState, useEffect } from "react";
import { BsArrowUpRight, BsBriefcase, BsBuilding, BsLock, BsExclamationTriangle, BsGlobe, BsShieldCheck, BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";

export function Internship({ isLoggedIn }) {
  const [joobleJobs, setJoobleJobs] = useState([]);
  const [internsignalJobs, setInternsignalJobs] = useState([]); // This will now hold real ads
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000/api";

  // Static list of Internship Portals
  const internshipPortals = [
    { id: 1, name: "InternGuru", image: "/i1.png", link: "https://internguru.com/" },
    { id: 2, name: "Internshala", image: "/i2.png", link: "https://internshala.com/" },
    { id: 3, name: "Unstop", image: "/i3.png", link: "https://unstop.com/internship-portal" },
    { id: 4, name: "National Internship Portal", image: "/i4.png", link: "https://internship.aicte-india.org/index.php" },
    { id: 5, name: "Apna", image: "/i5.png", link: "https://apna.co/" },
    { id: 6, name: "Glassdoor", image: "/i6.png", link: "https://www.glassdoor.co.in/index.htm/" },
    { id: 7, name: "Foundit", image: "/i7.png", link: "https://www.foundit.in/" },
    { id: 8, name: "Smart Internz", image: "/i8.png", link: "https://skillwallet.smartinternz.com/virtual-internship-programs/" },
  ];

  // Function to fetch Jooble Jobs
  const fetchJoobleJobs = async () => {
    try {
      const apiKey = import.meta.env.VITE_JOOBLE_API_KEY;
      if (!apiKey || apiKey === "YOUR_JOOBLE_KEY_HERE") return;

      const response = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: "internship", location: "Remote" }),
      });

      if (!response.ok) throw new Error("Failed to fetch Jooble jobs");
      const data = await response.json();
      setJoobleJobs(data.jobs || []);
    } catch (error) {
      setJoobleJobs([]);
    }
  };

  // Mock Data for Premium Jobs
  const MOCK_PREMIUM_JOBS = [
    { id: "pj1", title: "Software Engineer Intern", company: "Google", location: "Mountain View, CA", link: "https://careers.google.com/students/" },
    { id: "pj2", title: "Frontend Developer Intern", company: "Netflix", location: "Los Gatos, CA", link: "https://jobs.netflix.com/" },
    { id: "pj3", title: "Cloud Infrastructure Intern", company: "AWS", location: "Seattle, WA", link: "https://www.amazon.jobs/en/teams/internships-for-students" },
    { id: "pj4", title: "Product Design Intern", company: "Airbnb", location: "San Francisco, CA", link: "https://careers.airbnb.com/university/" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isLoggedIn) {
        await fetchJoobleJobs();

        // Fetch Real Active Ads from Backend
        try {
          const response = await axios.get(`${API_URL}/ads/active`);
          setInternsignalJobs(response.data);
        } catch (error) {
          console.error("Failed to fetch verified ads", error);
          setInternsignalJobs(MOCK_PREMIUM_JOBS); // Fallback
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [isLoggedIn]);

  // Render Job Card
  const renderJobCard = (job, isPremium = false) => {
    const isFake = job.type === "Unverified"; // Legacy check
    const isVerified = job.verificationStatus === 'Verified';
    const isFlagged = job.verificationStatus === 'Flagged';

    let title = job.title || "Internship Opportunity";
    let company = job.company || job.companyName || "Unknown Company";
    let link = job.link || job.url || "#";
    let location = job.location || "Remote";
    let imageUrl = job.imageUrl || "";

    return (
      <div
        key={job.id || link}
        className={`group relative bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between h-full border border-gray-100
          ${isPremium
            ? "shadow-[0_4px_20px_rgba(250,204,21,0.15)] hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)] hover:-translate-y-1"
            : "shadow-sm hover:shadow-xl hover:-translate-y-1"
          }
          ${isFake && "opacity-75 grayscale hover:grayscale-0"}
        `}
      >
        {isPremium && (
          <div className="absolute top-0 right-0 p-3 flex gap-2">
            {isVerified && (
              <div className="bg-green-100/90 backdrop-blur-sm text-green-700 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                <BsShieldCheck className="text-sm" /> Verified
              </div>
            )}
            {isFlagged && (
              <div className="bg-red-100/90 backdrop-blur-sm text-red-700 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                <BsExclamationTriangle className="text-sm" /> Flagged
              </div>
            )}
          </div>
        )}

        <div>
          {/* Icon / Logo Area */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-transform group-hover:scale-110 border overflow-hidden
              ${isPremium ? "bg-white border-blue-100" : isFake ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"}
           `}>
            {imageUrl ? <img src={imageUrl} alt={company} className="w-full h-full object-cover" /> : (isPremium ? <BsBriefcase className="text-blue-600" /> : <BsBriefcase />)}
          </div>

          {/* Content */}
          <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h4>

          <div className="space-y-2 mb-6">
            <p className="text-gray-600 font-medium flex items-center gap-2">
              <BsBuilding className="text-xs opacity-50" /> {company}
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <BsGlobe className="text-xs opacity-50" /> {location}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all
            ${isPremium
              ? "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200"
              : isFake
                ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg"
            }
          `}
        >
          {isFake ? "View Details" : "Apply Now"} <BsArrowUpRight className="text-sm font-bold" />
        </a>
      </div>
    );
  };

  // Render Portal Card
  const renderPortalCard = (portal) => (
    <div
      key={portal.id}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col items-center text-center h-full"
    >
      <div className="w-16 h-16 mb-4 relative flex items-center justify-center">
        <img
          src={portal.image}
          alt={portal.name}
          className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
        />
      </div>

      <h4 className="text-gray-900 font-bold mb-1">{portal.name}</h4>
      <p className="text-xs text-gray-400 mb-4">External Platform</p>

      <a
        href={portal.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
      >
        Visit Site <BsArrowUpRight className="text-xs" />
      </a>
    </div>
  );

  return (
    <div className="container mx-auto px-5 py-12 mt-16 min-h-screen bg-white">

      {/* 🟢 LOGGED IN VIEW */}
      {isLoggedIn ? (
        <div className="animate-fade-in space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Opportunities</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Verified, high-quality internships from top-tier companies.
            </p>
          </div>

          {/* Premium Jobs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {internsignalJobs.map((job) => renderJobCard(job, true))}
            {loading && <p className="col-span-full text-center text-gray-400">Loading premium jobs...</p>}
          </div>

          {/* Latest Openings (API) */}
          {joobleJobs.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span> Latest Remote Openings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {joobleJobs.map((job) => renderJobCard(job))}
              </div>
            </div>
          )}

          {/* External Portals Section - Clean List Only */}
          <div className="border-t border-gray-100 pt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Explore More Opportunities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {internshipPortals.map((portal) => (
                <div
                  key={portal.id}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col items-center text-center h-full"
                >
                  <div className="w-full h-64 mb-6 relative flex items-center justify-center p-2">
                    <img
                      src={portal.image}
                      alt={portal.name}
                      className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{portal.name}</h4>

                  <a
                    href={portal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Visit Platform <BsArrowUpRight className="text-sm font-bold" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 🔴 NOT LOGGED IN VIEW - REFINED */
        <div className="animate-fade-in pb-20">
          <div className="text-center py-20 px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Find Your <span className="text-blue-600">Dream Internship</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Unlock exclusive access to verified premium listings from top tech companies.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition shadow-xl hover:-translate-y-1"
              >
                Login to Access Premium
              </Link>
            </div>
          </div>

          {/* Feature Highlights - Removed to simplify */}

          {/* Clean Portals Grid - 4 Columns */}
          <div id="portals" className="max-w-7xl mx-auto px-4">
            <h3 className="text-center text-gray-400 font-bold uppercase tracking-wider text-sm mb-12">
              Trusted Platforms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {internshipPortals.map((portal) => (
                <div
                  key={portal.id}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col items-center text-center h-full"
                >
                  <div className="w-full h-64 mb-6 relative flex items-center justify-center p-2">
                    <img
                      src={portal.image}
                      alt={portal.name}
                      className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{portal.name}</h4>

                  <a
                    href={portal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Visit Platform <BsArrowUpRight className="text-sm font-bold" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
