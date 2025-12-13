// import { BsArrowUpRight } from "react-icons/bs";

// export function Internship() {
//   const internships = [
//     {
//       id: 1,
//       name: "InternGuru",
//       image: "/i1.png",
//       link: "https://internguru.com/",
//     },
//     {
//       id: 2,
//       name: "Internshala",
//       image: "/i2.png",
//       link: "https://internshala.com/",
//     },
//     {
//       id: 3,
//       name: "Unstop",
//       image: "/i3.png",
//       link: "https://unstop.com/internship-portal",
//     },
//     {
//       id: 4,
//       name: "National Internship Portal",
//       image: "/i4.png",
//       link: "https://internship.aicte-india.org/index.php",
//     },
//      {
//       id: 5,
//       name: "Apna",
//       image: "/i5.png",
//       link: "https://apna.co/",
//     },
//     {
//       id: 6,
//       name: "Glassdoor",
//       image: "/i6.png",
//       link: "https://www.glassdoor.co.in/index.htm/",
//     },
//     {
//       id: 7,
//       name: "Foundit",
//       image: "/i7.png",
//       link: "https://www.foundit.in/",
//     },
//     {
//       id: 8,
//       name: "Smart Internz",
//       image: "/i8.png",
//       link: "https://skillwallet.smartinternz.com/virtual-internship-programs/",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-5 my-10">
//       {internships.map((intern) => (
//         <div
//           key={intern.id}
//           className="bg-white shadow-lg rounded-2xl p-3 hover:shadow-2xl transition"
//         >
//           {/* IMAGE + ICON OVERLAY */}
//           <div className="relative">
//             <img
//               src={intern.image}
//               alt={intern.name}
//               className="rounded-xl mb-4 w-full h-48 object-cover"
//             />

//             {/* Icon Button (Bottom-right) */}
//             <a
//               href={intern.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
//             >
//               <BsArrowUpRight className="text-xl" />
//             </a>
//           </div>

//           {/* TITLE */}
//           <h4 className="text-lg font-semibold text-center mb-2">
//             {intern.name}
//           </h4>
//         </div>
//       ))}
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { BsArrowUpRight, BsBriefcase, BsBuilding } from "react-icons/bs";

export function Internship({ isLoggedIn }) {
  const [joobleJobs, setJoobleJobs] = useState([]);
  const [internsignalJobs, setInternsignalJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch Jooble Jobs
  const fetchJoobleJobs = async () => {
    try {
      const apiKey = import.meta.env.VITE_JOOBLE_API_KEY;
      if (!apiKey || apiKey === "YOUR_JOOBLE_KEY_HERE") {
        // API key not configured, skip fetching
        return;
      }

      // Jooble API typically uses a POST request
      const response = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: "internship",
          location: "Remote", // Defaulting to remote for broader results
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch Jooble jobs");

      const data = await response.json();
      setJoobleJobs(data.jobs || []);
    } catch (error) {
      // Silently handle API errors
      setJoobleJobs([]);
    }
  };

  // Mock Data for Premium Jobs (Replacements for USAJobs API)
  const MOCK_PREMIUM_JOBS = [
    {
      id: "pj1",
      title: "Software Engineer Intern (Remote)",
      company: "Google",
      location: "Mountain View, CA / Remote",
      link: "https://careers.google.com/students/",
    },
    {
      id: "pj2",
      title: "Frontend Developer Intern",
      company: "Netflix",
      location: "Los Gatos, CA",
      link: "https://jobs.netflix.com/",
    },
    {
      id: "pj3",
      title: "Cloud Infrastructure Intern",
      company: "Amazon Web Services (AWS)",
      location: "Seattle, WA / Remote",
      link: "https://www.amazon.jobs/en/teams/internships-for-students",
    },
    {
      id: "pj4",
      title: "Product Design Intern",
      company: "Airbnb",
      location: "San Francisco, CA",
      link: "https://careers.airbnb.com/university/",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchJoobleJobs(); // Keep Jooble real or check if it needs mock too
      // Simulate API delay for premium jobs if needed, or just set immediately
      if (isLoggedIn) {
        setInternsignalJobs(MOCK_PREMIUM_JOBS);
      }
      setLoading(false);
    };
    fetchData();
  }, [isLoggedIn]);

  // Helper to render job cards
  const renderJobCard = (job, isPremium = false) => {
    let title, company, link, location;

    if (isPremium) {
      // Mock Data Structure
      title = job.title;
      company = job.company;
      link = job.link;
      location = job.location;
    } else {
      // Jooble Data Structure
      title = job.title;
      company = job.company || job.company_name || "Unknown Company";
      link = job.link || job.url || "#";
      location = job.location || "Remote";
    }

    return (
      <div
        key={job.id || link}
        className={`bg-white shadow-lg rounded-2xl p-4 hover:shadow-2xl transition flex flex-col justify-between h-full ${isPremium ? "border-2 border-yellow-400" : ""
          }`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <BsBuilding className="text-blue-500 text-xl" />
            </div>
            {isPremium && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">
                Premium
              </span>
            )}
          </div>

          <h4 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{title}</h4>
          <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-2">
            <BsBriefcase /> {company}
          </p>
          <p className="text-sm text-gray-400 mb-4">{location}</p>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition"
        >
          Apply Now <BsArrowUpRight />
        </a>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-5 my-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Internship <span className="text-blue-500">Opportunities</span>
      </h2>

      {/* Internsignal Jobs - Premium Section */}
      {isLoggedIn && internsignalJobs.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            ✨ Premium Opportunities <span className="text-sm font-light text-gray-500">(Internsignal)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {internsignalJobs.map((job) => renderJobCard(job, true))}
          </div>
        </div>
      )}

      {/* Jooble Jobs - Public Section */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Latest Openings <span className="text-sm font-light text-gray-500">(Jooble)</span>
        </h3>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Finding the best roles for you...</p>
          </div>
        ) : joobleJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {joobleJobs.map((job) => renderJobCard(job))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No jobs found directly. Please check your API keys or try again later.</p>
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Want access to premium listings?</h3>
          <p className="mb-6 opacity-90">Login now to unlock exclusive internship opportunities from top tech companies.</p>
          {/* You can link to login here if needed */}
        </div>
      )}
    </div>
  );
}
