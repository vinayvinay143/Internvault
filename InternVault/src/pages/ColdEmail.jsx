import { useState } from "react";
import { GroqService } from "../services/groq";
import { BsSend, BsMagic, BsClipboard, BsCheck, BsStars } from "react-icons/bs";

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
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Cold Email <span className="text-blue-600">Architect</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Craft personalized, professional emails that get responses
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <BsMagic size={16} />
                            </div>
                            Email Details
                        </h2>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                        Recipient Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="e.g. Sarah Smith"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="e.g. Tesla"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                    Role Applying For
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="e.g. Frontend Intern"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                    Company Values / Recent News
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-28 resize-none"
                                    placeholder="Paste their mission statement or recent news here..."
                                    value={formData.aboutCompany}
                                    onChange={(e) => setFormData({ ...formData, aboutCompany: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                    Your Key Skill / Relevant Project
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-28 resize-none"
                                    placeholder="I built a React app that..."
                                    value={formData.mySkills}
                                    onChange={(e) => setFormData({ ...formData, mySkills: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={generateEmail}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <BsSend />
                                        Generate Email
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Output Area */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <BsStars size={16} />
                                </div>
                                Generated Email
                            </h3>
                            {emailContent && (
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 flex items-center gap-2 text-sm font-medium"
                                >
                                    {copied ? (
                                        <>
                                            <BsCheck size={18} className="text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <BsClipboard size={14} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="flex-grow bg-slate-50 rounded-xl p-6 border border-slate-200">
                            {emailContent ? (
                                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                                    {emailContent}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-slate-400 italic text-center">
                                        Your AI-crafted email will appear here...
                                        <br />
                                        <span className="text-sm">Fill in the details and click Generate</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
