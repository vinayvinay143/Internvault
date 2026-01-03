import { useState, useRef, useEffect } from "react";
import { BsSend, BsRobot, BsShieldCheck, BsChatDots, BsInfoCircle, BsArrowUpRight, BsImage, BsX, BsCheckCircleFill, BsXCircleFill, BsExclamationTriangleFill, BsShieldFillCheck, BsShieldFillExclamation, BsSearch, BsBuilding, BsFileEarmarkText, BsLightbulb, BsEmojiSmile, BsCameraFill, BsChevronDown } from "react-icons/bs";
import chatbotImg from "../assets/chatbot.png";
import { GroqService } from "../services/groq";
import toast from "react-hot-toast";

export function InternChat({ user }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "I'm your AI-powered assistant to help protect you from fake internship scams. Type a company name or upload a screenshot!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY;

    // Check if query is internship/company related
    const isInternshipRelated = (query) => {
        // We now delegate off-topic detection primarily to the AI model
        // This allows users to type just a company name like "Null Class" without extra keywords
        // Simple length check to filter empty/very short noise
        return query && query.length > 2;
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
                    query: query.includes('.') ? query : `${query} official website internship reviews authenticity check`,
                    search_depth: "basic",
                    max_results: 5,
                    include_answer: true,
                    // Removed include_domains to find official websites and all registries
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

    // Handle image file selection
    const handleImageSelect = (e) => {
        // Check if user is logged in
        if (!user) {
            toast.error('🔒 Please login to use image analysis feature');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error(' Please select a valid image file (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(' Image size must be less than 5MB');
            return;
        }

        setSelectedImage(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Convert image to base64 for Gemini API
    const imageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Remove the data:image/xxx;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() && !selectedImage) return;

        if (!apiKey) {
            console.error("API Key missing in environment variables");
            setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Configuration Error: API Key is missing. Check VITE_GROQ_API_KEY in .env" }]);
            return;
        }

        const userMessage = input;
        const imageToAnalyze = selectedImage;
        const imagePreviewUrl = imagePreview;

        setInput("");
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Add user message with image if present
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: userMessage || "[Uploaded screenshot for analysis]",
                image: imagePreviewUrl
            }
        ]);
        setIsLoading(true);

        // If image is uploaded, use Groq Llama 4 Vision (Scout)
        if (imageToAnalyze) {
            try {


                // Convert image to data URL format for Groq
                const reader = new FileReader();
                const imageDataUrl = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageToAnalyze);
                });

                const prompt = `You are an expert Internship Verification AI Assistant analyzing a screenshot of an internship/job offer.

${userMessage ? `User's specific question: ${userMessage}\n` : ''}

🚨 CRITICAL RULE #1: If you see ANY request for payment (training fee, security deposit, registration charges) → IMMEDIATE ❌ FAKE verdict.
🚨 CRITICAL RULE #2: If the image is an OFFER LETTER or JOINING LETTER, it **MUST** contain a CIN (Corporate Identification Number) or MCA Registration. If missing → VERDICT: ❌ FAKE.

ANALYSIS GUIDELINES:

1. **Check for SCAM indicators (Highest Priority):**
   - Asking for money (Top Red Flag 🚩)
   - "Pay ₹X for training/certificate"
   - Unprofessional email (@gmail, @yahoo)
   - Unrealistic salary (e.g. ₹50k for fresher)
   - "Limited seats", "Pay now" urgency
   - Course selling in disguise

2. **Check for LEGITIMATE indicators:**
   - Professional email (hr@company.com)
   - Clear company branding/logo
   - Detailed job description (role, duration, stipend)
   - Proper selection process mentioned (interview, task)
   - No hidden fees

3. **OUTPUT FORMAT (STRICT):**

**1. VERDICT**
 REAL /  FAKE

**2. REASONS**
- [First specific reason from screenshot analysis]
- [Second specific reason from screenshot analysis]

**3. PROOFS**
1. Email domain is @gmail.com - [Source](Screenshot Analysis)
2. Payment of ₹5000 requested - [Source](Screenshot Analysis)
3. No company logo visible - [Source](Screenshot Analysis)

 FORMATTING: 
- Provide exactly 2 reasons
- Each proof should describe what you observed as plain text
- Add " - [Source](Screenshot Analysis)" after each observation
- Keep each proof on ONE line

