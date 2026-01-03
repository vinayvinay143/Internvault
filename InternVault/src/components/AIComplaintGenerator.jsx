import React, { useState } from 'react';
import { BsLightningCharge, BsClipboard, BsCheck2 } from "react-icons/bs";
import { GroqService } from '../services/groq';
import toast from 'react-hot-toast';

export function AIComplaintGenerator() {
    const [formData, setFormData] = useState({
        companyName: '',
        scamType: 'Fee Demand',
        amount: '',
        details: ''
    });
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGeneratedText('');

        try {
            const prompt = `Write a formal and strictly worded complaint letter to the Ministry of Corporate Affairs / Consumer Forum regarding a fake internship scam.
      
      Details:
      - Company Name: ${formData.companyName}
      - Scam Type: ${formData.scamType}
      ${formData.amount ? `- Amount Lost: ₹${formData.amount}` : ''}
      - Additional Details: ${formData.details}

      Tone: Professional, Legal, and Firm.
      Goal: Request immediate action against the company and a refund (if applicable).
      Structure:
      - Subject Line
      - Salutation
      - Body (citing vague promises, unprofessional behavior, and specific scam actions)
      - Demand for Action
      - Closing`;

            const text = await GroqService.generateText(prompt);
            setGeneratedText(text);
            toast.success("Complaint generated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate complaint. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-6 md:p-8 mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                    <BsLightningCharge className="text-white text-xl" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">AI Complaint Generator</h2>
                    <p className="text-sm text-gray-600">Instantly draft a formal legal notice or complaint.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. FakeTech Solutions Pvt Ltd"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Scam Type</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                value={formData.scamType}
                                onChange={(e) => setFormData({ ...formData, scamType: e.target.value })}
                            >
                                <option>Fee Demand</option>
                                <option>Unpaid Stipend</option>
                                <option>Fake Offer Letter</option>
                                <option>Data Theft / Privacy</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Lost (₹)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Optional"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key Details</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                            placeholder="Briefly describe what happened..."
                            value={formData.details}
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>Generating...</>
                        ) : (
                            <>
                                <BsLightningCharge /> Generate Complaint
                            </>
                        )}
                    </button>
                </form>

                {/* Output */}
                <div className="relative">
                    <div className="absolute top-0 right-0 z-10">
                        {generatedText && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                            >
                                {copied ? <BsCheck2 className="text-green-500" /> : <BsClipboard />}
                                {copied ? "Copied!" : "Copy Text"}
                            </button>
                        )}
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Generated Draft</label>
                    <div className="w-full h-[320px] bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto text-sm text-gray-800 leading-relaxed font-mono whitespace-pre-wrap shadow-inner relative">
                        {generatedText ? (
                            generatedText
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-60">
                                <BsClipboard className="text-4xl mb-2" />
                                <p>Generated text will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
