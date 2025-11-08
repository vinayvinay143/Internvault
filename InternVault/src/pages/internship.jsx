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
      name: "LetsIntern",
      image: "/i3.png",
      link: "https://www.letsintern.com/",
    },
    {
      id: 4,
      name: "Oasis Infobyte",
      image: "/i4.png",
      link: "https://oasisinfobyte.com/",
    },
    {
      id: 5,
      name: "Internpe",
      image: "/i5.png",
      link: "https://www.internpe.in/",
    },
    {
      id: 6,
      name: "TechnoHacks",
      image: "/i6.png",
      link: "https://technohacks.co.in/",
    },
    {
      id: 7,
      name: "Bharat Intern",
      image: "/i7.png",
      link: "https://bharatintern.live/",
    },
    {
      id: 8,
      name: "CodSoft",
      image: "/i8.png",
      link: "https://www.codsoft.in/",
    },
    {
      id: 9,
      name: "Prodigy InfoTech",
      image: "/i9.png",
      link: "https://prodigyinfotech.dev/",
    },
    {
      id: 10,
      name: "Unified Mentor",
      image: "/i10.png",
      link: "https://unifiedmentor.com/",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-5 my-10">
      {internships.map((intern) => (
        <div
          key={intern.id}
          className="bg-white shadow-lg rounded-2xl p-3 hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <img
            src={intern.image}
            alt={intern.name}
            className="rounded-xl mb-4 w-full h-48 object-cover"
          />
          <h4 className="text-lg font-semibold text-center mb-2">
            {intern.name}
          </h4>
          <div className="flex justify-end">
            <a
              href={intern.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Visit
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