Be specific about what you see.`;

                const analysis = await GroqService.generateFromImage(prompt, imageDataUrl);

                setMessages((prev) => [...prev, { role: "assistant", text: analysis }]);
            } catch (error) {
                console.error("Image analysis error:", error);
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", text: `**Image Analysis Failed**\n\n${error.message}\n\nPlease try again or describe the internship offer in text.` },
                ]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // Check if query is internship-related (for text-only queries)
        if (!isInternshipRelated(userMessage)) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                text: " **Off-Topic Query Detected**: I specialize in verifying internships and companies.\nPlease ask me about a specific company, job offer, or internship opportunity."
            }]);
            setIsLoading(false);
            return;
        }



        try {
            // Search the web for company information
            let searchResults = null;
            let searchContext = "";
            let rawSources = [];


            searchResults = await searchCompanyInfo(userMessage);

            if (searchResults && searchResults.results && searchResults.results.length > 0) {

                rawSources = searchResults.results;

                // Build context from search results
                searchContext = "\\n\\n REAL-TIME WEB SEARCH RESULTS:\\n\\n";

                if (searchResults.answer) {
                    searchContext += `Summary: ${searchResults.answer}\\n\\n`;
                }

                searchContext += "Sources found:\\n";
                searchResults.results.forEach((result, idx) => {
                    // Truncate content to avoid hitting token limits
                    const truncatedContent = result.content ? result.content.substring(0, 500) + "..." : "No content";
                    searchContext += `${idx + 1}. ${result.title}\n   ${truncatedContent}\n   URL: ${result.url}\n\n`;
                });
            } else {

                searchContext = "\\n\\n CRITICAL: Web search returned NO matching results. This might be a ghost company.\\n";
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
                            content: `You are an expert Internship Verification AI Assistant for InternVault. Your PRIMARY goal is to protect students from scams.

 CRITICAL SCAM DETECTION RULES (HIGHEST PRIORITY):

1. **IMMEDIATE FAKE if reviews on Trusted Platforms mention these TRAITS:**
   - **Upfront Payment Requests:** Asking for fees for training, registration, security deposit, or placement.
   - **No Official Presence:** No proper website, LinkedIn page, or verifiable contact details.
   - **Generic/Vague Job Descriptions:** Listings without clear responsibilities or required skills.
   - **Unprofessional Communication:** Poor grammar, informal emails, or personal email IDs (@gmail/@yahoo).
   - **Too-Good-To-Be-True:** Extremely high stipends for freshers, guaranteed placements, or unrealistic perks.
   - **No Interview/Screening:** Offers made without a proper interview or skill assessment.
   - **Pressure Tactics:** Pushing for immediate acceptance/payment or threatening to withdraw the offer.

2. **VERIFICATION CHECKLIST (Must Verify):**
   - **Official Presence:** Does the company have an official website and active social media profiles?
   - **Job Details:** Are role, duration, stipend, and location clearly explained?
   - **Contact Info:** Is the email address professional (e.g., hr@company.com)?
   - **Reputation (TRUSTED SOURCES ONLY):** Check for reviews/experiences ONLY from these platforms:
     * Reddit.com (r/internships, r/cscareerquestions)
     * Quora.com
     * Glassdoor.com
     * Indeed.com
     * FishbowlApp.com
     * Handshake.com
     * WayUp.com
     * Internshala.com
     * LinkedIn.com
     * ElevateSkill
     * InternsInAsia
     * **RULE:** If negative reviews exist on these sites →  FAKE.
   - **Legality:** Does the company have a verified registration (CIN, MCA, Zauba)?
   - **Selection Process:** Is there a proper interview/task/screening process?
   - **Too Good To Be True:** Are there unrealistic promises (high pay for little work)?

3. **CONTEXT AWARENESS (Crucial):**
   - **Dual Meanings:** If a user query sounds like a technical term (e.g., "Null Class", "Code Soft", "Byte"), CHECK if there is a company by that name in the search results.
   - **Prioritize Company:** If even ONE search result mentions a "Company", "Services", "Solutions", or "LLP" matching the name, treat it as a COMPANY inquiry, NOT off-topic.
   - **Do NOT** mark as "Off Topic" if the user asks about a specific name that turns out to be a company, even if it has a technical name.
   - **Course Selling:** If a company asks for money for training/internship → VERDICT: **FAKE** (Reason: "Pay-to-work scheme / Course selling disguised as internship").
   - **Innoversity/NullClass cases:** Be careful to distinguish between "EdTech Company" (Real) and "Fake Internship" (Scam). If the company exists but the internship is "pay-to-work", verdict is FAKE (Internship is fake), but acknowledge the company exists.

