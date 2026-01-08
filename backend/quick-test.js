import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN;
const GREEN_API_BASE_URL = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}`;

console.log("=== GREEN API QUICK TEST ===\n");

// Step 1: Check credentials
console.log("1. Checking credentials...");
if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN) {
    console.log("ERROR: Missing credentials in .env file");
    console.log("Add: GREEN_API_INSTANCE_ID and GREEN_API_TOKEN");
    process.exit(1);
}
console.log("   Instance ID:", GREEN_API_INSTANCE_ID);
console.log("   Token:", GREEN_API_TOKEN.substring(0, 15) + "...");
console.log("   OK\n");

// Step 2: Check instance status
console.log("2. Checking instance status...");
try {
    const response = await axios.get(
        `${GREEN_API_BASE_URL}/getStateInstance/${GREEN_API_TOKEN}`
    );

    console.log("   State:", response.data.stateInstance);

    if (response.data.stateInstance === "authorized") {
        console.log("   STATUS: AUTHORIZED - Ready to send messages!\n");
    } else if (response.data.stateInstance === "notAuthorized") {
        console.log("   STATUS: NOT AUTHORIZED");
        console.log("   ACTION NEEDED: Scan QR code at https://console.green-api.com\n");
        process.exit(1);
    } else {
        console.log("   STATUS:", response.data.stateInstance);
        console.log("   This might be a temporary state\n");
    }
} catch (error) {
    console.log("   ERROR:", error.response?.status || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("   ISSUE: Invalid credentials - check your .env file\n");
    }
    process.exit(1);
}

// Step 3: Test message sending (if phone number provided)
if (process.argv[2]) {
    const phoneNumber = process.argv[2];
    console.log("3. Testing message send to:", phoneNumber);

    // Format phone number
    let formatted = phoneNumber.replace(/[\s\-+]/g, "");
    if (formatted.length === 10 && /^[6-9]/.test(formatted)) {
        formatted = "91" + formatted;
    }
    const chatId = formatted + "@c.us";

    console.log("   Formatted chatId:", chatId);

    try {
        const response = await axios.post(
            `${GREEN_API_BASE_URL}/sendMessage/${GREEN_API_TOKEN}`,
            {
                chatId: chatId,
                message: `Test from InternVault!\nTime: ${new Date().toLocaleString()}\n\nIf you see this, Green API is working!`
            }
        );

        console.log("   SUCCESS!");
        console.log("   Message ID:", response.data.idMessage);
        console.log("   Check WhatsApp in 5-10 seconds\n");
    } catch (error) {
        console.log("   FAILED!");
        console.log("   Status:", error.response?.status);
        console.log("   Error:", error.response?.data || error.message);

        if (error.response?.status === 400) {
            console.log("\n   POSSIBLE ISSUE: Phone number format incorrect");
            console.log("   Try: node quick-test.js 919876543210");
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            console.log("\n   POSSIBLE ISSUE: Invalid API credentials");
        } else if (error.response?.status === 471) {
            console.log("\n   POSSIBLE ISSUE: Instance not authorized or phone not registered");
        }
        console.log("");
    }
} else {
    console.log("3. To test sending a message:");
    console.log("   node quick-test.js <phone_number>");
    console.log("   Example: node quick-test.js 919876543210\n");
}

console.log("=== TEST COMPLETE ===");
