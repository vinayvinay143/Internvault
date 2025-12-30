import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Update user profile
router.put("/:id", async (req, res) => {
    try {
        const { username, phone, organization, yearOfStudy, avatar, whatsappNotifications } = req.body;

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
            whatsappNotifications: user.whatsappNotifications
        };

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
