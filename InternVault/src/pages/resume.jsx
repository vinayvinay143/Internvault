export function Resume() {
  const resumes = [
    { id: 1, image: "/resume1.png", file: "/resume1.pdf" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Resume Templates</h1>

      {/* GRID OF 5 RESUME CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {resumes.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center border border-gray-200 hover:shadow-xl transition"
          >
            <img
              src={item.image}
              alt={`Resume ${item.id}`}
              className="w-full h-48 object-cover rounded-md mb-4"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={item.file}
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View
              </a>

              <a
                href={item.file}
                download
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
