import express from "express";
import Favorite from "../models/favorite.js";

const router = express.Router();

// Add to favorites
router.post("/add", async (req, res) => {
    try {
        const { userId, projectId, title, domain, level } = req.body;

        // Check if already favorited
        const existing = await Favorite.findOne({ userId, projectId });

        if (existing) {
            return res.status(400).json({
                error: "Project already in favorites"
            });
        }

        const fav = await Favorite.create({
            userId,
            projectId,
            title,
            domain,
            level
        });

        res.status(201).json(fav);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all favorites for a user
router.get("/:userId", async (req, res) => {
    try {
        const favs = await Favorite.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(favs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove from favorites
router.delete("/remove/:id", async (req, res) => {
    try {
        const fav = await Favorite.findByIdAndDelete(req.params.id);

        if (!fav) {
            return res.status(404).json({ error: "Favorite not found" });
        }

        res.json({ message: "Removed from favorites", favorite: fav });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove by userId and projectId
router.delete("/remove/:userId/:projectId", async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        const fav = await Favorite.findOneAndDelete({
            userId,
            projectId
        });

        if (!fav) {
            return res.status(404).json({ error: "Favorite not found" });
        }

        res.json({ message: "Removed from favorites", favorite: fav });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
