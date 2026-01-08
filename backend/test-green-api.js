import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN;
const GREEN_API_BASE_URL = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}`;

console.log("\n🔍 Green API Diagnostic Tool\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Check 1: Environment Variables
console.log("\n✅ Step 1: Checking Environment Variables");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN) {
    console.error("❌ ERROR: Missing environment variables!");
    console.log("\nPlease add these to your .env file:");
    console.log("GREEN_API_INSTANCE_ID=your_instance_id");
    console.log("GREEN_API_TOKEN=your_api_token");
    console.log("\nGet them from: https://console.green-api.com");
    process.exit(1);
}

console.log(`✅ GREEN_API_INSTANCE_ID: ${GREEN_API_INSTANCE_ID}`);
console.log(`✅ GREEN_API_TOKEN: ${GREEN_API_TOKEN.substring(0, 10)}...${GREEN_API_TOKEN.substring(GREEN_API_TOKEN.length - 5)}`);
console.log(`✅ API Base URL: ${GREEN_API_BASE_URL}`);

// Check 2: Instance Status
console.log("\n✅ Step 2: Checking Instance Status");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

async function checkInstanceStatus() {
    try {
        const response = await axios.get(
            `${GREEN_API_BASE_URL}/getStateInstance/${GREEN_API_TOKEN}`
        );

        console.log(`Instance State: ${response.data.stateInstance}`);

        if (response.data.stateInstance === "authorized") {
            console.log("✅ Instance is AUTHORIZED and ready to send messages!");
        } else if (response.data.stateInstance === "notAuthorized") {
            console.log("❌ Instance is NOT AUTHORIZED!");
            console.log("\n📱 To authorize:");
            console.log("1. Go to: https://console.green-api.com");
            console.log("2. Find your instance");
            console.log("3. Scan the QR code with WhatsApp");
            console.log("4. Wait for status to change to 'authorized' (green indicator)");
            return false;
        } else {
            console.log(`⚠️ Instance state: ${response.data.stateInstance}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("❌ Failed to check instance status:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${error.response.data?.message || error.message}`);

            if (error.response.status === 401 || error.response.status === 403) {
                console.log("\n⚠️ Authentication failed! Check your credentials:");
                console.log("- Verify GREEN_API_INSTANCE_ID is correct");
                console.log("- Verify GREEN_API_TOKEN is correct");
                console.log("- Get fresh credentials from: https://console.green-api.com");
            }
        } else {
            console.error(error.message);
        }
        return false;
    }
}

// Check 3: Account Settings
async function checkAccountSettings() {
    try {
        console.log("\n✅ Step 3: Checking Account Settings");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const response = await axios.get(
            `${GREEN_API_BASE_URL}/getSettings/${GREEN_API_TOKEN}`
        );

        console.log("Account Settings:");
        console.log(`- Incoming Webhook: ${response.data.incomingWebhook || 'disabled'}`);
        console.log(`- Outgoing Webhook: ${response.data.outgoingWebhook || 'disabled'}`);
        console.log(`- Webhook URL: ${response.data.webhookUrl || 'not set'}`);

        return true;
    } catch (error) {
        console.error("⚠️ Could not fetch account settings");
        return false;
    }
}

// Check 4: Send Test Message
async function sendTestMessage() {
    console.log("\n✅ Step 4: Test Message (Optional)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("To send a test message, run:");
    console.log('node test-green-api.js test <phone_number>');
    console.log('\nExample: node test-green-api.js test 919876543210');
    console.log('\n⚠️ IMPORTANT: Phone number must include country code (e.g., 91 for India)');
}

// Check 5: Validate Message Delivery
async function validateMessageDelivery(phoneNumber) {
    console.log("\n✅ Step 5: Validating Message Delivery");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Test different phone number formats
    const formats = [
        { label: "Format 1 (with @c.us)", chatId: `${phoneNumber}@c.us` },
        { label: "Format 2 (with @s.whatsapp.net)", chatId: `${phoneNumber}@s.whatsapp.net` }
    ];

    console.log(`\n📱 Testing phone number: ${phoneNumber}`);
    console.log(`Formats to test: ${formats.length}\n`);

    for (const format of formats) {
        console.log(`\nTesting ${format.label}: ${format.chatId}`);
        console.log("─".repeat(60));

        try {
            const response = await axios.post(
                `${GREEN_API_BASE_URL}/sendMessage/${GREEN_API_TOKEN}`,
                {
                    chatId: format.chatId,
                    message: `🎉 Test from InternVault!\n\nFormat: ${format.label}\nTime: ${new Date().toLocaleString()}\n\nIf you receive this, Green API is working! ✅`
                }
            );

            console.log("✅ API Response: SUCCESS");
            console.log(`Message ID: ${response.data.idMessage || 'N/A'}`);
            console.log(`Full Response: ${JSON.stringify(response.data, null, 2)}`);

            // Check if the response indicates success
            if (response.data.idMessage) {
                console.log("✅ Message queued successfully!");
                console.log("\n⏳ Wait 5-10 seconds and check your WhatsApp...");
            } else {
                console.log("⚠️ Warning: No message ID returned - message may not be sent");
            }

        } catch (error) {
            console.error("❌ Failed to send:");
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error(`Error Details: ${JSON.stringify(error.response.data, null, 2)}`);

                // Provide specific guidance based on error
                if (error.response.status === 400) {
                    console.log("\n💡 Tip: Phone number format might be incorrect");
                } else if (error.response.status === 401 || error.response.status === 403) {
                    console.log("\n💡 Tip: Check your API credentials");
                } else if (error.response.status === 429) {
                    console.log("\n💡 Tip: Rate limit exceeded - wait a few minutes");
                }
            } else {
                console.error(error.message);
            }
        }

        // Wait between attempts
        if (formats.indexOf(format) < formats.length - 1) {
            console.log("\nWaiting 3 seconds before next format...");
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

// Main execution
(async () => {
    const isAuthorized = await checkInstanceStatus();

    if (isAuthorized) {
        await checkAccountSettings();

        // If test argument provided
        if (process.argv[2] === 'test' && process.argv[3]) {
            const phoneNumber = process.argv[3];
            await validateMessageDelivery(phoneNumber);
        } else {
            await sendTestMessage();
        }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📚 Resources:");
    console.log("- Green API Console: https://console.green-api.com");
    console.log("- Documentation: https://green-api.com/docs/");
    console.log("- API Methods: https://green-api.com/docs/api/");
    console.log("\n");
})();
