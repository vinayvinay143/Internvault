import { BsDownload, BsEye } from "react-icons/bs";

export function Resume() {
  const resumes = [
    { id: 1, name: "Modern Professional", image: "/resume1.png", file: "/resume1.pdf", tag: "Professional" },
    { id: 2, name: "Clean Minimalist", image: "/resume2.jpg", file: "/resume2.pdf", tag: "Minimalist" },
    { id: 3, name: "Creative Designer", image: "/resume3.png", file: "/resume3.pdf", tag: "Creative" },
    { id: 4, name: "Executive Suite", image: "/resume4.png", file: "/resume4.pdf", tag: "Executive" },
    { id: 5, name: "Tech Focused", image: "/resume5.png", file: "/resume5.pdf", tag: "Technical" },
    { id: 6, name: "Simple Entry", image: "/resume6.png", file: "/resume6.pdf", tag: "Entry Level" },
    { id: 7, name: "Bold Statement", image: "/resume7.png", file: "/resume7.pdf", tag: "Bold" },
    { id: 8, name: "Academic CV", image: "/resume8.png", file: "/resume8.pdf", tag: "Academic" },
    { id: 9, name: "Corporate Blue", image: "/resume9.png", file: "/resume9.pdf", tag: "Corporate" },
    { id: 10, name: "Infographic Style", image: "/resume10.webp", file: "/resume10.pdf", tag: "Infographic" },
    { id: 11, name: "Dark Modern", image: "/resume11.png", file: "/resume11.pdf", tag: "Modern" },
    { id: 12, name: "Compact One-Page", image: "/resume12.png", file: "/resume12.pdf", tag: "Compact" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800">
          Resume <span className="text-blue-600">Templates</span>
        </h1>
        <p className="text-gray-500 mt-2">Professional templates designed to get you hired.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resumes.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-4 hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] rounded-2xl bg-gray-50 overflow-hidden mb-4">

              {/* Badge */}
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-gray-200">
                  {item.tag}
                </span>
              </div>

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">{item.name}</h3>

              <div className="flex gap-2">
                <a
                  href={item.image}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <BsEye /> View
                </a>
                <a
                  href={item.file}
                  download
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <BsDownload />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
