import { BsArrowUpRight } from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import { MdOutlineLocalOffer, MdOutlinePayment } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";


export function Home() {
  const cards = [
    {
      icon: <GoOrganization className="text-4xl text-blue-500 mb-3" />,
      title: "Research the Organization",
      text: "Always check the company's official website, read reviews, and look up their social media presence. Real companies have a professional online footprint.",
    },
    {
      icon: <MdOutlineLocalOffer className="text-4xl text-blue-500 mb-3" />,
      title: "Verify the Job Offer",
      text: "Be wary if you receive an offer too quickly, without any formal interview or assessment. Legitimate internships include clear steps like interviews and documentation.",
    },
    {
      icon: <MdOutlinePayment className="text-4xl text-blue-500 mb-3" />,
      title: "Avoid Upfront Payments",
      text: "Never pay for an internship opportunity. Legitimate internships do not require fees for application processing, training, or materials.",
    },
    {
      icon: <IoMdInformationCircleOutline className="text-4xl text-blue-500 mb-3" />,
      title: "Check Contact Information",
      text: "Trustworthy companies use professional email addresses. If details look suspicious or unprofessional, proceed with caution.",
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center mt-60 gap-7 text-center ">
        <h1 className="text-5xl font-semibold">Looking for an internship?</h1>
        <h2 className="text-lg text-gray-600">
          Here are some trusted sites to begin your journey.
        </h2>
        <button className="bg-blue-400 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition flex items-center gap-2">
          Let’s start now! <BsArrowUpRight className="text-xl" />
        </button>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-90 mb-60 px-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md border-l-3 border-l-blue-400 rounded-2xl p-6 hover:shadow-lg transition">
            {card.icon}
            <h1 className="text-xl font-semibold mb-2">{card.title}</h1>
            <p className="text-gray-600">{card.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
