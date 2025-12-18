import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BsArrowRight, BsShieldCheck, BsLightningCharge, BsCodeSquare } from "react-icons/bs";
import { GoOrganization } from "react-icons/go";

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-8">
            🚀 The #1 Platform for Internships
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
            Launch Your Career with <span className="text-blue-600">Confidence</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
            Discover verified internships, master in-demand skills, and connect with top employers. No spam, just opportunities.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Get Started Free
            </Link>
            <Link to="/internships" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all">
              Browse Jobs
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-6">TRUSTED BY STUDENTS FROM</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos, using text styling for now */}
              <span className="text-xl font-bold font-serif text-gray-800">Stanford</span>
              <span className="text-xl font-bold font-serif text-gray-800">MIT</span>
              <span className="text-xl font-bold font-serif text-gray-800">IIT Bombay</span>
              <span className="text-xl font-bold font-serif text-gray-800">Google</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why InternVault?</h2>
            <p className="text-lg text-gray-600 font-medium">Everything you need to succeed in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <BsShieldCheck className="text-4xl text-blue-600" />,
                title: "Verified Listings",
                desc: "Every internship is vetted by AI and our team. Say goodbye to scams and fake offers."
              },
              {
                icon: <BsCodeSquare className="text-4xl text-purple-600" />,
                title: "Skill Growth",
                desc: "Access curated courses and prompts to build the exact skills employers are looking for."
              },
              {
                icon: <GoOrganization className="text-4xl text-green-600" />,
                title: "Direct Access",
                desc: "Apply directly to companies. No middleman agencies taking a cut of your stipend."
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100 group">
                <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to start your journey?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto font-medium relative z-10">
            Join thousands of students who have found their dream internships through InternVault.
          </p>
          <Link to="/signup" className="relative z-10 inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
            Join Now <BsArrowRight />
          </Link>
        </div>
      </section>

    </div>
  );
}
