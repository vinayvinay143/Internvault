import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const instanceId = process.env.GREEN_API_INSTANCE_ID;
const token = process.env.GREEN_API_TOKEN;

console.log("=== CHECKING GREEN API STATUS ===\n");
console.log("Instance ID:", instanceId);
console.log("Token (first 20 chars):", token?.substring(0, 20) + "...\n");

// Step 1: Check instance state
console.log("Step 1: Checking instance authorization status...");
const stateUrl = `https://api.green-api.com/waInstance${instanceId}/getStateInstance/${token}`;

try {
    const stateResponse = await axios.get(stateUrl);
    console.log("✅ API Connection: SUCCESS");
    console.log("📊 Instance State:", stateResponse.data.stateInstance);

    if (stateResponse.data.stateInstance === "authorized") {
        console.log("🎉 WhatsApp is CONNECTED and AUTHORIZED!\n");

        // Step 2: Try sending a test message
        console.log("Step 2: Attempting to send test message...");
        const sendUrl = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;

        const messageData = {
            chatId: "917013640945@c.us",
            message: "🎉 Success! Your InternVault WhatsApp notifications are working perfectly! ✅"
        };

        console.log("Sending to:", messageData.chatId);
        console.log("Message:", messageData.message);

        const sendResponse = await axios.post(sendUrl, messageData);
        console.log("\n✅ MESSAGE SENT SUCCESSFULLY!");
        console.log("Response:", JSON.stringify(sendResponse.data, null, 2));
        console.log("\n🔔 Check your WhatsApp now!");

    } else if (stateResponse.data.stateInstance === "notAuthorized") {
        console.log("❌ WhatsApp is NOT AUTHORIZED");
        console.log("\n📋 TO FIX:");
        console.log("1. Go to: https://green-api.com/dashboard");
        console.log("2. Find your instance");
        console.log("3. You should see a QR code");
        console.log("4. Scan it with WhatsApp (Settings → Linked Devices → Link a Device)");
        console.log("5. Wait for status to show 'authorized' (green)");
    } else {
        console.log("⚠️ Unexpected state:", stateResponse.data.stateInstance);
    }

} catch (error) {
    console.log("\n❌ ERROR!");
    console.log("Status Code:", error.response?.status);
    console.log("Error Message:", error.response?.data || error.message);

    if (error.response?.status === 403) {
        console.log("\n🔍 403 ERROR - Possible causes:");
        console.log("1. ❌ Wrong Instance ID or Token in .env file");
        console.log("2. ❌ Instance deleted/suspended on Green API");
        console.log("3. ❌ Credentials have special characters causing issues");
        console.log("\n📋 SOLUTION:");
        console.log("1. Go to https://green-api.com/dashboard");
        console.log("2. Double-check your Instance ID (idInstance)");
        console.log("3. Double-check your Token (apiTokenInstance)");
        console.log("4. Copy them EXACTLY (no extra spaces)");
        console.log("5. Update your .env file");
        console.log("6. Run this test again");
    } else if (error.response?.status === 404) {
        console.log("\n🔍 404 ERROR - Instance not found");
        console.log("Check if the Instance ID is correct");
    }
}

console.log("\n=== TEST COMPLETE ===");
