import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-5 my-10">
      {prompts.map((prompt, index) => (
        <div
          key={prompt.id}
          onClick={() => handleCopy(prompt.text, index)}
          className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-1"
        >
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            {prompt.title}
          </h4>
          <p className="text-sm text-gray-600 mb-4">{prompt.text}</p>
          <div className="flex justify-end items-center">
            {copiedIndex === index ? (
              <span className="flex items-center text-green-600 gap-1 text-sm">
                <FiCheck /> Copied!
              </span>
            ) : (
              <span className="flex items-center text-blue-500 gap-1 text-sm">
                <FiCopy /> Copy
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
