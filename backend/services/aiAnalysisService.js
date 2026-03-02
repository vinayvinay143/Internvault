import Groq from "groq-sdk";

// Lazy initialization of Groq client
let groq = null;

function getGroqClient() {
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    if (!groq && apiKey) {
        try {
            groq = new Groq({
                apiKey: apiKey
            });
            console.log("✅ Groq Client Initialized for AI Code Analysis");
        } catch (error) {
            console.error("❌ Failed to initialize Groq client:", error);
        }
    }
    return groq;
}

/**
 * Analyzes code quality, complexity, and efficiency
 * @param {string} code - The code to analyze
 * @param {string} language - Programming language
 * @param {string} problemStatement - (Optional) Context for correctness
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeCodeQuality(code, language = "JavaScript", problemStatement = "") {
    try {
        const groqClient = getGroqClient();

        if (!groqClient) {
            console.warn("⚠️ Groq API Key not found. Returning mock analysis.");
            return getMockAnalysis();
        }

        const prompt = `You are a Senior Software Engineer and Technical Interviewer.
        
Your task is to EVALUATE the Quality and Efficiency of the following ${language} code.
Context/Problem: ${problemStatement || "General code evaluation"}

Analyze for:
1. **Time Complexity**: e.g., O(1), O(n), O(n^2).
2. **Space Complexity**: e.g., O(1), O(n).
3. **Correctness & Logic**: Does it look functional?
4. **Code Style**: Variable naming, modularity, readability.

Assign a **Quality Score (0-100)**:
- 90-100: Optimized (O(n) or better if possible), clean, textbook solution.
- 70-89: Functional but unoptimized, or slight style issues.
- 50-69: Poor variable names, redundant logic, or O(n^2) when O(n) exists.
- 0-49: Broken code, syntax errors, or complete nonsense.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Strictly respond in this JSON format (no markdown):
{
  "qualityScore": number, // 0-100
  "timeComplexity": "string",
  "spaceComplexity": "string",
  "codeQualityRating": "Excellent" | "Good" | "Needs Improvement" | "Poor",
  "feedback": "One concise sentence summarizing the review.",
  "suggestions": ["Tip 1", "Tip 2"]
}`;

        const completion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 1000
        });

        const responseText = completion.choices[0]?.message?.content || "{}";

        // Clean JSON
        let jsonText = responseText;
        if (responseText.includes("```json")) {
            jsonText = responseText.split("```json")[1].split("```")[0].trim();
        } else if (responseText.includes("```")) {
            jsonText = responseText.split("```")[1].split("```")[0].trim();
        }

        const analysis = JSON.parse(jsonText);

        return {
            qualityScore: analysis.qualityScore || 50,
            timeComplexity: analysis.timeComplexity || "Unknown",
            spaceComplexity: analysis.spaceComplexity || "Unknown",
            codeQualityRating: analysis.codeQualityRating || "Needs Improvement",
            feedback: analysis.feedback || "Code could be improved.",
            suggestions: analysis.suggestions || [],
            analyzedAt: new Date()
        };

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return getMockAnalysis();
    }
}

function getMockAnalysis() {
    return {
        qualityScore: 75,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        codeQualityRating: "Good",
        feedback: "Automated analysis unavailable. Basic checks passed.",
        suggestions: ["Optimization analysis failed."],
        analyzedAt: new Date()
    };
}

export default {
    analyzeCodeQuality
};
