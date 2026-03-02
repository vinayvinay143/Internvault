import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Application from "../models/Application.js";
import TPOInternship from "../models/TPOInternship.js";
import RecruiterInternship from "../models/RecruiterInternship.js";
import User from "../models/User.js";
import { sendSelectionNotification } from "../services/whatsappService.js";

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
        cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB temporary limit for debugging
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

// POST /api/internships/:id/apply - Student applies to internship
router.post("/internships/:id/apply", upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'govId', maxCount: 1 },
    { name: 'collegeId', maxCount: 1 }
]), async (req, res) => {
    try {
        const { studentId, name, phone, skillMatchPercentage, researchInterests, linkedin, github, portfolio, email, gender, aadhar, college, location, yearOfStudy, branch, accommodation, degree } = req.body;
        const internshipId = req.params.id;

        // Handle Files
        let resumeUrl = req.body.resumeUrl;
        let govIdUrl = "";
        let collegeIdUrl = "";

        if (req.files) {
            if (req.files.resume) resumeUrl = `/uploads/${req.files.resume[0].filename}`;
            if (req.files.govId) govIdUrl = `/uploads/${req.files.govId[0].filename}`;
            if (req.files.collegeId) collegeIdUrl = `/uploads/${req.files.collegeId[0].filename}`;
        }

        if (!resumeUrl) return res.status(400).json({ error: "Resume is required" });
        if (!govIdUrl) return res.status(400).json({ error: "Government ID is required" });
        if (!collegeIdUrl) return res.status(400).json({ error: "College ID is required" });

        // Check if internship exists and is active (try both TPO and Recruiter)
        let internship = await TPOInternship.findById(internshipId);
        let internshipType = 'TPO';

        if (!internship) {
            internship = await RecruiterInternship.findById(internshipId);
            internshipType = 'Recruiter';
        }

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        if (internship.status !== "active") {
            return res.status(400).json({ error: "Internship is not accepting applications" });
        }

        if (new Date() > new Date(internship.applicationDeadline)) {
            return res.status(400).json({ error: "Application deadline has passed" });
        }

        // Check if student already applied
        const existingApplication = await Application.findOne({ studentId, internshipId });
        if (existingApplication) {
            console.log(`[APPLY] Duplicate detected for Student ${studentId} on Internship ${internshipId}`);
            return res.status(400).json({ error: "You have already applied to this internship" });
        }

        // Program Type Validation
        if (internship.programType && req.body.degree && internship.programType !== req.body.degree) {
            return res.status(400).json({
                error: `This internship is only for ${internship.programType} students. Your degree (${req.body.degree}) is not eligible.`
            });
        }

        // Parse researchInterests if it's a string
        let formattedResearchInterests = [];
        if (researchInterests) {
            formattedResearchInterests = Array.isArray(researchInterests)
                ? researchInterests
                : researchInterests.split(',').map(s => s.trim()).filter(s => s);
        }

        // Create application
        const application = await Application.create({
            studentId,
            internshipId,
            internshipModel: internshipType === 'TPO' ? 'TPOInternship' : 'RecruiterInternship',
            name,
            phone,
            skillMatchPercentage,
            researchInterests: formattedResearchInterests,
            resumeUrl,
            govIdUrl,
            collegeIdUrl,
            email,
            gender,
            aadhar,
            college,
            location,
            yearOfStudy: yearOfStudy || "Not Specified",
            degree: (degree || req.body.degree || "BTech").trim(),
            branch,
            accommodation,
            linkedin,
            github,
            portfolio,
            codeSubmission: req.body.codeSubmission || "",
            codeLanguage: req.body.codeLanguage || ""
        });

        console.log(`[APPLY] Success! Created Application ${application._id} for Student ${studentId}`);

        // Increment applications count based on internship type
        if (internshipType === 'TPO') {
            await TPOInternship.findByIdAndUpdate(internshipId, {
                $inc: { applicationsCount: 1 }
            });
        } else {
            await RecruiterInternship.findByIdAndUpdate(internshipId, {
                $inc: { applicationsCount: 1 }
            });
        }

        res.status(201).json(application);
    } catch (error) {
        console.error("[APPLY] Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tpo/applicants/:internshipId - Get all applicants for an internship (TPO only)
router.get("/tpo/applicants/:internshipId", async (req, res) => {
    try {
        const { internshipId } = req.params;
        const { sortBy = "appliedAt", order = "desc", status } = req.query;

        // Build query
        const query = { internshipId };
        if (status) {
            query.status = status;
        }

        // Build sort
        const sort = {};
        sort[sortBy] = order === "asc" ? 1 : -1;

        const applicants = await Application.find(query)
            .sort(sort)
            .populate("studentId", "username email avatar organization yearOfStudy");

        res.json(applicants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/tpo/applicants/:id/select - Select or reject candidate (TPO only)
router.put("/tpo/applicants/:id/select", async (req, res) => {
    try {
        const { status, rejectionReason } = req.body; // "selected" or "rejected"

        if (!["selected", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status. Must be 'selected' or 'rejected'" });
        }

        const updateData = { status };
        if (status === "rejected" && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate("internshipId", "title");

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Send WhatsApp notification if selected
        if (status === "selected" && application.phone) {
            try {
                await sendSelectionNotification(
                    application.phone,
                    application.internshipId.title,
                    application.name
                );
            } catch (whatsappError) {
                console.error("WhatsApp notification failed:", whatsappError);
                // Don't fail the request if WhatsApp fails
            }
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/applications/my - Get student's own applications
router.get("/applications/my", async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        const applications = await Application.find({ studentId })
            .sort({ appliedAt: -1 })
            .populate({
                path: "internshipId",
                select: "title description duration stipend status tpoId",
                populate: {
                    path: "tpoId",
                    select: "organization username"
                }
            });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/applications/stats/:internshipId - Get application statistics
router.get("/applications/stats/:internshipId", async (req, res) => {
    try {
        const { internshipId } = req.params;

        const stats = await Application.aggregate([
            { $match: { internshipId: internshipId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            total: 0,
            pending: 0,
            selected: 0,
            rejected: 0
        };

        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
            formattedStats.total += stat.count;
        });

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/tpo/applicants/:id/send-offer - Upload offer letter and update status
router.post("/tpo/applicants/:id/send-offer", upload.single("offerLetter"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Offer letter file is required" });
        }

        const offerLetterUrl = `/uploads/${req.file.filename}`;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            {
                status: "offer_sent",
                offerLetterUrl: offerLetterUrl
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error sending offer:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
