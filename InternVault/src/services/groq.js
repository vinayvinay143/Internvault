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
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error("Groq Proxy Error (Text):", error);
            throw new Error(`AI Analysis Failed: ${error.message}`);
        }
    },

    /**
     * Analyzes JSON from a text prompt (enforces JSON output)
     * @param {string} prompt - The prompt to send
     * @returns {Promise<Object>} - Parsed JSON object
     */
    async generateJSON(prompt) {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        try {
            const jsonPrompt = `${prompt} \n\n IMPORTANT: Output ONLY valid JSON code. No markdown formatting, no backticks, just the raw JSON object.`;

            const response = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: jsonPrompt }],
                    model: "llama-3.3-70b-versatile",
                    response_format: { type: "json_object" },
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            return JSON.parse(content);

        } catch (error) {
            console.error("Groq Proxy Error (JSON):", error);
            throw new Error(`AI JSON Parsing Failed: ${error.message}`);
        }
    },

    /**
     * Analyzes an image using Llama 3.2 Vision
     * @param {string} prompt - The prompt
     * @param {string} base64Image - Base64 string of the image (data:image/png;base64,...)
     * @returns {Promise<string>} - Analysis text
     */
    async generateFromImage(prompt, base64Image) {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        try {
            // Route through backend proxy to avoid browser CORS restrictions
            const response = await fetch(`${API_URL}/ai/vision-analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt, base64Image }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.content;
        } catch (error) {
            console.error("Groq Vision Error:", error);
            throw new Error(`Vision Analysis Failed: ${error.message}`);
        }
    }
};
