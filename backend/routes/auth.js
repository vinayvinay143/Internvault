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

import jwt from "jsonwebtoken";

// ... (existing code)

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

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "fallback_secret_key_123", // Use env var in production
            { expiresIn: "7d" }
        );

        // Return user and token
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            organization: user.organization,
            yearOfStudy: user.yearOfStudy,
            avatar: user.avatar,
            whatsappNotifications: user.whatsappNotifications,
            token: token,
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
