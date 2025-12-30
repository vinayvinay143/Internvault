import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const instanceId = process.env.GREEN_API_INSTANCE_ID;
const token = process.env.GREEN_API_TOKEN;

console.log("Testing Green API connection...\n");
console.log("Instance ID:", instanceId);
console.log("Token:", token ? token.substring(0, 15) + "..." : "NOT SET");

// Test 1: Check instance state
const stateUrl = `https://api.green-api.com/waInstance${instanceId}/getStateInstance/${token}`;

console.log("\nAPI URL:", stateUrl);
console.log("\nSending request...");

try {
    const response = await axios.get(stateUrl);
    console.log("\n✅ SUCCESS!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

    if (response.data.stateInstance === "authorized") {
        console.log("\n🎉 Your instance is AUTHORIZED - WhatsApp is connected!");
        console.log("\nYou can now send messages. Try:");
        console.log('curl -X POST http://localhost:5000/api/notifications/test -H "Content-Type: application/json" -d "{\\"phone\\":\\"917013640945\\",\\"message\\":\\"Test\\"}"');
    } else {
        console.log("\n⚠️ Instance state:", response.data.stateInstance);
        console.log("You need to scan the QR code in Green API dashboard!");
    }
} catch (error) {
    console.log("\n❌ ERROR!");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data || error.message);

    if (error.response?.status === 403) {
        console.log("\n🔍 403 FORBIDDEN means:");
        console.log("1. Wrong Instance ID or Token");
        console.log("2. Check your Green API dashboard");
        console.log("3. Make sure you copied the EXACT values");
        console.log("4. Instance might have been deleted or suspended");
    }
}
