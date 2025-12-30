import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// ERROR HANDLING TIP: If this fails, user likely hasn't set VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Service to handle all interactions with Gemini AI
 */
export const GeminiService = {
    /**
     * Generates content from a text prompt
     * @param {string} prompt - The prompt to send to AI
     * @returns {Promise<string>} - The generated text
     */
    async generateText(prompt) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Failed to generate content. Please check your API key and try again.");
        }
    },

    /**
     * Analyzes JSON from a text prompt (enforces JSON output)
     * @param {string} prompt - The prompt to send
     * @returns {Promise<Object>} - Parsed JSON object
     */
    async generateJSON(prompt) {
        try {
            // We append instructions to force JSON format to make parsing reliable
            const jsonPrompt = `${prompt} \n\n IMPORTANT: Output ONLY valid JSON code. No markdown formatting, no backticks, just the raw JSON object.`;

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(jsonPrompt);
            const response = await result.response;

            // Clean up the text to ensure it's valid JSON
            let text = response.text();
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(text);
        } catch (error) {
            console.error("Gemini JSON Error:", error);
            throw new Error("Failed to parse AI response. Please try again.");
        }
    },

    /**
     * Analyzes an image (screenshot) for internship scam detection
     * @param {string} imageBase64 - Base64 encoded image data (without data:image prefix)
     * @param {string} userQuery - Optional user question about the image
     * @returns {Promise<string>} - Analysis result with scam assessment
     */
    async analyzeImageForScam(imageBase64, userQuery = "") {
        // Try multiple model names as fallback
        const modelNames = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro-vision",
            "gemini-1.5-flash-latest"
        ];

        let lastError = null;

        for (const modelName of modelNames) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `You are an expert Internship Verification AI Assistant analyzing a screenshot of an internship/job offer.

Your task is to:
1. Extract ALL visible text from this image
2. Identify key details: company name, email domain, contact info, salary/payment details, job description
3. Analyze for RED FLAGS indicating potential scams:
   - Requests for upfront payment or "registration fees"
   - Unprofessional email domains (@gmail.com, @yahoo.com instead of company domain)
   - Poor grammar, spelling errors, or unprofessional formatting
   - Unrealistic salary promises for minimal work
   - Suspicious URLs or contact information
   - Generic/vague company information
   - Pressure tactics or urgency
   - Missing company logo or poor design quality
   - Requests for personal financial information
4. Analyze for GREEN FLAGS indicating legitimacy:
   - Professional company email domain
   - Clear company branding and logo
   - Specific job description and responsibilities
   - Realistic compensation
   - Professional formatting and language
   - Verifiable contact information

${userQuery ? `User's specific question: ${userQuery}\n` : ''}

RESPONSE FORMAT:

🔍 **Assessment**: [Legitimate / Suspicious / Likely Scam]

📋 **Extracted Information**:
- Company: [name]
- Email/Contact: [details]
- Position: [title]
- Key Details: [important info]

🚩 **Red Flags Found** (if any):
- [List specific red flags with evidence from the image]

✅ **Green Flags Found** (if any):
- [List positive indicators]

⚠️ **Recommendation**:
[Clear advice on whether to proceed or avoid, with reasoning]

🔍 **How to Verify**:
1. [Specific verification step]
2. [Another verification step]
3. [Third verification step]

Be specific and cite what you see in the image. If the image quality is poor or text is unclear, mention that.`;

                const imagePart = {
                    inlineData: {
                        data: imageBase64,
                        mimeType: "image/jpeg"
                    }
                };

                const result = await model.generateContent([prompt, imagePart]);
                const response = await result.response;
                console.log(`✅ Success with model: ${modelName}`);
                return response.text();
            } catch (error) {
                console.log(`❌ Failed with model ${modelName}:`, error.message);
                lastError = error;
                // Continue to next model
                continue;
            }
        }

        // If all models failed, throw detailed error
        console.error("All Gemini vision models failed:", lastError);

        if (lastError?.message?.includes("API key")) {
            throw new Error("⚠️ **Gemini API Key Issue**\n\nYour API key is invalid or missing. Please:\n1. Visit https://aistudio.google.com/app/apikey\n2. Create a new API key\n3. Add it to your .env file as VITE_GEMINI_API_KEY=your_key_here\n4. Restart the dev server");
        }

        if (lastError?.message?.includes("quota") || lastError?.message?.includes("429")) {
            throw new Error("⚠️ **API Quota Exceeded**\n\nYou've hit the rate limit. Please:\n- Wait a few minutes and try again\n- Check your quota at https://aistudio.google.com/");
        }

        if (lastError?.message?.includes("not found") || lastError?.message?.includes("404")) {
            throw new Error("⚠️ **Vision Models Not Available**\n\nYour API key doesn't have access to Gemini vision models.\n\n**Solution:** The free Gemini API might have restrictions on vision features.\n\n**Alternative:** You can still verify internships by:\n1. Typing the company name and details manually\n2. The chatbot will use web search to verify legitimacy\n\nSorry for the inconvenience! Google's free tier has limitations on vision models.");
        }

        throw new Error(`⚠️ **Image Analysis Unavailable**\n\n${lastError?.message || 'Unknown error'}\n\nPlease describe the internship offer in text instead, and I'll help verify it!`);
    }
};
