import express from "express";
import Ad from "../models/Ad.js";
import User from "../models/User.js";
import { sendBulkInternshipNotification } from "../services/whatsappService.js";
import { validateLegitimacy } from "../utils/legitimacyValidator.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});


router.get("/active", async (req, res) => {
    try {

        const now = new Date();
        const ads = await Ad.find({ expiresAt: { $gt: now } }).sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify legitimacy of internship posting
router.post("/verify-legitimacy", async (req, res) => {
    try {
        const { companyName, link } = req.body;

        if (!companyName || !link) {
            return res.status(400).json({ error: "Company name and link are required" });
        }

        const result = validateLegitimacy(companyName, link);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/add", upload.single('image'), async (req, res) => {
    try {
        const { userId, companyName, link, verificationStatus, verificationReason } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        if (!userId || !companyName || !link) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const newAd = await Ad.create({
            userId,
            companyName,
            link,
            imageUrl,
            expiresAt,
            verificationStatus: verificationStatus || 'Unverified',
            verificationReason: verificationReason || ''
        });

        try {
            const users = await User.find({
                whatsappNotifications: true,
                phone: { $exists: true, $ne: "" }
            }).select("phone whatsappNotifications");

            sendBulkInternshipNotification(newAd, users).catch(err => {
                console.error("Background notification error:", err);
            });
        } catch (notifError) {
            console.error("Error fetching users for notifications:", notifError);
        }

        res.status(201).json(newAd);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's active ads
router.get("/user/:userId", async (req, res) => {
    try {
        const ads = await Ad.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an ad (only by the owner)
router.delete("/:adId", async (req, res) => {
    try {
        const { adId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Find the ad
        const ad = await Ad.findById(adId);

        if (!ad) {
            return res.status(404).json({ error: "Ad not found" });
        }

        // Verify ownership
        if (ad.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You can only delete your own ads" });
        }

        // Delete the ad
        await Ad.findByIdAndDelete(adId);

        res.json({ message: "Ad deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
