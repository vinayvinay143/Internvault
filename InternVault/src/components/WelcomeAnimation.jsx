import { motion } from "framer-motion";
import { BsStars, BsRocket, BsLightningCharge } from "react-icons/bs";

export function WelcomeAnimation({ user }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl opacity-50"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center px-4"
            >
                <motion.div variants={itemVariants} className="mb-6 inline-block">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold border border-blue-100 flex items-center gap-2 mx-auto w-fit">
                        <BsStars className="animate-pulse" /> Welcome back to InternVault
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight"
                >
                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                        {user?.name || user?.companyName || "Explorer"}
                    </span>
                    <motion.span
                        animate={{ rotate: [0, 20, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="inline-block ml-4 text-4xl"
                    >
                        👋
                    </motion.span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Your command center is ready. Access your dashboard, internships, and tools from the navigation bar above.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <BsRocket className="text-lg" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-slate-500 font-medium">Opportunities</div>
                            <div className="text-sm font-bold text-slate-900">Ready to Explore</div>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <BsLightningCharge className="text-lg" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-slate-500 font-medium">Status</div>
                            <div className="text-sm font-bold text-slate-900">Active & Online</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