4. **TOPIC & ENTITY CHECK (STRICT):**
   - **Scope:** I verify companies, startups, and internship offers.
   - **Off-Topic:** Only if the query is clearly about *concepts* (e.g. "What is null in Java?", "How to write a for loop") with NO intent to verify a company.
   - **Educational Institutions:** Colleges/Universities are OFF TOPIC unless checking a specific job offer.
   - **Unknown Companies:** IF search results are empty or reveal NO information about the company:
     - Verdict: **FAKE**
     - Reason: "No verifiable digital footprint found. High risk of scam."

5. **DECISION HIERARCHY** (Follow in order):
   
   Step 1: Check for "Pay to work" / "Registration Fee" / "Security Deposit" →  FAKE
   Step 2: Check for negative reviews confirming fraud/scam →  FAKE
   Step 3: Check is it a "Course Selling" scheme? →  FAKE
   Step 4: Check for official registration + professional presence →  REAL
   Step 5: **No information found / Unknown company →  FAKE**
   Step 6: Only positive reviews + official website →  REAL

6. **OUTPUT FORMAT (STRICT - BINARY ONLY):**

**1. VERDICT**
 REAL / FAKE

**2. REASONS**
- [First specific reason based on search evidence]
- [Second specific reason based on search evidence]

**3. PROOFS**
1. Source Title - [Source](actual_url)
2. Source Title - [Source](actual_url)
3. Source Title - [Source](actual_url)

 CRITICAL FORMATTING RULES:
- **VERDICT MUST BE ONLY "REAL" OR "FAKE". NO "SUSPICIOUS".**
- Provide exactly 2 reasons (not 3)
- Write the source title as plain text, then add " - [Source](URL)"
- ONLY the word "Source" should be hyperlinked, NOT the title
- Extract actual URLs from the "Sources found" section below
- Each proof must be on ONE line
- Do NOT add "View Data Sources" - that's added by the UI

***

EXAMPLES:

Example 1 (SCAM):
Search contains: "Kintsugi asked me to pay for training"
→ Output:

**1. VERDICT**
 FAKE

**2. REASONS**
- Multiple sources report they ask students to pay for training courses
- This is a common internship scam tactic

