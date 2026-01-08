import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN;
const GREEN_API_BASE_URL = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}`;

/**
 * Format phone number for Green API
 * Green API expects format: countrycode + phonenumber + @c.us
 * Example: 919876543210@c.us
 */
const formatPhoneNumber = (phone) => {
    // Remove all spaces, hyphens, and plus signs
    let cleaned = phone.replace(/[\s\-+]/g, "");

    // Auto-prepend India country code (91) if missing
    // Indian mobile numbers are 10 digits, so if we have exactly 10 digits, add 91
    if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
        cleaned = `91${cleaned}`;
    }

    // Add @c.us suffix for Green API
    const formatted = `${cleaned}@c.us`;
    return formatted;
};

/**
 * Validate phone number format
 */
const validatePhoneNumber = (phone) => {
    // Remove formatting characters
    const cleaned = phone.replace(/[\s\-+]/g, "");

    // Check if it's a valid format (should be numeric and 10-15 digits)
    return /^\d{10,15}$/.test(cleaned);
};

/**
 * Send WhatsApp message to a single user
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            console.error(`❌ Invalid phone number: ${phoneNumber}`);
            return { success: false, error: "Invalid phone number format" };
        }

        // Format phone number
        const formattedPhone = formatPhoneNumber(phoneNumber);

        // Send message via Green API
        const response = await axios.post(
            `${GREEN_API_BASE_URL}/sendMessage/${GREEN_API_TOKEN}`,
            {
                chatId: formattedPhone,
                message: message
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        // Check for quota exceeded error (466)
        if (error.response?.status === 466) {
            return {
                success: false,
                error: 'Quota exceeded',
                quotaExceeded: true
            };
        }

        console.error(`❌ WhatsApp failed: ${phoneNumber} - ${error.message}`);
        return { success: false, error: error.message };
    }
};

/**
 * Send bulk internship notifications to all opted-in users
 */
export const sendBulkInternshipNotification = async (adData, users) => {
    try {
        if (!users || users.length === 0) {
            console.log("No users to notify");
            return { success: true, sent: 0, failed: 0 };
        }

        let sent = 0;
        let failed = 0;
        let quotaExceeded = 0;

        // Send to each user
        for (const user of users) {
            if (user.phone && user.whatsappNotifications) {
                try {
                    // If company has an image, send it first
                    if (adData.imageUrl) {
                        try {
                            await axios.post(
                                `${GREEN_API_BASE_URL}/sendFileByUrl/${GREEN_API_TOKEN}`,
                                {
                                    chatId: formatPhoneNumber(user.phone),
                                    urlFile: adData.imageUrl,
                                    fileName: `${adData.companyName}_logo.jpg`,
                                    caption: `*${adData.companyName}*`
                                }
                            );
                        } catch (imgError) {
                            // Image send failed, continue with text
                        }

                        // Small delay after image
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    // Create enhanced notification message
                    const message = `🎯 *InternVault - New Opportunity Alert!*

━━━━━━━━━━━━━━━━━━━━
*${adData.companyName}*
${adData.verificationStatus === 'Verified' ? '✅ *Verified & Safe*' : '⚠️ *Unverified*'}
━━━━━━━━━━━━━━━━━━━━

⏰ *Expires in:* 24 hours
🔥 *Don't miss out!*

👉 *Apply Now:*
${adData.link}

━━━━━━━━━━━━━━━━━━━━
Visit: https://internvault.com
_- InternVault Team_`;

                    const result = await sendWhatsAppMessage(user.phone, message);
                    if (result.success) {
                        sent++;
                    } else {
                        if (result.quotaExceeded) {
                            quotaExceeded++;
                        } else {
                            failed++;
                        }
                    }
                } catch (error) {
                    console.error(`Error sending to ${user.phone}:`, error.message);
                    failed++;
                }

                // Add delay between users to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        const summary = `📊 WhatsApp: ${sent} sent${quotaExceeded > 0 ? `, ${quotaExceeded} quota limited` : ''}${failed > 0 ? `, ${failed} failed` : ''}`;
        console.log(summary);

        return { success: true, sent, failed, quotaExceeded };

    } catch (error) {
        console.error("Error in bulk notification:", error.message);
        return { success: false, error: error.message };
    }
};

export default {
    sendWhatsAppMessage,
    sendBulkInternshipNotification,
    formatPhoneNumber,
    validatePhoneNumber
};
