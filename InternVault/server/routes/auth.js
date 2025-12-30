import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, phone, organization, yearOfStudy, avatar } = req.body;

        // Check existing
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            organization,
            yearOfStudy,
            avatar
        });

        const savedUser = await newUser.save();

        // Return user without password
        const { password: _, ...userData } = savedUser._doc;
        res.status(201).json(userData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const { password: _, ...userData } = user._doc;
        res.status(200).json(userData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
