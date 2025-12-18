export function Skillhome() {
  return (
    <div className="min-h-screen w-full bg-white p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-3" style={{ color: "hsl(213.3, 96.9%, 40%)" }}>
          🚀 Top Emerging Skills in 2025 – SkillVault
        </h1>

        <p className="text-lg mb-8 opacity-80">
          Stay ahead of the curve. Explore the fastest-growing tech skills globally.
        </p>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-2xl shadow-xl p-6 border border-gray-200 overflow-x-auto bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm uppercase tracking-wider text-gray-600 border-b">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Skill / Area</th>
                <th className="py-3 px-4">Demand Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, skill: "Generative AI (RAG, LLMs, Fine-tuning)", growth: "50–80%" },
                { rank: 2, skill: "AI-driven Cybersecurity (Threat AI, SOC automation)", growth: "50–70%" },
                { rank: 3, skill: "AI/ML Engineering (TensorFlow, PyTorch)", growth: "40–60%" },
                { rank: 4, skill: "Cloud Security (IAM, Zero Trust, SASE)", growth: "40–60%" },
                { rank: 5, skill: "Data Engineering (Spark, Kafka, Airflow)", growth: "35–55%" },
                { rank: 6, skill: "Robotics & Automation (ROS, Mechatronics)", growth: "30–55%" },
                { rank: 7, skill: "Cloud Architecture (Serverless, Microservices)", growth: "30–50%" },
                { rank: 8, skill: "DevOps/SRE (Kubernetes, Terraform, CI/CD)", growth: "30–50%" },
                { rank: 9, skill: "Rust & Go Programming", growth: "35–50%" },
                { rank: 10, skill: "Full-Stack / Web Development (React, Next.js)", growth: "30–45%" },
                { rank: 11, skill: "Data Science (SQL, Pandas, ML modeling)", growth: "30–45%" },
                { rank: 12, skill: "Cloud Computing (AWS, Azure, GCP)", growth: "25–45%" },
                { rank: 13, skill: "AR/VR & Spatial Computing (Unity, Unreal)", growth: "25–45%" },
                { rank: 14, skill: "Core Security Roles (Network, Endpoint)", growth: "30–50%" },
                { rank: 15, skill: "Programming Languages (Python, TypeScript)", growth: "25–40%" },
                { rank: 16, skill: "Mobile Development (Flutter, Kotlin)", growth: "20–35%" },
                { rank: 17, skill: "Blockchain / Web3 (Solidity)", growth: "20–30%" },
                { rank: 18, skill: "Edge Computing / IoT Cloud", growth: "20–40%" },
                { rank: 19, skill: "Quantum Computing (Qiskit)", growth: "15–30%" }
              ].map((item) => (
                <tr
                  key={item.rank}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-bold text-blue-700">{item.rank}</td>
                  <td className="py-3 px-4">{item.skill}</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{item.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {[
            { rank: 1, skill: "Generative AI (RAG, LLMs, Fine-tuning)", growth: "50–80%" },
            { rank: 2, skill: "AI-driven Cybersecurity (Threat AI, SOC automation)", growth: "50–70%" },
            { rank: 3, skill: "AI/ML Engineering (TensorFlow, PyTorch)", growth: "40–60%" },
            { rank: 4, skill: "Cloud Security (IAM, Zero Trust, SASE)", growth: "40–60%" },
            { rank: 5, skill: "Data Engineering (Spark, Kafka, Airflow)", growth: "35–55%" },
            { rank: 6, skill: "Robotics & Automation (ROS, Mechatronics)", growth: "30–55%" },
            { rank: 7, skill: "Cloud Architecture (Serverless, Microservices)", growth: "30–50%" },
            { rank: 8, skill: "DevOps/SRE (Kubernetes, Terraform, CI/CD)", growth: "30–50%" },
            { rank: 9, skill: "Rust & Go Programming", growth: "35–50%" },
            { rank: 10, skill: "Full-Stack / Web Development (React, Next.js)", growth: "30–45%" },
            { rank: 11, skill: "Data Science (SQL, Pandas, ML modeling)", growth: "30–45%" },
            { rank: 12, skill: "Cloud Computing (AWS, Azure, GCP)", growth: "25–45%" },
            { rank: 13, skill: "AR/VR & Spatial Computing (Unity, Unreal)", growth: "25–45%" },
            { rank: 14, skill: "Core Security Roles (Network, Endpoint)", growth: "30–50%" },
            { rank: 15, skill: "Programming Languages (Python, TypeScript)", growth: "25–40%" },
            { rank: 16, skill: "Mobile Development (Flutter, Kotlin)", growth: "20–35%" },
            { rank: 17, skill: "Blockchain / Web3 (Solidity)", growth: "20–30%" },
            { rank: 18, skill: "Edge Computing / IoT Cloud", growth: "20–40%" },
            { rank: 19, skill: "Quantum Computing (Qiskit)", growth: "15–30%" }
          ].map((item) => (
            <div key={item.rank} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">#{item.rank}</span>
                <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded-lg">{item.growth} Growth</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.skill}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
