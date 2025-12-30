import express from "express";
import { Review } from "../models/Review.js";

const router = express.Router();

// GET ALL REVIEWS
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE REVIEW
router.post("/", async (req, res) => {
    try {
        const { company, role, rating, stipend, review, userId, username } = req.body;

        const newReview = new Review({
            company,
            role,
            rating,
            stipend,
            review,
            user: userId,
            username
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
