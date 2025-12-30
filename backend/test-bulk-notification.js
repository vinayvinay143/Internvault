import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import { sendBulkInternshipNotification } from "./services/whatsappService.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/internvault";

console.log("=== TESTING BULK NOTIFICATIONS ===\n");

try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get users who should receive notifications
    const users = await User.find({
        whatsappNotifications: true,
        phone: { $exists: true, $ne: "" }
    }).select("username phone whatsappNotifications");

    console.log(`📱 Found ${users.length} users to notify:\n`);
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} - ${user.phone}`);
    });

    if (users.length === 0) {
        console.log("\n⚠️ No users to notify. Exiting.");
        process.exit(0);
    }

    // Create test internship data with company logo
    const testAd = {
        companyName: "Google LLC",
        link: "https://careers.google.com/jobs/apply",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png",
        userId: "test123",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    console.log(`\n🚀 Sending test notifications for: ${testAd.companyName}\n`);
    console.log("Please wait...\n");

    // Send bulk notifications
    const result = await sendBulkInternshipNotification(testAd, users);

    console.log("\n=== RESULTS ===");
    console.log(`✅ Successfully sent: ${result.sent}`);
    console.log(`❌ Failed: ${result.failed}`);

    if (result.sent > 0) {
        console.log("\n🎉 Check WhatsApp on all phones!");
    }

} catch (error) {
    console.error("❌ Error:", error.message);
} finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
}
