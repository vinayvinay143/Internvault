import express from "express";
import TPOInternship from "../models/TPOInternship.js";
import User from "../models/User.js";
import Application from "../models/Application.js";

const router = express.Router();

// POST /api/tpo/internships - Create new internship (TPO only)
router.post("/internships", async (req, res) => {
    try {
        const {
            tpoId,
            title,
            description,
            duration,
            locationType,
            startDate,
            stipend,
            seats,
            requiredSkills,
            programType,
            researchTopics,
            eligibility,
            applicationDeadline
        } = req.body;

        // Verify user is TPO
        const user = await User.findById(tpoId);
        if (!user || user.role !== "tpo") {
            return res.status(403).json({ error: "Only TPOs can post internships" });
        }

        const internship = await TPOInternship.create({
            tpoId,
            title,
            description,
            duration,
            locationType,
            startDate,
            stipend,
            seats,
            requiredSkills,
            programType,
            researchTopics: programType === "MTech" ? researchTopics : [],
            eligibility,
            applicationDeadline
        });

        res.status(201).json(internship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tpo/internships - Get all internships posted by TPO
router.get("/internships", async (req, res) => {
    try {
        const { tpoId } = req.query;

        if (!tpoId) {
            return res.status(400).json({ error: "TPO ID is required" });
        }

        const internships = await TPOInternship.find({ tpoId })
            .sort({ createdAt: -1 })
            .populate("tpoId", "username organization");

        res.json(internships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tpo/internships/all/active - Get all active TPO internships (for students)
router.get("/internships/all/active", async (req, res) => {
    try {
        const internships = await TPOInternship.find({
            status: "active",
            applicationDeadline: { $gte: new Date() }
        })
            .sort({ createdAt: -1 })
            .populate("tpoId", "username organization avatar");

        res.json(internships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tpo/internships/all/latest - Get the most recent active internship
router.get("/internships/all/latest", async (req, res) => {
    try {
        const internship = await TPOInternship.findOne({
            status: "active",
            applicationDeadline: { $gte: new Date() }
        })
            .sort({ createdAt: -1 })
            .select("title companyName _id createdAt tpoId")
            .populate("tpoId", "organization");

        if (!internship) {
            return res.status(404).json({ message: "No active internships found" });
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tpo/internships/:id/applicants - Get internship details and applicants
router.get("/internships/:id/applicants", async (req, res) => {
    try {
        const internship = await TPOInternship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        const applicants = await Application.find({ internshipId: req.params.id })
            .populate("studentId", "name email phone resume cgpa yearOfStudy skills");

        res.json({ internship, applicants });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/tpo/applications/:id/status - Update application status
router.patch("/applications/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tpo/internships/:id - Get single internship
router.get("/internships/:id", async (req, res) => {
    try {
        const internship = await TPOInternship.findById(req.params.id)
            .populate("tpoId", "username organization");

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/tpo/internships/:id - Update internship
router.put("/internships/:id", async (req, res) => {
    try {
        const internship = await TPOInternship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/tpo/internships/:id - Delete internship
router.delete("/internships/:id", async (req, res) => {
    try {
        const internship = await TPOInternship.findByIdAndDelete(req.params.id);

        if (!internship) {
            return res.status(404).json({ error: "Internship not found" });
        }

        res.json({ message: "Internship deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
