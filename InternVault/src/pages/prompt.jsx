import { useState } from "react";
import { FiCopy, FiCheck, FiCommand } from "react-icons/fi";

export function Prompts() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const prompts = [
    {
      id: 1,
      title: "Find Internship Opportunities",
      text: "Give me a list of active internships for computer science students with remote options and a monthly stipend.",
    },
    {
      id: 2,
      title: "Write Cold Email to Recruiter",
      text: "Write a professional cold email to request an internship opportunity at a tech company. Keep it concise and polite.",
    },
    {
      id: 3,
      title: "Prepare for Interview",
      text: "Generate common internship interview questions and best answers for software engineering roles.",
    },
    {
      id: 4,
      title: "Resume Optimization",
      text: "Optimize my resume summary for a data science internship — make it more professional and focused.",
    },
    {
      id: 5,
      title: "Cover Letter Draft",
      text: "Write a short, personalized cover letter for an internship in web development.",
    },
    {
      id: 6,
      title: "LinkedIn Post Idea",
      text: "Give me a LinkedIn post idea to announce that I’m looking for internship opportunities in frontend development.",
    },
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="mt-25 container mx-auto px-5 my-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Career <span className="text-blue-600">Accelerators</span></h1>
        <p className="text-gray-500 max-w-xl mx-auto">Use these prompts to supercharge your job search and application process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prompts.map((prompt, index) => (
          <div
            key={prompt.id}
            onClick={() => handleCopy(prompt.text, index)}
            className="group bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg rounded-3xl p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <FiCommand className="text-6xl text-blue-500 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                {prompt.title}
              </h4>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                "{prompt.text}"
              </p>

              <div className="flex justify-end">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300
                  ${copiedIndex === index ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"}`}>
                  {copiedIndex === index ? <FiCheck /> : <FiCopy />}
                  {copiedIndex === index ? "Copied" : "Copy"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
