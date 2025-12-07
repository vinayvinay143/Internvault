import { BsArrowUpRight } from "react-icons/bs";

export function Internship() {
  const internships = [
    {
      id: 1,
      name: "InternGuru",
      image: "/i1.png",
      link: "https://internguru.com/",
    },
    {
      id: 2,
      name: "Internshala",
      image: "/i2.png",
      link: "https://internshala.com/",
    },
    {
      id: 3,
      name: "Unstop",
      image: "/i3.png",
      link: "https://unstop.com/internship-portal",
    },
    {
      id: 4,
      name: "National Internship Portal",
      image: "/i4.png",
      link: "https://internship.aicte-india.org/index.php",
    },
     {
      id: 5,
      name: "Apna",
      image: "/i5.png",
      link: "https://apna.co/",
    },
    {
      id: 6,
      name: "Glassdoor",
      image: "/i6.png",
      link: "https://www.glassdoor.co.in/index.htm/",
    },
    {
      id: 7,
      name: "Foundit",
      image: "/i7.png",
      link: "https://www.foundit.in/",
    },
    {
      id: 8,
      name: "Smart Internz",
      image: "/i8.png",
      link: "https://skillwallet.smartinternz.com/virtual-internship-programs/",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-5 my-10">
      {internships.map((intern) => (
        <div
          key={intern.id}
          className="bg-white shadow-lg rounded-2xl p-3 hover:shadow-2xl transition"
        >
          {/* IMAGE + ICON OVERLAY */}
          <div className="relative">
            <img
              src={intern.image}
              alt={intern.name}
              className="rounded-xl mb-4 w-full h-48 object-cover"
            />

            {/* Icon Button (Bottom-right) */}
            <a
              href={intern.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <BsArrowUpRight className="text-xl" />
            </a>
          </div>

          {/* TITLE */}
          <h4 className="text-lg font-semibold text-center mb-2">
            {intern.name}
          </h4>
        </div>
      ))}
    </div>
  );
}