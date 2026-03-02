import express from "express";

const router = express.Router();

// POST /api/ai/vision-analyze - Proxy Groq Vision API calls from frontend
// This avoids CORS issues since browser cannot directly call api.groq.com
router.post("/vision-analyze", async (req, res) => {
    try {
        const { prompt, base64Image } = req.body;

        if (!prompt || !base64Image) {
            return res.status(400).json({ error: "prompt and base64Image are required" });
        }

        const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Groq API key not configured on server" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: { url: base64Image }
                            }
                        ]
                    }
                ],
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Groq Vision API Error:", error);
            return res.status(response.status).json({
                error: error.error?.message || `Groq API Error: ${response.statusText}`
            });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        res.json({ content });

    } catch (error) {
        console.error("Vision proxy error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
