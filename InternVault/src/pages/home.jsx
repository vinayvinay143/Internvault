import { motion } from "framer-motion";
import { AdBanner } from "../components/AdBanner";
import { BsArrowUpRight, BsShieldCheck, BsLightningCharge, BsPeople } from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import { MdOutlineLocalOffer, MdOutlinePayment, MdWorkOutline, MdSchool } from "react-icons/md";
import { IoMdInformationCircleOutline, IoMdRocket } from "react-icons/io";
import { Link } from "react-router-dom";

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    {
      icon: <GoOrganization className="text-4xl text-blue-500 mb-4" />,
      title: "Trusted Organizations",
      text: "We partner with verified companies to ensure every listing is legitimate and offers real growth potential.",
    },
    {
      icon: <MdOutlinePayment className="text-4xl text-green-500 mb-4" />,
      title: "Zero Hidden Fees",
      text: "Transparent processes. No upfront payments for internship applications. Your talent is your currency.",
    },
    {
      icon: <BsShieldCheck className="text-4xl text-indigo-500 mb-4" />,
      title: "Verified Offers",
      text: "Every offer is vetted. We ensure clear terms, mentorship availability, and structured learning paths.",
    },
    {
      icon: <BsLightningCharge className="text-4xl text-yellow-500 mb-4" />,
      title: "Fast-Track Careers",
      text: "Skip the noise. Connect directly with hiring managers and teams looking for fresh talent like you.",
    },
  ];

  const contentSections = [
    {
      title: "Why Use InternVault?",
      description: "We Bridge the Gap Between Talent and Opportunity.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-xl text-blue-800 mb-2">For Students</h3>
            <p className="text-gray-700">Access premium internships that matter. Build your resume with real-world projects and mentorship.</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-xl text-indigo-800 mb-2">For Employers</h3>
            <p className="text-gray-700">Find motivated, skilled interns ready to contribute from day one. streamline your hiring process.</p>
          </div>
        </div>
      ),
    },
    {
      title: "How It Works",
      description: "Your Journey to Success in 3 Simple Steps",
      content: (
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-12">
          {[
            { step: "01", title: "Create Profile", text: "Sign up and showcase your skills, projects, and education.", icon: <BsPeople /> },
            { step: "02", title: "Apply to Jobs", text: "Browse curated listings and apply with a single click.", icon: <MdWorkOutline /> },
            { step: "03", title: "Get Hired", text: "Ace the interview and start your professional journey.", icon: <IoMdRocket /> },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-1 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-9xl font-bold text-gray-50 opacity-50 z-0 select-none">{item.step}</div>
              <div className="relative z-10">
                <div className="text-4xl text-blue-600 mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Who is this for?",
      description: "Tailored for every stage of your early career",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="text-center p-4">
            <div className="mx-auto bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center text-orange-600 text-3xl mb-4">
              <MdSchool />
            </div>
            <h3 className="font-bold text-lg mb-2">University Students</h3>
            <p className="text-sm text-gray-500">Looking for summer internships or semester breaks opportunities.</p>
          </div>
          <div className="text-center p-4 border-l-0 md:border-l border-r-0 md:border-r border-gray-100">
            <div className="mx-auto bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center text-purple-600 text-3xl mb-4">
              <BsLightningCharge />
            </div>
            <h3 className="font-bold text-lg mb-2">Fresh Graduates</h3>
            <p className="text-sm text-gray-500">Seeking first full-time roles or traineeships to kickstart careers.</p>
          </div>
          <div className="text-center p-4">
            <div className="mx-auto bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center text-teal-600 text-3xl mb-4">
              <IoMdRocket />
            </div>
            <h3 className="font-bold text-lg mb-2">Career Switchers</h3>
            <p className="text-sm text-gray-500">Wanting to gain experience in a new field through internships.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden font-sans text-gray-800">

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative pt-32 pb-20 px-6 text-center"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[100px] opacity-30"></div>
        </div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Unlock Your Future <br className="hidden md:block" /> with <span className="text-blue-600">InternVault</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate platform for students and graduates to find verified internships, build skills, and launch professional careers.
        </motion.p>

        <motion.div variants={itemVariants}>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto">
            Get Started Now <BsArrowUpRight className="text-xl font-bold" />
          </button>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl border border-gray-100 rounded-2xl p-8 transition-all duration-300"
            >
              {card.icon}
              <h3 className="text-xl font-bold mb-3 text-gray-800">{card.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{card.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-32 mb-32">
        {contentSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{section.title}</h2>
              <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-4"></div>
              <p className="text-xl text-gray-500">{section.description}</p>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>

      <AdBanner />
    </div>
  );
}
