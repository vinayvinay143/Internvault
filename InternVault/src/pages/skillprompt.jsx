import { useState } from "react";
import { FaCopy } from "react-icons/fa";

export function SkillPrompt() {
  const [copiedId, setCopiedId] = useState(null);

  const skills = [
    "Python",
    "JavaScript",
    "Java",
    "HTML & CSS",
    "React",
    "Node.js",
    "SQL",
    "Data Structures & Algorithms",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud (AWS / Azure / GCP)",
    "Cybersecurity",
    "DevOps",
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        SkillVault – AI Learning Prompts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center gap-4 hover:shadow-xl transition border border-gray-200"
          >
            <h2 className="text-xl font-semibold">{skill}</h2>

            <button
              onClick={() => copyPrompt(skill, index)}
              className="flex items-center gap-2 px-4 py-2 rounded-full 
              bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <FaCopy />
              {copiedId === index ? "Copied!" : "Copy Prompt"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
