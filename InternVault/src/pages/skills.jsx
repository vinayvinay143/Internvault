import { BsCheckCircleFill } from "react-icons/bs";

export function Skills() {
  const categories = [
    {
      title: "AI & Machine Learning",
      description: "Master the future with intelligent systems.",
      color: "from-purple-500 to-indigo-600",
      items: [
        "Python, R, TensorFlow, PyTorch",
        "Deep Learning, Generative AI, LLMs",
        "Neural Networks, Computer Vision",
        "NLP, Reinforcement Learning",
        "MLOps & Model Deployment"
      ]
    },
    {
      title: "Cloud Computing",
      description: "Build scalable infrastructure in the cloud.",
      color: "from-blue-400 to-cyan-500",
      items: [
        "AWS, Azure, Google Cloud (GCP)",
        "Serverless (Lambda, Functions)",
        "Cloud Security & Architecture",
        "Hybrid & Multi-Cloud Strategies"
      ]
    },
    {
      title: "DevOps & Containers",
      description: "Streamline development and operations.",
      color: "from-orange-400 to-pink-500",
      items: [
        "Docker & Kubernetes (K8s)",
        "CI/CD Pipelines (Jenkins, Actions)",
        "Terraform & Ansible (IaC)",
        "Monitoring (Prometheus, Grafana)"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Technical <span className="text-blue-600">Competencies</span></h1>
        <p className="text-gray-500 mt-2">Essential skills for the modern tech landscape.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Gradient Header */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${cat.color}`}></div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 mt-2">{cat.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{cat.description}</p>

            <ul className="space-y-3">
              {cat.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <BsCheckCircleFill className="text-green-500 mt-1 shrink-0" />
                  <span className="text-gray-600 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
