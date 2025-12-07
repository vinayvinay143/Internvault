import { FaYoutube, FaGoogle } from "react-icons/fa";
import { SiUdemy } from "react-icons/si";

export function Course() {
  const courses = [
    {
      id: 1,
      name: "HTML",
      image: "/html.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://udemy.com" },
        { name: "Google", icon: <FaGoogle />, link: "https://grow.google" },
      ],
    },
    {
      id: 2,
      name: "CSS",
      image: "/css.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://udemy.com" },
        { name: "Google", icon: <FaGoogle />, link: "https://grow.google" },
      ],
    },
    {
      id: 3,
      name: "JavaScript",
      image: "/js.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://udemy.com" },
        { name: "Google", icon: <FaGoogle />, link: "https://grow.google" },
      ],
    },
    {
      id: 4,
      name: "React",
      image: "/react.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://udemy.com" },
        { name: "Google", icon: <FaGoogle />, link: "https://grow.google" },
      ],
    },
  ];

  return (
    <div className="p-6">
      {/* GRID FOR 4 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex bg-white rounded-2xl shadow-lg p-3 gap-3 items-center hover:shadow-xl transition"
          >
            {/* Left Image */}
            <img
              src={course.image}
              alt={course.name}
              className="w-24 h-24 object-cover rounded-xl"
            />

            {/* Right Side Content */}
            <div className="flex flex-col gap-2 w-full">
              <h2 className="text-xl font-bold">{course.name}</h2>

              <div className="flex flex-wrap gap-2">
                {course.sources.map((src, index) => (
                  <a
                    key={index}
                    href={src.link}
                    target="_blank"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition text-sm"
                  >
                    {src.icon}
                    {src.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