**3. PROOFS**
1. Reddit Discussion - Kintsugi Scam Alert - [Source](https://reddit.com/r/scams/kintsugi)
2. Quora - Is Kintsugi Legitimate? - [Source](https://quora.com/kintsugi-reviews)
3. Scam Adviser Report - [Source](https://scamadviser.com/kintsugi)

Example 2 (REAL):
Search contains: "Google Inc, CIN: U12345MH2004PTC123456, official website google.com"
→ Output:

**1. VERDICT**
 REAL

**2. REASONS**
- Officially registered company with verified CIN
- No scam reports found in search results

**3. PROOFS**
1. MCA Corporate Registration - [Source](https://mca.gov.in/mcafoportal/companyLLPMasterData.do)
2. Google Official Website - [Source](https://www.google.com)
3. Glassdoor Employee Reviews - [Source](https://glassdoor.com/Reviews/Google-Reviews)

${searchContext}`
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    temperature: 0.0, // Maximum consistency and rule-following
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();


            const text = data.choices?.[0]?.message?.content;

            if (!text) throw new Error("Empty response from AI");

            // Append response AND raw sources for debugging/transparency
            setMessages((prev) => [...prev, {
                role: "assistant",
                text: text,
                sources: rawSources // Store raw sources in message object
            }]);
        } catch (error) {
            console.error("Groq API Request Failed:", error);

            let displayError = "Sorry, I couldn't connect to the server.";

            if (error.message.includes("401")) displayError = "⚠️ Invalid API Key: Please check your Groq API key in .env";
            if (error.message.includes("429")) displayError = "⚠️ Too Many Requests: Please wait a moment.";
            if (error.message.includes("500")) displayError = "⚠️ Server Error: Groq service temporarily unavailable.";
            if (error.message.includes("Network")) displayError = "⚠️ Network Error: Check your internet connection.";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: `Sorry, something went wrong.\\n\\nError: ${error.message}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Custom formatter for basic markdown (links and bold)
    const formatMessage = (text) => {
        // Define helpers FIRST before using them
        const processBold = (text) => {
            if (!text) return null;
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };

        const renderPart = (part, key) => {
            if (part.type === 'link') {
                return (
                    <a
                        key={key}
                        href={part.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-2 bg-blue-50 px-1.5 py-0.5 rounded-md hover:bg-blue-100 transition-colors mx-1"
                    >
                        {part.text} <BsArrowUpRight size={10} />
                    </a>
                );
            } else if (part.type === 'raw-link') {
                return (
                    <a
                        key={key}
                        href={part.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-2 break-all bg-blue-50 px-1.5 py-0.5 rounded-md hover:bg-blue-100 transition-colors mx-1 text-xs font-medium"
                    >
                        Source <BsArrowUpRight size={10} className="inline ml-0.5" />
                    </a>
                );
            } else {
                return <span key={key}>{processBold(part.content)}</span>;
            }
        };

        // Regex for links: [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        // Regex for raw URLs (http/https)
        const urlRegex = /(https?:\/\/[^\s)]+)/g;

        const processRawUrls = (text) => {
            const parts = [];
            const split = text.split(urlRegex);
            for (let i = 0; i < split.length; i++) {
                const part = split[i];
                if (part.match(urlRegex)) {
                    parts.push({ type: 'raw-link', url: part });
                } else if (part) {
                    parts.push({ type: 'text', content: part });
                }
            }
            return parts;
        };

        const processLine = (text) => {
            const parts = [];
            const markdownLinks = [];
            let match;
            while ((match = linkRegex.exec(text)) !== null) {
                markdownLinks.push({ index: match.index, length: match[0].length, text: match[1], url: match[2] });
            }

            let cursor = 0;
            markdownLinks.forEach(link => {
                if (link.index > cursor) {
                    const subText = text.substring(cursor, link.index);
                    parts.push(...processRawUrls(subText));
                }
                parts.push({ type: 'link', text: link.text, url: link.url });
                cursor = link.index + link.length;
            });
            if (cursor < text.length) {
                parts.push(...processRawUrls(text.substring(cursor)));
            }
            if (parts.length === 0 && text.length > 0) {
                return processRawUrls(text);
            }
            return parts;
        };

        // Split by newlines to handle paragraphs
        return text.split('\n').map((line, i) => {
            // Check for Assessment line with special formatting
            const assessmentRegex = /^🔍\s+\*\*Assessment\*\*:\s*(.+)$/;
            const assessmentMatch = line.match(assessmentRegex);

            if (assessmentMatch) {
                const assessment = assessmentMatch[1].trim();
                let badgeColor = "bg-gray-100 text-gray-800";
                let icon = <BsInfoCircle />;

                if (assessment.toLowerCase().includes('legitimate') || assessment.toLowerCase().includes('real')) {
                    badgeColor = "bg-green-100 text-green-800 border-2 border-green-300";
                    icon = <BsCheckCircleFill className="text-green-600" />;
                } else if (assessment.toLowerCase().includes('scam') || assessment.toLowerCase().includes('fake')) {
                    badgeColor = "bg-red-100 text-red-800 border-2 border-red-300";
                    icon = <BsXCircleFill className="text-red-600" />;
                } else if (assessment.toLowerCase().includes('suspicious') || assessment.toLowerCase().includes('caution')) {
                    badgeColor = "bg-yellow-100 text-yellow-800 border-2 border-yellow-300";
                    icon = <BsExclamationTriangleFill className="text-yellow-600" />;
                }

                return (
                    <div key={i} className={`${badgeColor} rounded-lg p-4 my-3 flex items-center gap-3 shadow-sm`}>
                        <div className="text-2xl">{icon}</div>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide opacity-70">Verification Result</div>
                            <div className="text-lg font-bold">{assessment}</div>
                        </div>
                    </div>
                );
            }

            // Regex for headers: ### Text
            const headerRegex = /^###\s+(.+)$/;
            const headerMatch = line.match(headerRegex);

            if (headerMatch) {
                const headerText = headerMatch[1];
                let headerIcon = null;

                // Add icons based on header content
                if (headerText.includes('🚩') || headerText.toLowerCase().includes('red flag')) {
                    headerIcon = <BsXCircleFill className="text-red-500" />;
                } else if (headerText.includes('✅') || headerText.toLowerCase().includes('green flag')) {
                    headerIcon = <BsCheckCircleFill className="text-green-500" />;
                } else if (headerText.includes('🔗') || headerText.toLowerCase().includes('proof') || headerText.toLowerCase().includes('source')) {
                    headerIcon = <BsShieldFillCheck className="text-blue-500" />;
                }

                return (
                    <h3 key={i} className="text-sm font-bold text-gray-700 uppercase tracking-wider mt-4 mb-2 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                        {headerIcon}
                        {headerText}
                    </h3>
                );
            }

            const parsedParts = processLine(line);

            // Check for bullet points with special icons
            const bulletRegex = /^[-•]\s+(.+)$/;
            const bulletMatch = line.match(bulletRegex);

            // If the whole line is a bullet point, we might want to preserve that structure but still process links inside
            if (bulletMatch) {
                const bulletText = bulletMatch[1];
                let bulletIcon = <span className="text-blue-500">•</span>;
                let bulletClass = "text-gray-700";

                // Detect if it's a red flag or green flag based on context
                const previousLines = text.split('\n').slice(Math.max(0, i - 5), i).join(' ').toLowerCase();

                if (previousLines.includes('red flag') || previousLines.includes('🚩')) {
                    bulletIcon = <BsXCircleFill className="text-red-500 flex-shrink-0" size={12} />;
                    bulletClass = "text-red-700";
                } else if (previousLines.includes('green flag') || previousLines.includes('✅')) {
                    bulletIcon = <BsCheckCircleFill className="text-green-500 flex-shrink-0" size={12} />;
                    bulletClass = "text-green-700";
                }

                // Reprocess the bullet content to find links
                const bulletContentParts = processLine(bulletText);

                return (
                    <div key={i} className={`flex items-start gap-2 mb-1 ${bulletClass}`}>
                        <div className="mt-1">{bulletIcon}</div>
                        <div className="flex-1 break-words">
                            {bulletContentParts.map((part, idx) => renderPart(part, idx))}
                        </div>
                    </div>
                );
            }

            // Now render the parts, processing bold within text parts
            return (
                <div key={i} className={`${line.trim() === "" ? "h-2" : "mb-1"} break-words`}>
                    {parsedParts.map((part, idx) => renderPart(part, idx))}
                </div>
            );
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
                    <div className="hidden md:flex p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white justify-between items-center shadow-sm z-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                                <BsShieldCheck size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    InternVault Assistant
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">AI Powered</span>
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Ready to verify internships
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                            <BsInfoCircle size={20} />
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                    >
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl text-sm md:text-base shadow-sm ${msg.role === "user"
                                    ? (msg.text === "[Uploaded screenshot for analysis]" ? "bg-transparent text-black" : "bg-blue-600 text-white rounded-br-none")
                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                    } break-words overflow-hidden`}>
                                    {/* Display image if present */}
                                    {msg.image && (
                                        <div className="mb-0">
                                            <img
                                                src={msg.image}
                                                alt="Uploaded screenshot"
                                                className="rounded-lg max-w-full h-auto max-h-64 object-contain shadow-sm"
                                            />
                                        </div>
                                    )}

                                    {/* Render markdown message (exclude placeholder text if image exists) */}
                                    {msg.text !== "[Uploaded screenshot for analysis]" && (
                                        <div className={`p-4 ${msg.image ? "pt-2" : ""}`}>
                                            {formatMessage(msg.text)}

                                            {/* Debugging: Show raw sources if available */}
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-4 border-t border-gray-100 pt-3">
                                                    <details className="group">
                                                        <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors list-none">
                                                            <span>View Data Sources</span>
                                                            <BsChevronDown className="transition-transform group-open:rotate-180" size={10} />
                                                        </summary>
                                                        <div className="mt-3 space-y-3 pl-2 border-l-2 border-blue-50">
                                                            {msg.sources.map((source, idx) => (
                                                                <div key={idx} className="text-xs text-gray-600">
                                                                    <div className="font-semibold text-gray-800 truncate" title={source.title}>{source.title}</div>
                                                                    <div className="line-clamp-2 italic opacity-80 my-0.5">{source.content}</div>
                                                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                                        {source.url ? new URL(source.url).hostname.replace('www.', '') : "Source"} <BsArrowUpRight size={8} />
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in">
                                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">Analyzing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 md:p-4 bg-white border-t border-gray-100">
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="rounded-lg max-h-32 border-2 border-blue-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                >
                                    <BsX size={16} />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSend} className="flex gap-2 relative">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            {/* Image upload button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="bg-gradient-to-br from-blue-300 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 hover:shadow-lg"
                                title="Upload screenshot"
                            >
                                <BsCameraFill size={20} />
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Type a company name or upload screenshot..."
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || (!input.trim() && !selectedImage)}
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
