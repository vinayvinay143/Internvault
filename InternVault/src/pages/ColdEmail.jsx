import { useState } from "react";
import { GroqService } from "../services/groq";
import { BsSend, BsMagic, BsClipboard, BsCheck } from "react-icons/bs";

export function ColdEmail() {
    const [formData, setFormData] = useState({
        recipientName: "",
        companyName: "",
        role: "",
        aboutCompany: "",
        mySkills: ""
    });
    const [emailContent, setEmailContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateEmail = async () => {
        setLoading(true);
        try {
            const prompt = `
        Write a hyper-personalized cold email for an internship opportunity.
        
        Recipient: ${formData.recipientName}
        Company: ${formData.companyName}
        Role: ${formData.role}
        About Company (Values/Mission): "${formData.aboutCompany}"
        My Skills/Project: "${formData.mySkills}"

        Style: Professional, concise, not desperate. 
        Structure:
        1. Hook (Connect my skills to their values)
        2. Value prop (What I can build for them)
        3. Call to Action (Soft ask)

        Output ONLY the email body text.
      `;

            const result = await GroqService.generateText(prompt);
            setEmailContent(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(emailContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

                {/* Input Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <BsMagic size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Cold Email Architect</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Recipient Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Sarah Smith"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Company</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Tesla"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Role Applying For</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Frontend Intern"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Company Values / Recent News</label>
                            <textarea
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                placeholder="Paste their mission statement or recent news here..."
                                value={formData.aboutCompany}
                                onChange={(e) => setFormData({ ...formData, aboutCompany: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Your Key Skill / Relevant Project</label>
                            <textarea
                                className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                placeholder="I built a React app that..."
                                value={formData.mySkills}
                                onChange={(e) => setFormData({ ...formData, mySkills: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={generateEmail}
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <BsSend /> Generate Magic Email
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Area */}
                <div className="bg-gray-900 p-8 rounded-3xl shadow-xl text-white relative flex flex-col">
                    <h3 className="text-xl font-bold mb-6 text-gray-300">Generated Email</h3>

                    <div className="flex-grow font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                        {emailContent || (
                            <span className="opacity-30 italic">
                                Your AI-crafted email will appear here...
                            </span>
                        )}
                    </div>

                    {emailContent && (
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                        >
                            {copied ? <BsCheck size={20} className="text-green-400" /> : <BsClipboard size={20} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
