import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGroqAPI() {
    console.log("🧪 Testing Groq API...\n");

    // Read .env file manually
    let apiKey = null;
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/VITE_GROQ_API_KEY=(.+)/);
            if (match && match[1]) {
                apiKey = match[1].trim();
            }
        }
    } catch (e) {
        console.error("⚠️  Could not read .env file:", e.message);
    }

    if (!apiKey || apiKey === "gsk_..." || apiKey.startsWith("VITE_GROQ_API_KEY=")) {
        console.error("❌ API Key not found or invalid in .env file.");
        console.log("\n⚠️  Please make sure you:");
        console.log("   1. Have a .env file in Internvault/InternVault");
        console.log("   2. Have VITE_GROQ_API_KEY=gsk_your_key_here inside it");
        return;
    }

    // Mask key for logging
    const maskedKey = apiKey.substring(0, 8) + "..." + apiKey.substring(apiKey.length - 4);
    console.log(`🔑 Found API Key: ${maskedKey}`);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Using a known good model
                messages: [
                    {
                        role: "user",
                        content: "Are you working? Reply with 'Yes, I am functional!'"
                    }
                ],
                max_tokens: 50,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("❌ API Error:", error);
            return;
        }

        const data = await response.json();
        console.log("✅ SUCCESS! Groq API is working!");
        console.log("🤖 Response:", data.choices[0].message.content);

    } catch (error) {
        console.error("❌ Connection Error:", error.message);
    }
}

testGroqAPI();
