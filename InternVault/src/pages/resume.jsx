import { BsFileEarmarkText, BsDownload, BsEye } from "react-icons/bs";

export function Resume() {
  const resumes = [
    { id: 1, name: "Professional Modern", image: "/resume1.png", file: "/resume1.pdf", tag: "Best for Tech" },
    { id: 2, name: "Minimalist Clean", image: "/resume1.png", file: "#", tag: "Best for Design" },
    { id: 3, name: "Executive Suite", image: "/resume1.png", file: "#", tag: "Senior Roles" },
    { id: 4, name: "Creative Bold", image: "/resume1.png", file: "#", tag: "Creative" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header - Consistent with Home/Internship */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Resume Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional, ATS-friendly templates designed to get you hired.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {resumes.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden mb-5">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a href={item.file} target="_blank" className="px-4 py-2 bg-white text-gray-900 rounded-full font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform">
                    Preview Template
                  </a>
                </div>

                {/* Placeholder if image missing */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover relative z-10"
                />
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded text-gray-700 shadow-sm border border-gray-100">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="mt-auto">
                <h3 className="text-base font-bold text-gray-900 mb-3">{item.name}</h3>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={item.file}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <BsEye /> View
                  </a>
                  <a
                    href={item.file}
                    download
                    className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <BsDownload /> Use
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
