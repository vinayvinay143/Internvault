import express from "express";
import Ad from "../models/Ad.js";

const router = express.Router();

// Get active ads
router.get("/active", async (req, res) => {
    try {
        // Find ads where expiresAt is in the future
        const now = new Date();
        const ads = await Ad.find({ expiresAt: { $gt: now } }).sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post a new ad
router.post("/add", async (req, res) => {
    try {
        const { userId, companyName, link, imageUrl } = req.body;

        if (!userId || !companyName || !link) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Set expiration to 24 hours from now
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const newAd = await Ad.create({
            userId,
            companyName,
            link,
            imageUrl,
            expiresAt
        });

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

export default router;
