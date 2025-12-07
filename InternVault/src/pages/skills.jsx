export function Skills() {
  const categories = [
    {
      title: "Artificial Intelligence (AI) & Machine Learning (ML)",
      items: [
        "Python, R, TensorFlow, PyTorch, Keras, scikit-learn",
        "Deep Learning, Generative AI (GenAI), LLMs",
        "Neural Networks, NLP, Computer Vision",
        "Statistical Modeling, Reinforcement Learning",
        "MLOps (Deployment, Monitoring, Governance)",
        "Prompt Engineering, Model Fine-Tuning"
      ]
    },
    {
      title: "Cloud Computing & Infrastructure",
      items: [
        "AWS, Microsoft Azure, Google Cloud (GCP)",
        "Serverless Computing (Lambda, Azure Functions)",
        "Cloud Security & Multi-Cloud Architecture",
        "Hybrid Cloud, Multi-Cloud Management"
      ]
    },
    {
      title: "Containers, Orchestration & IaC",
      items: [
        "Docker, Kubernetes (K8s), Helm",
        "Terraform, Ansible",
        "AWS CloudFormation, ARM Templates"
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

      {categories.map((cat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 shadow-md rounded-xl p-5 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold mb-4">{cat.title}</h2>

          <ul className="space-y-2">
            {cat.items.map((item, i) => (
              <li
                key={i}
                className="p-2 rounded-lg bg-[hsl(213.3_96.9%_87.3%)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
}
