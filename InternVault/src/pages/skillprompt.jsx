import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

export function SkillPrompt() {
  const [copiedId, setCopiedId] = useState(null);

  const skills = [
    "Python", "JavaScript", "Java", "HTML & CSS", "React", "Node.js",
    "SQL", "Data Structures", "Machine Learning", "AI Concepts",
    "Cloud Computing", "Cybersecurity", "DevOps"
  ];

  const basePrompt = (skill) => `
You are my personal Skill Coach. Teach me the skill: **${skill}**
Explain everything in a simple, beginner-friendly way as if I am learning from zero.

1. Explain Like I'm 10 (ELI10)
2. Prerequisite concepts
3. Step-by-step roadmap (Beginner → Intermediate → Advanced)
4. Hands-on examples
5. Projects for all levels
6. 30-Day learning plan
7. Real-world use cases
8. Interview Q&A
9. Common mistakes
10. Final summary checklist

Start now by teaching me: **${skill}**
`;

  const copyPrompt = async (skill, id) => {
    await navigator.clipboard.writeText(basePrompt(skill));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          AI Learning <span className="text-blue-600">Assistant</span>
        </h1>
        <p className="text-gray-500">
          Select a topic below and copy the prompt to use with ChatGPT or Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {skills.map((skill, index) => (
          <button
            key={index}
            onClick={() => copyPrompt(skill, index)}
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 text-left flex flex-col justify-between h-32"
          >
            <h2 className="text-lg font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
              {skill}
            </h2>

            <div className={`mt-auto self-start flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-300
              ${copiedId === index ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
              {copiedId === index ? <FaCheck /> : <FaCopy />}
              {copiedId === index ? "Copied" : "Copy Prompt"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
