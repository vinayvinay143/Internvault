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
            console.log("✅ Groq Client Initialized for AI Code Detection");
        } catch (error) {
            console.error("❌ Failed to initialize Groq client:", error);
        }
    }
    return groq;
}

/**
 * Analyzes code to detect if it's AI-generated and identifies the likely AI tool
 * @param {string} code - The code to analyze
 * @param {string} language - Programming language of the code
 * @returns {Promise<Object>} Detection results
 */
export async function analyzeCode(code, language = "Unknown") {
    try {
        // First, check for obvious patterns
        const patterns = detectAIPatterns(code);

        // Check if Groq API is available
        const groqClient = getGroqClient();

        if (!groqClient) {
            console.warn("⚠️ Groq API Key not found (checked GROQ_API_KEY and VITE_GROQ_API_KEY). Using pattern-based detection only.");
            const isAIGenerated = patterns.length >= 2; // Stricter fallback: 2 patterns is enough

            return {
                isAIGenerated,
                confidence: isAIGenerated ? 70 : 30,
                suspectedTool: isAIGenerated ? "Unknown AI" : "Human-written",
                patterns,
                reasoning: "Pattern-based detection only (Groq API not configured)",
                analyzedAt: new Date()
            };
        }

        // Use Groq AI for deep analysis
        const prompt = `You are an expert code analyst specializing in detecting AI-generated code (ChatGPT, Claude, Copilot, etc.).
        
Your task is to analyze the following ${language} code and determine if it was written by an AI or a human. BE SKEPTICAL. AI code often looks "perfect" but generic.

Analyze for:
1. Is it AI-generated, human-written, or likely AI-assisted?
2. Confidence level (0-100%). If it looks standard/textbook, lean towards AI.
3. Which AI tool most likely generated it?
4. What specific patterns indicate AI generation? (e.g., textbook comments, over-modularization)

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Strictly respond in this JSON format:
{
  "isAIGenerated": true/false,
  "confidence": 0-100,
  "suspectedTool": "ChatGPT" | "Claude" | "GitHub Copilot" | "Human-written",
  "patterns": ["pattern1", "pattern2"],
  "reasoning": "explanation"
}`;

        const completion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 1000
        });

        const responseText = completion.choices[0]?.message?.content || "{}";

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = responseText;
        if (responseText.includes("```json")) {
            jsonText = responseText.split("```json")[1].split("```")[0].trim();
        } else if (responseText.includes("```")) {
            jsonText = responseText.split("```")[1].split("```")[0].trim();
        }

        const aiAnalysis = JSON.parse(jsonText);

        // Combine pattern detection with AI analysis
        const combinedPatterns = [...new Set([...patterns, ...(aiAnalysis.patterns || [])])];

        return {
            isAIGenerated: aiAnalysis.isAIGenerated || false,
            confidence: Math.min(100, Math.max(0, aiAnalysis.confidence || 0)),
            suspectedTool: aiAnalysis.suspectedTool || "Human-written",
            patterns: combinedPatterns,
            reasoning: aiAnalysis.reasoning || "",
            analyzedAt: new Date()
        };

    } catch (error) {
        console.error("Code analysis error:", error);

        // Fallback to pattern-based detection
        const patterns = detectAIPatterns(code);
        const isAIGenerated = patterns.length >= 3;

        return {
            isAIGenerated,
            confidence: isAIGenerated ? 60 : 40,
            suspectedTool: isAIGenerated ? "Unknown AI" : "Human-written",
            patterns,
            reasoning: "Fallback pattern-based detection",
            analyzedAt: new Date()
        };
    }
}

/**
 * Detects common AI code patterns using heuristics
 * @param {string} code - The code to analyze
 * @returns {Array<string>} List of detected patterns
 */
function detectAIPatterns(code) {
    const patterns = [];

    // Pattern 1: Excessive comments
    const commentLines = (code.match(/\/\/|\/\*|\*\/|#/g) || []).length;
    const totalLines = code.split('\n').length;
    if (commentLines / totalLines > 0.3) {
        patterns.push("Excessive comments (>30% of lines)");
    }

    // Pattern 2: Generic variable names
    const genericNames = ['result', 'data', 'temp', 'value', 'item', 'element', 'obj', 'arr'];
    const hasGenericNames = genericNames.some(name =>
        new RegExp(`\\b${name}\\b`, 'i').test(code)
    );
    if (hasGenericNames) {
        patterns.push("Generic variable names detected");
    }

    // Pattern 3: Try-catch blocks for simple operations
    const tryCatchCount = (code.match(/try\s*{/g) || []).length;
    if (tryCatchCount > 0 && code.length < 500) {
        patterns.push("Error handling in simple code");
    }

    // Pattern 4: Perfect formatting
    const hasConsistentIndentation = /^(\s{2}|\s{4}|\t)/gm.test(code);
    const noTrailingSpaces = !/\s+$/gm.test(code);
    if (hasConsistentIndentation && noTrailingSpaces && code.length > 200) {
        patterns.push("Perfect code formatting");
    }

    // Pattern 5: Docstring/JSDoc style comments
    if (/\/\*\*[\s\S]*?\*\//.test(code) || /"""[\s\S]*?"""/.test(code)) {
        patterns.push("Comprehensive documentation comments");
    }

    // Pattern 6: Type hints in Python (common in AI-generated code)
    // Matches: def name(...) -> type:  OR  arg: type
    if (/def\s+\w+\s*\(.*->\s*\w+/.test(code) || /def\s+\w+\s*\(.*:\s*\w+/.test(code)) {
        patterns.push("Type hints in Python functions");
    }

    // Pattern 7: Overly descriptive function names
    const longFunctionNames = code.match(/(?:function|def|const|let|var)\s+(\w{20,})/g);
    if (longFunctionNames && longFunctionNames.length > 0) {
        patterns.push("Overly descriptive function names");
    }

    // Pattern 8: Multiple validation checks
    const validationCount = (code.match(/if\s*\(.*(?:null|undefined|None|isEmpty|isValid)/g) || []).length;
    if (validationCount >= 3) {
        patterns.push("Extensive input validation");
    }

    return patterns;
}

/**
 * Get a human-readable summary of detection results
 * @param {Object} result - Detection result object
 * @returns {string} Summary text
 */
export function getDetectionSummary(result) {
    if (!result) return "Not analyzed";

    const { isAIGenerated, confidence, suspectedTool } = result;
    // Ensure confidence is a number
    const conf = typeof confidence === 'number' ? confidence : 0;

    if (isAIGenerated) {
        return `⚠️ Likely AI-Generated (${conf}% confidence) - Suspected: ${suspectedTool || 'AI'}`;
    } else if (conf < 60) {
        return `⚡ Possibly AI-Assisted (${conf}% confidence)`;
    } else {
        return `✅ Likely Human-Written (${conf}% confidence)`;
    }
}

export default {
    analyzeCode,
    detectAIPatterns,
    getDetectionSummary
};
