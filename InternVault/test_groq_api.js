// Quick test script for Groq API
// Run this after you add your API key to .env

async function testGroqAPI() {
    const apiKey = "PASTE_YOUR_GROQ_API_KEY_HERE"; // Replace this!

    console.log("🧪 Testing Groq API...\n");

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: "Say hello in 5 words"
                    }
                ],
                max_tokens: 50,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("❌ API Error:", error);
            console.log("\n⚠️  Make sure you:");
            console.log("   1. Got your API key from https://console.groq.com/keys");
            console.log("   2. Replaced the placeholder above with your actual key");
            return;
        }

        const data = await response.json();
        console.log("✅ SUCCESS! Groq API is working!");
        console.log("🤖 Response:", data.choices[0].message.content);
        console.log("\n✨ Your chatbot is ready to use!");

    } catch (error) {
        console.error("❌ Connection Error:", error.message);
    }
}

testGroqAPI();
