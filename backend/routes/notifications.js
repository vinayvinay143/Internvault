import express from "express";
import User from "../models/User.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

const router = express.Router();

// Test WhatsApp notification
router.post("/test", async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const testMessage = message || "🎉 Test notification from InternVault! Your WhatsApp notifications are working perfectly. ✅";

        const result = await sendWhatsAppMessage(phone, testMessage);

        if (result.success) {
            res.json({ success: true, message: "Test notification sent successfully" });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user's WhatsApp notification preferences
router.patch("/preferences/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { whatsappNotifications } = req.body;

        if (typeof whatsappNotifications !== "boolean") {
            return res.status(400).json({ error: "whatsappNotifications must be a boolean" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { whatsappNotifications },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: `WhatsApp notifications ${whatsappNotifications ? 'enabled' : 'disabled'}`,
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's notification preferences
router.get("/preferences/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("whatsappNotifications phone");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            whatsappNotifications: user.whatsappNotifications,
            phone: user.phone,
            hasPhone: !!user.phone
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
