import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAwSStMu_WcxEonVbT0eBrE8Ykg6HPawFc";
const genAI = new GoogleGenerativeAI(apiKey);

async function testAllModels() {
    console.log("Testing API Key:", apiKey);
    console.log("=".repeat(60));

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-latest",
        "gemini-pro",
        "gemini-1.0-pro",
        "gemini-1.0-pro-latest",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-pro",
        "models/gemini-pro"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`\n🔄 Trying: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello in 3 words");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ SUCCESS with ${modelName}`);
            console.log(`   Response: ${text}`);
            console.log(`\n🎉 WORKING MODEL FOUND: "${modelName}"`);
            return modelName;
        } catch (error) {
            const errorMsg = error.message.split('\n')[0];
            console.log(`❌ FAILED: ${errorMsg.substring(0, 80)}`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("❌ NO WORKING MODELS FOUND");
    console.log("\n⚠️  SOLUTIONS:");
    console.log("1. Create a NEW API key at: https://aistudio.google.com/app/apikey");
    console.log("2. Make sure you're using a Google account");
    console.log("3. Enable the Gemini API for your project");
    console.log("4. Check if there are any restrictions on your API key");
}

testAllModels();
