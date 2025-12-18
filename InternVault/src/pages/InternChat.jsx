import { useState, useRef, useEffect } from "react";
import { BsSend, BsRobot, BsShieldCheck, BsChatDots, BsInfoCircle, BsArrowUpRight } from "react-icons/bs";
import chatbotImg from "../assets/chatbot.png";

export function InternChat() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hello! I'm your Internship Verification Assistant. Ask me about any company or internship opportunity.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY;

    // Check if query is internship/company related
    const isInternshipRelated = (query) => {
        const lowerQuery = query.toLowerCase();
        const internshipKeywords = [
            'internship', 'intern', 'company', 'job', 'offer', 'recruitment',
            'legitimate', 'legit', 'scam', 'fake', 'genuine', 'real', 'verify',
            'review', 'work', 'employment', 'career', 'hiring', 'salary',
            'organization', 'firm', 'business', 'corporation', 'startup'
        ];

        // Check if any keyword is present
        return internshipKeywords.some(keyword => lowerQuery.includes(keyword));
    };

    // Search the web for company information
    const searchCompanyInfo = async (query) => {
        if (!tavilyApiKey || tavilyApiKey === 'tvly-your_tavily_api_key_here') {
            return null; // Return null if no API key, will skip search
        }

        try {
            const response = await fetch("https://api.tavily.com/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query: `${query} company reviews internship legitimacy scam verification`,
                    search_depth: "basic",
                    max_results: 5,
                    include_answer: true,
                    include_domains: ["glassdoor.com", "indeed.com", "linkedin.com", "reddit.com"],
                }),
            });

            if (!response.ok) {
                console.error("Tavily search failed:", response.status);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("Search error:", error);
            return null;
        }
    };

    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (!apiKey) {
            console.error("API Key missing in environment variables");
            setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Configuration Error: API Key is missing. Check VITE_GROQ_API_KEY in .env" }]);
            return;
        }

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        // Check if query is internship-related
        if (!isInternshipRelated(userMessage)) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                text: "⚠️ **Off-Topic Query Detected**\\n\\nI'm specifically designed to help verify internships and companies. I can only assist with:\\n\\n✅ Verifying if a company is legitimate\\n✅ Checking internship offers for red flags\\n✅ Providing information about companies\\n✅ Identifying potential scams\\n✅ Reviewing job postings\\n\\nPlease ask me about internships, companies, or job opportunities you want to verify!"
            }]);
            setIsLoading(false);
            return;
        }

        console.log("Sending request to Groq with web search...");

        try {
            // Search the web for company information
            let searchResults = null;
            let searchContext = "";

            console.log("Searching web for company information...");
            searchResults = await searchCompanyInfo(userMessage);

            if (searchResults && searchResults.results) {
                console.log("Search results found:", searchResults.results.length);

                // Build context from search results
                searchContext = "\\n\\n📊 REAL-TIME WEB SEARCH RESULTS:\\n\\n";

                if (searchResults.answer) {
                    searchContext += `Summary: ${searchResults.answer}\\n\\n`;
                }

                searchContext += "Sources found:\\n";
                searchResults.results.forEach((result, idx) => {
                    searchContext += `${idx + 1}. ${result.title}\\n   ${result.content}\\n   URL: ${result.url}\\n\\n`;
                });

                searchContext += "\\nIMPORTANT: Base your assessment on these REAL search results from the internet. Cite specific sources when providing your answer.\\n";
            } else {
                console.log("No search results - using AI knowledge only");
                searchContext = "\\n\\n⚠️ Note: Web search unavailable (Tavily API key not configured). Providing assessment based on general knowledge. User should verify independently.\\n";
            }

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert Internship Verification AI Assistant for InternVault, a platform dedicated to protecting students from fake internship scams.

Your primary responsibilities:
1. Help users verify if internships, companies, or job postings are legitimate or potentially fraudulent
2. Provide SPECIFIC red flags and warning signs to watch for
3. Give actionable verification steps users can take
4. Educate users about common internship scams
5. **ANALYZE REAL WEB SEARCH RESULTS** when provided and cite sources

When analyzing an internship or company, always consider:

RED FLAGS (signs of potential scams):
- Requests for upfront payment or "registration fees"
- Promises of unrealistic salaries for minimal work
- Poor grammar/spelling in official communications
- No official company website or social media presence
- Unprofessional email domains (e.g., @gmail.com instead of company domain)
- Pressure to act quickly or share personal/financial information
- No clear job description or responsibilities
- Company address is a residential area or doesn't exist
- No verifiable reviews from past interns/employees
- Requests to use personal equipment without compensation

GREEN FLAGS (signs of legitimacy):
- Professional company website with clear contact information
- Active social media presence with real employee engagement
- Verifiable office address and phone number
- Clear internship program structure and learning outcomes
- Professional communication with company email domain
- Transparent application process
- Reviews from past interns on platforms like Glassdoor, LinkedIn
- Company registered with government authorities
- Reasonable expectations and compensation

When responding to queries:
- **PRIORITIZE real search results over general knowledge**
- Start with a direct assessment (Legitimate, Suspicious, or Needs Investigation)
- **CITE specific sources** when using web search results
- List specific red or green flags you observe
- Provide 3-5 actionable verification steps the user can take
- If it's potentially fake, explain WHY and what makes it suspicious
- If legitimate, still encourage due diligence
- Be informative but not alarmist
- If you don't have enough information, ask clarifying questions

Response Structure:
🔍 Assessment: [Your verdict based on search results]
📌 Key Findings: [List red/green flags from actual search results]
✅ How to Verify: [Specific steps they can take]
📚 Sources: [If using search results, cite the URLs]
⚠️ Recommendation: [Final advice]

Remember: When web search results are available, base your assessment on REAL data from the internet, not just training data.

IMPORTANT RESPONSE STRUCTURE (STRICTLY FOLLOW):

PART 1: NARRATIVE ANSWER (NO LINKS)
- Provide a direct, conversational answer to the user's question.
- Explain your assessment (Legitimate/Scam/Suspicious) and the reasons.
- List specific red/green flags if applicable.
- **DO NOT include a "How to Verify" section.**
- **DO NOT include any URLs or [Link](url) markdown in this text.** Keep it clean and readable.

PART 2: PROOFS & SOURCES
- After the narrative, add a divider and a "Proofs & Clickable Sources" section.
- **LIMIT to 2-3 best sources.**
- **Keep link titles SHORT** (e.g., "Reddit Thread", "Glassdoor Review", "Official Site"). Do not use full page titles.

Format:
[Narrative Answer Here...]

---
### 🔗 Proofs & Clickable Sources
1. [Short Title](URL)
2. [Short Title](URL)

Use the REAL URLs from the search results.${searchContext}`
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log("Groq Response:", data);

            const text = data.choices?.[0]?.message?.content;

            if (!text) throw new Error("Empty response from AI");

            setMessages((prev) => [...prev, { role: "assistant", text: text }]);
        } catch (error) {
            console.error("Groq API Request Failed:", error);

            let displayError = "Sorry, I couldn't connect to the server.";

            if (error.message.includes("401")) displayError = "⚠️ Invalid API Key: Please check your Groq API key in .env";
            if (error.message.includes("429")) displayError = "⚠️ Too Many Requests: Please wait a moment.";
            if (error.message.includes("500")) displayError = "⚠️ Server Error: Groq service temporarily unavailable.";
            if (error.message.includes("Network")) displayError = "⚠️ Network Error: Check your internet connection.";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: `${displayError}\\n\\nError: ${error.message}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Custom formatter for basic markdown (links and bold)
    const formatMessage = (text) => {
        // Split by newlines to handle paragraphs
        return text.split('\n').map((line, i) => {
            // Regex for headers: ### Text
            const headerRegex = /^###\s+(.+)$/;
            const headerMatch = line.match(headerRegex);

            if (headerMatch) {
                return (
                    <h3 key={i} className="text-sm font-bold text-blue-600 uppercase tracking-wider mt-4 mb-2 flex items-center gap-2">
                        {headerMatch[1]}
                    </h3>
                );
            }

            // Regex for links: [text](url)
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            // Regex for bold: **text**
            const boldRegex = /\*\*([^*]+)\*\*/g;

            const elements = [];
            let lastIndex = 0;
            let match;

            // Simple parser for mix of links and bold
            // Note: This is a basic parser. For complex nested markdown, a library is better.
            // We'll iterate through the string and find matches

            // First, let's process links as they are the main requirement
            const parts = [];
            let currentText = line;

            // Split line by links first
            let lastLinkIndex = 0;
            while ((match = linkRegex.exec(line)) !== null) {
                // Text before link
                if (match.index > lastLinkIndex) {
                    parts.push({ type: 'text', content: line.slice(lastLinkIndex, match.index) });
                }
                // The link
                parts.push({
                    type: 'link',
                    text: match[1],
                    url: match[2]
                });
                lastLinkIndex = linkRegex.lastIndex;
            }
            // Text after last link
            if (lastLinkIndex < line.length) {
                parts.push({ type: 'text', content: line.slice(lastLinkIndex) });
            }

            // Now render the parts, processing bold within text parts
            return (
                <div key={i} className={`${line.trim() === "" ? "h-2" : "mb-1"}`}>
                    {parts.length === 0 ? (
                        // No links, just render text with bold processing
                        processBold(line)
                    ) : (
                        parts.map((part, idx) => {
                            if (part.type === 'link') {
                                return (
                                    <a
                                        key={idx}
                                        href={part.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-2 break-all bg-blue-50 px-1.5 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                        {part.text} <BsArrowUpRight size={10} />
                                    </a>
                                );
                            } else {
                                return <span key={idx}>{processBold(part.content)}</span>;
                            }
                        })
                    )}
                </div>
            );
        });
    };

    const processBold = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 flex items-center justify-center py-10 pt-20">

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[80vh]">


                {/* Desktop: Left Side Panel */}
                <div className="hidden md:flex md:w-1/3 bg-blue-600 p-6 flex-col items-center justify-center text-white text-center relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <img src={chatbotImg} alt="Bot" className="w-40 h-40 object-contain mb-4 drop-shadow-lg z-10" />
                    <h2 className="text-2xl font-bold z-10">Verification Bot</h2>
                    <p className="text-blue-100 text-sm mt-2 z-10">AI-powered analysis to keep your career safe.</p>
                </div>

                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden bg-blue-600 p-4 flex items-center gap-3 text-white shadow-md z-20">
                    <div className="bg-white/20 p-2 rounded-full">
                        <BsShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">InternVault AI</h2>
                        <p className="text-xs text-blue-100 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50 relative min-h-0">
                    {/* Desktop Header */}
                    <div className="hidden md:flex p-4 border-b border-gray-200 bg-white justify-between items-center shadow-sm z-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <BsRobot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">InternVault Assistant</h3>
                                <p className="text-xs text-gray-500">Always check independently.</p>
                            </div>
                        </div>
                        <div className="text-gray-400">
                            <BsInfoCircle />
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                    >
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                                <div className={`max-w-[85%] md:max-w-[75%] p-3.5 rounded-2xl text-sm md:text-base shadow-sm ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                    } break-words whitespace-pre-wrap overflow-hidden`}>
                                    {formatMessage(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 md:p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Type a company name..."
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <BsSend size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
