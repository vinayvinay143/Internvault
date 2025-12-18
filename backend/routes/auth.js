import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, avatar, phone, organization, yearOfStudy } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User with this email or username already exists"
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            avatar,
            phone,
            organization,
            yearOfStudy
        });

        // Return user without password
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Return user without password
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: "Login successful"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
