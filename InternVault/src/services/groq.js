/**
 * Service to handle all interactions with Groq AI (Llama 3)
 */
export const GroqService = {
    /**
     * Generates content from a text prompt
     * @param {string} prompt - The prompt to send to AI
     * @returns {Promise<string>} - The generated text
     */
    async generateText(prompt) {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;

        if (!apiKey) {
            throw new Error("Missing VITE_GROQ_API_KEY. Add it in Vercel Project Settings.");
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error("Groq API Error:", error);
            throw new Error("Failed to generate content. Please check your API key.");
        }
    },

    /**
     * Analyzes JSON from a text prompt (enforces JSON output)
     * @param {string} prompt - The prompt to send
     * @returns {Promise<Object>} - Parsed JSON object
     */
    async generateJSON(prompt) {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;

        if (!apiKey) {
            throw new Error("Missing VITE_GROQ_API_KEY in environment variables.");
        }

        try {
            // We append instructions to force JSON format to make parsing reliable
            const jsonPrompt = `${prompt} \n\n IMPORTANT: Output ONLY valid JSON code. No markdown formatting, no backticks, just the raw JSON object.`;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "user", content: jsonPrompt }
                    ],
                    response_format: { type: "json_object" }, // Groq supports JSON mode
                    max_tokens: 2048,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            return JSON.parse(content);

        } catch (error) {
            console.error("Groq JSON Error:", error);
            throw new Error("Failed to parse AI response. Please try again.");
        }
    },

    /**
     * Analyzes an image using Llama 3.2 Vision
     * @param {string} prompt - The prompt
     * @param {string} base64Image - Base64 string of the image (data:image/png;base64,...)
     * @returns {Promise<string>} - Analysis text
     */
    async generateFromImage(prompt, base64Image) {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) throw new Error("Missing VITE_GROQ_API_KEY. Add it in Vercel Project Settings.");

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout-17b-16e-instruct", // Currently active Llama 4 Scout model
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: base64Image
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Groq Vision Error:", error);
            throw new Error(`Vision Analysis Failed: ${error.message}`);
        }
    }
};
