import express from "express";
import axios from "axios";
import CodeChallenge from "../models/CodeChallenge.js";
import CodeSubmission from "../models/CodeSubmission.js";
import { analyzeCodeQuality } from "../services/aiAnalysisService.js";

const router = express.Router();

// GET: Get all active code challenges
router.get("/code-challenges", async (req, res) => {
    try {
        const challenges = await CodeChallenge.find({
            status: "active",
            deadline: { $gte: new Date() }
        }).sort({ createdAt: -1 });
        res.json(challenges);
    } catch (error) {
        console.error("Error fetching code challenges:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get a specific code challenge by ID
router.get("/code-challenges/:id", async (req, res) => {
    try {
        const challenge = await CodeChallenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }
        res.json(challenge);
    } catch (error) {
        console.error("Error fetching code challenge:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get student's own code submissions
router.get("/my-code-submissions", async (req, res) => {
    try {
        const { studentId, challengeId } = req.query;

        const query = { studentId };
        if (challengeId) {
            query.challengeId = challengeId;
        }

        const submissions = await CodeSubmission.find(query)
            .populate("challengeId", "title companyName difficulty")
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST: Submit code for a challenge
router.post("/submit-code", async (req, res) => {
    try {
        const {
            challengeId,
            studentId,
            studentName,
            studentEmail,
            code,
            programmingLanguage,
            proctoringData
        } = req.body;

        // Check if challenge exists
        const challenge = await CodeChallenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        // Check if deadline has passed
        if (new Date() > new Date(challenge.deadline)) {
            return res.status(400).json({ error: "Submission deadline has passed" });
        }

        // Check if student already submitted
        const existingSubmission = await CodeSubmission.findOne({
            challengeId,
            studentId
        });

        if (existingSubmission) {
            return res.status(400).json({ error: "You have already submitted code for this challenge" });
        }

        console.log("[CODE SUBMISSION] Processing proctoring data:", proctoringData);

        // Determine verdict server-side as a safeguard
        // Logic: >2 tab switches OR >1 large paste OR extreme typing speed = Suspicious
        let serverVerdict = "Clean";
        let isSuspicious = false;

        if (proctoringData) {
            if (proctoringData.tabSwitchCount > 2 || proctoringData.pasteCount > 2) {
                serverVerdict = "Suspicious";
                isSuspicious = true;
            }
            if (proctoringData.tabSwitchCount > 5 || (proctoringData.pasteCount > 1 && proctoringData.maxPasteLength > 100)) {
                serverVerdict = "Highly Suspicious";
                isSuspicious = true;
            }
        }

        // Create submission
        const submission = new CodeSubmission({
            challengeId,
            studentId,
            studentName,
            studentEmail,
            code,
            programmingLanguage,
            proctoringData: {
                ...proctoringData,
                verdict: serverVerdict,
                isSuspicious: isSuspicious
            },
            status: isSuspicious ? "flagged" : "completed"
        });

        // Trigger AI Analysis asynchronously (or await if fast enough)
        // For Ranking, we need it now.
        try {
            console.log("[AI RANKING] Analyzing code quality...");
            const aiResults = await analyzeCodeQuality(code, programmingLanguage, challenge.problemStatement);
            submission.aiAnalysis = aiResults;
            console.log(`[AI RANKING] Score: ${aiResults.qualityScore}/100`);
        } catch (aiError) {
            console.error("AI Analysis failed:", aiError);
            // Fallback or leave empty
        }

        await submission.save();

        // Increment submissions count
        await CodeChallenge.findByIdAndUpdate(challengeId, {
            $inc: { submissionsCount: 1 }
        });

        console.log(`[CODE SUBMISSION] Submission created with AI analysis: ${submission._id}`);
        res.status(201).json(submission);
    } catch (error) {
        console.error("Error submitting code:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST: Proxy code execution to Judge0 API (Piston alternative)
router.post("/execute", async (req, res) => {
    console.log("[CODE EXECUTE] Proxying request to Judge0 API...");
    try {
        const { language, files } = req.body;
        const sourceCode = files[0].content;

        // Language Mapping for Judge0
        const languageMap = {
            'javascript': 63,
            'python': 71,
            'java': 62,
            'cpp': 54,
            'c_cpp': 54
        };

        const languageId = languageMap[language.toLowerCase()] || 63;

        // Call Judge0 (using a reliable public instance or RapidAPI)
        // We'll use the ce.judge0.com instance which is often open for reasonable usage
        const response = await axios.post('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
            source_code: Buffer.from(sourceCode).toString('base64'),
            language_id: languageId,
            stdin: "" // Can be added later if needed
        });

        console.log("[CODE EXECUTE] Judge0 Response Status:", response.status);

        // Map Judge0 response to our terminal format
        const result = response.data;
        const mappedResult = {
            stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : "",
            stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : "",
            compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : "",
            code: result.status.id === 3 ? 0 : result.status.id, // Status 3 is "Accepted"
            status: result.status.description
        };

        // If compile error, merge it into stderr
        if (mappedResult.compile_output) {
            mappedResult.stderr = (mappedResult.stderr + "\n" + mappedResult.compile_output).trim();
        }

        res.json({ run: mappedResult });
    } catch (error) {
        console.error("[CODE EXECUTE] Proxy Error!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            return res.status(error.response.status).json({
                error: "Execution API returned error",
                details: error.response.data
            });
        }
        console.error("Message:", error.message);
        res.status(500).json({ error: "Code execution proxy failed", message: error.message });
    }
});

export default router;
