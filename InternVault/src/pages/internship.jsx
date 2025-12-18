import { useState, useEffect } from "react";
import { BsArrowUpRight, BsBriefcase, BsBuilding, BsLock, BsExclamationTriangle, BsGlobe } from "react-icons/bs";
import { Link } from "react-router-dom";

export function Internship({ isLoggedIn }) {
  const [joobleJobs, setJoobleJobs] = useState([]);
  const [internsignalJobs, setInternsignalJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fake / Generic External Jobs (To be avoided/contrasted)
  const FAKE_EXTERNAL_JOBS = [
    { id: "f1", title: "Social Media Intern (Unpaid)", company: "StartUp X", location: "Remote", type: "Unverified" },
    { id: "f2", title: "Data Entry Volunteer", company: "Generic Corp", location: "Anywhere", type: "Unverified" },
    { id: "f3", title: "Campus Ambassador", company: "Viral Marketing Ltd", location: "Campus", type: "Unverified" },
    { id: "f4", title: "Content Writer Trainee", company: "BlogNetwork", location: "Remote", type: "Unverified" },
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
        setInternsignalJobs(MOCK_PREMIUM_JOBS);
      }
      setLoading(false);
    };
    fetchData();
  }, [isLoggedIn]);

  // Render Job Card
  // Render Job Card
  const renderJobCard = (job, isPremium = false) => {
    const isFake = job.type === "Unverified";
    let title = job.title;
    let company = job.company || job.company_name || "Unknown Company";
    let link = job.link || job.url || "#";
    let location = job.location || "Remote";

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
          <div className="absolute top-0 right-0 p-3">
            <div className="bg-yellow-100/50 backdrop-blur-sm text-yellow-700 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-yellow-200">
              Premium
            </div>
          </div>
        )}

        <div>
          {/* Icon / Logo Area */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-transform group-hover:scale-110
              ${isPremium ? "bg-yellow-50 text-yellow-600" : isFake ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"}
           `}>
            {isPremium ? <BsBuilding /> : isFake ? <BsExclamationTriangle /> : <BsBriefcase />}
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
      className="bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 h-40 bg-gray-50">
        <img
          src={portal.image}
          alt={portal.name}
          className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition duration-500 mix-blend-multiply"
        />
      </div>

      <div className="flex items-center justify-between px-2">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{portal.name}</h4>
          <p className="text-xs text-gray-400">External Platform</p>
        </div>
        <a
          href={portal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-gray-200 p-2.5 rounded-full text-gray-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300"
        >
          <BsArrowUpRight className="text-lg" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-5 py-12 mt-16 min-h-screen bg-gray-50/50">

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

          {/* External / Unverified Section */}
          <div className="bg-gray-100 rounded-[2.5rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <BsExclamationTriangle className="text-orange-500" /> External Portals & Listings
                </h3>
                <p className="text-gray-500 max-w-xl">
                  These opportunities are aggregated from external sources. Please verify them independently before applying.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Fake Jobs */}
              {FAKE_EXTERNAL_JOBS.map((job) => renderJobCard(job))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {/* Portals */}
              {internshipPortals.map(renderPortalCard)}
            </div>
          </div>
        </div>
      ) : (
        /* 🔴 NOT LOGGED IN VIEW */
        <div className="animate-fade-in pb-20">
          <div className="text-center mb-20">
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              🚀 Launch Your Career
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Unlock Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Internship</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Access exclusive premium listings from Google, Netflix, and more. Stop searching, start applying.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <BsLock className="text-lg" /> Login to Unlock Premium
            </Link>
          </div>

          {/* Public Portals Grid */}
          <div className="mb-12">
            <h3 className="text-center text-gray-400 font-semibold uppercase tracking-wider text-sm mb-10">
              Aggregated from top platforms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
              {internshipPortals.map(renderPortalCard)}
            </div>
          </div>


          {/* Fake External Listing Teaser - Mixed in */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="relative">
              {/* Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-white/0 via-white/80 to-white pt-20">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                    <BsLock />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">500+ Premium Jobs Hidden</h4>
                  <p className="text-gray-500 mb-8">
                    You are viewing generic external listings. Log in to see verified premium opportunities.
                  </p>
                  <Link to="/login" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                    Login to View All
                  </Link>
                </div>
              </div>

              {/* Blurred Grid of Fake Jobs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 blur-sm select-none opacity-60">
                {[...FAKE_EXTERNAL_JOBS, ...FAKE_EXTERNAL_JOBS].map((job, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
