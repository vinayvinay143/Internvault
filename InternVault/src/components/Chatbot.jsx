import { useState, useRef, useEffect } from "react";
import { BsSend, BsX, BsRobot, BsShieldCheck } from "react-icons/bs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function Chatbot({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: "Hello! I'm your Internship Verification Assistant. Ask me about any company or internship opportunity, and I'll help you verify if it's legit based on public reviews and data. I only discuss internships!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (!apiKey) {
            setMessages((prev) => [...prev, { role: "model", text: "Error: API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file." }]);
            return;
        }

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
        You are an Internship Verification AI Assistant for InternVault. 
        Your SOLE purpose is to help users verify if an internship or company is legitimate or fake based on your training data (internet knowledge, reviews, Glassdoor, LinkedIn patterns, etc.).
        
        RULES:
        1. IF the user asks about an internship, a company, a job offer, or career advice related to internships:
           - Analyze the company name/offer.
           - Provide a "Verdict": LIKELY LEGIT, SUPICIOUS, or FAKE.
           - Give "Reasons" based on common red flags (e.g., asking for money, no website, bad reviews, generic gmail) or positive signs (well-known, verified presence).
           - Summarize known public sentiment/reviews (Glassdoor, LinkedIn).
        2. IF the user asks about ANYTHING ELSE (e.g., "What is the capital of France?", "Write code for me", "Recipe for cake"):
           - REFUSE politely. Say: "I can only answer questions about internships and company verification. Please ask me about a specific company or internship offer."
        3. Be concierge, professional, and helpful.
        4. Do NOT make up fake reviews. If you don't know a company, say "I don't have enough data on this company, but here are general tips to spot a fake internship..."

        User Query: "${userMessage}"
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages((prev) => [...prev, { role: "model", text: text }]);
        } catch (error) {
            console.error("Error generating response:", error);
            setMessages((prev) => [
                ...prev,
                { role: "model", text: "Sorry, I encountered an error. Please check your API Key or try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-[60] animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <BsRobot className="text-xl" />
                    <div>
                        <h3 className="font-bold text-sm">InternVault Verifier</h3>
                        <p className="text-xs text-blue-100 flex items-center gap-1">
                            <BsShieldCheck /> AI-Powered Safety
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                    <BsX size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px] max-h-[400px]">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none"
                                }`}
                        >
                            {msg.role === "model" && (
                                <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold opacity-70">
                                    <BsRobot /> AI Assistant
                                </div>
                            )}
                            {msg.text.split('\n').map((line, i) => (
                                <p key={i} className="mb-1 last:mb-0">{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about a company..."
                    className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <BsSend size={18} />
                </button>
            </form>
        </div>
    );
}
