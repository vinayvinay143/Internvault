import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("=== Green API Configuration Check ===\n");

const instanceId = process.env.GREEN_API_INSTANCE_ID;
const token = process.env.GREEN_API_TOKEN;

// Check if credentials are set
if (!instanceId || instanceId === "your_instance_id_here") {
    console.log("❌ GREEN_API_INSTANCE_ID is not configured properly");
    console.log("   Current value:", instanceId || "not set");
    console.log("\n📋 TO FIX:");
    console.log("1. Copy .env.example to .env");
    console.log("2. Replace 'your_instance_id_here' with your actual Green API Instance ID");
    console.log("3. Get it from: https://green-api.com dashboard\n");
} else {
    console.log("✅ GREEN_API_INSTANCE_ID is set:", instanceId);
}

if (!token || token === "your_api_token_here") {
    console.log("❌ GREEN_API_TOKEN is not configured properly");
    console.log("   Current value:", token ? "your_api_token_here (example)" : "not set");
    console.log("\n📋 TO FIX:");
    console.log("1. Copy .env.example to .env");
    console.log("2. Replace 'your_api_token_here' with your actual Green API Token");
    console.log("3. Get it from: https://green-api.com dashboard\n");
} else {
    console.log("✅ GREEN_API_TOKEN is set:", token.substring(0, 10) + "...");
}

// Test API connection if credentials are set
if (instanceId && token &&
    instanceId !== "your_instance_id_here" &&
    token !== "your_api_token_here") {

    console.log("\n=== Testing Green API Connection ===\n");

    const apiUrl = `https://api.green-api.com/waInstance${instanceId}/getStateInstance/${token}`;

    try {
        console.log("📡 Calling Green API...");
        const response = await axios.get(apiUrl);

        console.log("✅ Connection successful!");
        console.log("📊 Instance status:", response.data.stateInstance);

        if (response.data.stateInstance === "authorized") {
            console.log("🎉 Your WhatsApp is connected and ready!");
        } else if (response.data.stateInstance === "notAuthorized") {
            console.log("⚠️  Your WhatsApp is NOT connected");
            console.log("📋 TO FIX:");
            console.log("1. Go to https://green-api.com dashboard");
            console.log("2. Find your instance");
            console.log("3. Scan the QR code with WhatsApp");
        }
    } catch (error) {
        console.log("❌ Failed to connect to Green API");
        console.log("Error:", error.message);

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Response:", error.response.data);
        }

        console.log("\n📋 Possible issues:");
        console.log("1. Wrong Instance ID or Token");
        console.log("2. Instance was deleted from Green API dashboard");
        console.log("3. Internet connection issue");
    }
} else {
    console.log("\n⚠️  Cannot test API connection - credentials not configured");
}

console.log("\n=== Next Steps ===");
console.log("1. Create .env file with your Green API credentials");
console.log("2. Run this test again: node test-green-api.js");
console.log("3. Make sure instance status is 'authorized'");
console.log("4. Then restart your backend server\n");
