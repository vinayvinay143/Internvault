import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || " mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.10";

console.log("=== DEBUGGING BULK NOTIFICATIONS ===\n");

try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check all users
    const allUsers = await User.find({}).select("username email phone whatsappNotifications");
    console.log(`📊 Total users in database: ${allUsers.length}\n`);

    if (allUsers.length > 0) {
        console.log("All users:");
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.email})`);
            console.log(`   Phone: ${user.phone || "NOT SET"}`);
            console.log(`   WhatsApp Notifications: ${user.whatsappNotifications}`);
            console.log("");
        });
    }

    // Check users who should receive notifications
    const notifiableUsers = await User.find({
        whatsappNotifications: true,
        phone: { $exists: true, $ne: "" }
    }).select("username email phone whatsappNotifications");

    console.log(`\n📱 Users who will receive notifications: ${notifiableUsers.length}\n`);

    if (notifiableUsers.length > 0) {
        console.log("These users will be notified:");
        notifiableUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} - ${user.phone}`);
        });
    } else {
        console.log("⚠️ NO USERS WILL RECEIVE NOTIFICATIONS\n");
        console.log("Possible reasons:");
        console.log("1. No users have phone numbers set");
        console.log("2. All users have whatsappNotifications set to false");
        console.log("3. Phone numbers are empty strings");
    }

    // Check users with issues
    const usersWithoutPhone = await User.find({
        whatsappNotifications: true,
        $or: [
            { phone: { $exists: false } },
            { phone: "" }
        ]
    }).select("username email phone");

    if (usersWithoutPhone.length > 0) {
        console.log(`\n⚠️ ${usersWithoutPhone.length} users opted-in but have no phone number:`);
        usersWithoutPhone.forEach(user => {
            console.log(`   - ${user.username} (${user.email})`);
        });
    }

} catch (error) {
    console.error("Error:", error.message);
} finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
}
