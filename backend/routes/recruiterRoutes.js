import express from "express";
import mongoose from "mongoose";
import RecruiterInternship from "../models/RecruiterInternship.js";
import Application from "../models/Application.js";
import CodeChallenge from "../models/CodeChallenge.js";
import CodeSubmission from "../models/CodeSubmission.js";
import { analyzeCodeQuality } from "../services/aiAnalysisService.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const router = express.Router();

// Multer Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "offer-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx|png|jpg|jpeg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Allowed formats: PDF, DOC, DOCX, PNG, JPG, JPEG!"));
        }
    }
});

// POST: Create new internship
router.post("/internships", async (req, res) => {
    try {
        const {
            recruiterId,
            companyName,
            title,
            description,
            location,
            locationType,
            duration,
            stipend,
            requiredSkills,
            requiresCodeSubmission,
            codeSubmissionPrompt,
            programmingLanguage,
            applicationDeadline
        } = req.body;

        const internship = new RecruiterInternship({
            recruiterId,
            companyName,
            title,
            description,
            location,
            locationType,
            duration,
            stipend,
            requiredSkills: requiredSkills || [],
            requiresCodeSubmission: requiresCodeSubmission || false,
            codeSubmissionPrompt: codeSubmissionPrompt || "",
            programmingLanguage: programmingLanguage || "Any",
            applicationDeadline,
            status: "active"
        });

        await internship.save();
        res.status(201).json(internship);
    } catch (error) {
        console.error("Error creating internship:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get all internships for a recruiter
router.get("/internships", async (req, res) => {
    try {
        const { recruiterId } = req.query;

        if (!recruiterId) {
            return res.status(400).json({ error: "Recruiter ID is required" });
        }

        const internships = await RecruiterInternship.find({ recruiterId })
            .sort({ createdAt: -1 });

        res.json(internships);
    } catch (error) {
        console.error("Error fetching internships:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get all active internships (for students to browse)
router.get("/internships/active", async (req, res) => {
    try {
        const internships = await RecruiterInternship.find({
            status: "active",
            applicationDeadline: { $gte: new Date() }
        })
            .populate("recruiterId", "companyName email")
            .sort({ createdAt: -1 });

        res.json(internships);
    } catch (error) {
        console.error("Error fetching active internships:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get specific internship by ID
router.get("/internships/:id", async (req, res) => {
    try {
        const internship = await RecruiterInternship.findById(req.params.id)
            .populate("recruiterId", "companyName email companyWebsite");

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        res.json(internship);
    } catch (error) {
        console.error("Error fetching internship:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update internship
router.put("/internships/:id", async (req, res) => {
    try {
        const internship = await RecruiterInternship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        res.json(internship);
    } catch (error) {
        console.error("Error updating internship:", error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Delete internship
router.delete("/internships/:id", async (req, res) => {
    try {
        const internship = await RecruiterInternship.findByIdAndDelete(req.params.id);

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        // Also delete all applications for this internship
        await Application.deleteMany({ internshipId: req.params.id });

        res.json({ message: "Internship deleted successfully" });
    } catch (error) {
        console.error("Error deleting internship:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get applicants for a specific internship
router.get("/applicants/:internshipId", async (req, res) => {
    try {
        const applications = await Application.find({
            internshipId: req.params.internshipId
        })
            .populate("studentId", "username email avatar")
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST: Analyze code submission
router.post("/analyze-code", async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        const result = await analyzeCodeQuality(code, language || "Unknown");
        res.json(result);
    } catch (error) {
        console.error("Error analyzing code:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update application status
router.put("/applicants/:applicationId/status", async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        const application = await Application.findByIdAndUpdate(
            req.params.applicationId,
            {
                status,
                rejectionReason: rejectionReason || ""
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update private note
router.put("/applicants/:applicationId/note", async (req, res) => {
    try {
        const { privateNotes } = req.body;

        const application = await Application.findByIdAndUpdate(
            req.params.applicationId,
            { privateNotes },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: error.message });
    }
});

// ============ CODE CHALLENGE ROUTES ============

// POST: Create new code challenge
router.post("/code-challenges", async (req, res) => {
    try {
        const challenge = new CodeChallenge(req.body);
        await challenge.save();
        res.status(201).json(challenge);
    } catch (error) {
        console.error("Error creating code challenge:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get all code challenges for a recruiter
router.get("/code-challenges", async (req, res) => {
    try {
        const { recruiterId } = req.query;
        const challenges = await CodeChallenge.find({ recruiterId }).sort({ createdAt: -1 });
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

// DELETE: Delete a code challenge
router.delete("/code-challenges/:id", async (req, res) => {
    try {
        const challenge = await CodeChallenge.findByIdAndDelete(req.params.id);
        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }
        // Also delete all submissions for this challenge
        await CodeSubmission.deleteMany({ challengeId: req.params.id });
        res.json({ message: "Challenge deleted successfully" });
    } catch (error) {
        console.error("Error deleting code challenge:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET: Get all submissions for a specific challenge
router.get("/code-challenges/:id/submissions", async (req, res) => {
    try {
        const submissions = await CodeSubmission.find({ challengeId: req.params.id })
            .populate("studentId", "username email avatar organization")
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST: Send offer from code submission
router.post("/submissions/:id/send-offer", upload.single("offerLetter"), async (req, res) => {
    try {
        const { internshipId } = req.body;
        const submissionId = req.params.id;

        if (!req.file) {
            return res.status(400).json({ error: "Offer letter file is required" });
        }

        // 1. Find the Code Submission
        const submission = await CodeSubmission.findById(submissionId).populate("studentId").populate("challengeId");
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        const student = submission.studentId;
        const offerLetterUrl = `/uploads/${req.file.filename}`;

        // 2. Create or Update Application
        const isCustomOffer = internshipId && (internshipId.startsWith('custom_') || !mongoose.Types.ObjectId.isValid(internshipId));

        let application = null;
        if (!isCustomOffer) {
            application = await Application.findOne({
                studentId: student._id,
                internshipId: internshipId
            });
        }

        const applicationData = {
            studentId: student._id,
            internshipId: internshipId,
            internshipModel: isCustomOffer ? 'StandaloneOffer' : 'RecruiterInternship',
            internshipTitle: submission.challengeId?.title || "Custom Internship",
            companyName: submission.challengeId?.companyName || student.organization || "Recruiter",
            name: student.username || submission.studentName,
            email: student.email || submission.studentEmail,
            phone: student.phone || "Not Provided",
            status: "offer_sent",
            offerLetterUrl: offerLetterUrl,
            // Carry over code submission details
            codeSubmission: submission.code,
            codeLanguage: submission.programmingLanguage,
            aiAnalysis: submission.aiAnalysis,
            proctoringData: submission.proctoringData,
            // Basic defaults to avoid validation issues
            gender: "Other",
            aadhar: "Not Provided",
            college: student.organization || "Not Provided",
            location: "Remote",
            yearOfStudy: "Not Specified",
            degree: "BTech",
            branch: "CSE/IT",
            govtIdUrl: "placeholder",
            collegeIdUrl: "placeholder"
        };

        if (application) {
            // Update existing
            application = await Application.findByIdAndUpdate(
                application._id,
                {
                    status: "offer_sent",
                    offerLetterUrl: offerLetterUrl
                },
                { new: true }
            );
        } else {
            // Create new
            application = new Application({
                ...applicationData,
                govIdUrl: "NA", // Avoid validation errors if any
                collegeIdUrl: "NA"
            });
            await application.save();
        }

        // 3. Update Code Submission status
        await CodeSubmission.findByIdAndUpdate(submissionId, { status: "completed" });

        res.json({
            message: "Offer sent successfully",
            application,
            offerLetterUrl
        });

    } catch (error) {
        console.error("Error sending offer from submission:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

