
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "YOUR_API_KEY_HERE"; // TODO: Use environment variables!
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log("Testing Gemini API with key:", apiKey);

    // Try to generate content with a fallback model
    const modelsToTry = ["gemini-1.0-pro", "gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro"];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}:`, response.text());
            return;
        } catch (error) {
            console.error(`FAILED with ${modelName}:`, error.message.split('\n')[0]);
        }
    }
}

test();
