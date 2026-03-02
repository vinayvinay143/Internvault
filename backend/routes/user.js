import express from "express";
import User from "../models/User.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Resume must be a PDF or DOCX file!"));
        }
    }
});

// Update user profile
router.put("/:id", upload.single("resume"), async (req, res) => {
    try {
        const { username, phone, organization, yearOfStudy, avatar, whatsappNotifications, linkedin, github, website } = req.body;

        // Find user
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username already taken" });
            }
            user.username = username;
        }

        // Update allowed fields
        if (phone !== undefined) user.phone = phone;
        if (organization !== undefined) user.organization = organization;
        if (yearOfStudy !== undefined) user.yearOfStudy = yearOfStudy;
        if (avatar !== undefined) user.avatar = avatar;
        if (whatsappNotifications !== undefined) user.whatsappNotifications = whatsappNotifications;
        if (linkedin !== undefined) user.linkedin = linkedin;
        if (github !== undefined) user.github = github;
        if (website !== undefined) user.website = website;

        // Handle Resume File Update
        if (req.file) {
            user.resume = `/uploads/${req.file.filename}`;
        } else if (req.body.resume) {
            // Optional: allow updating resume path string if needed, though usually file upload is preferred
            user.resume = req.body.resume;
        }

        await user.save();

        // Return updated user without password
        const updatedUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            organization: user.organization,
            yearOfStudy: user.yearOfStudy,
            avatar: user.avatar,
            whatsappNotifications: user.whatsappNotifications,
            linkedin: user.linkedin,
            github: user.github,
            website: user.website,
            resume: user.resume,
            role: user.role
        };

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
