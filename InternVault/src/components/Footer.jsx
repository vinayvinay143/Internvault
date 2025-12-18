import { Link } from "react-router-dom";
import { BsGithub, BsTwitter, BsLinkedin, BsInstagram } from "react-icons/bs";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            InternVault
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Empowering the next generation of tech leaders with verified internships and skill-building resources.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"><BsGithub /></a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-blue-400 hover:bg-blue-50 transition-colors"><BsTwitter /></a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"><BsLinkedin /></a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"><BsInstagram /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/internships" className="hover:text-blue-600 transition-colors">Browse Internships</Link></li>
                            <li><Link to="/skillvault" className="hover:text-blue-600 transition-colors">Skill Vault</Link></li>
                            <li><Link to="/intern-chat" className="hover:text-blue-600 transition-colors">Verify Internships</Link></li>
                            <li><Link to="/prompts" className="hover:text-blue-600 transition-colors">AI Prompts</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/resume" className="hover:text-blue-600 transition-colors">Resume Builder</Link></li>
                            <li><Link to="/courses" className="hover:text-blue-600 transition-colors">Free Courses</Link></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 InternVault. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> System Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
