import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkKeys() {
    console.log("🔍 Checking Chat Configuration...\n");
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
        console.error("❌ .env file not found!");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');

    const groqMatch = envContent.match(/VITE_GROQ_API_KEY=(.+)/);
    const tavilyMatch = envContent.match(/VITE_TAVILY_API_KEY=(.+)/);

    const groqKey = groqMatch ? groqMatch[1].trim() : null;
    const tavilyKey = tavilyMatch ? tavilyMatch[1].trim() : null;

    if (groqKey && groqKey !== 'gsk_your_key_here') {
        console.log("✅ VITE_GROQ_API_KEY is set (starts with " + groqKey.substring(0, 4) + ")");
    } else {
        console.log("❌ VITE_GROQ_API_KEY is MISSING or default");
    }

    if (tavilyKey && tavilyKey !== 'tvly-your_tavily_api_key_here') {
        console.log("✅ VITE_TAVILY_API_KEY is set (starts with " + tavilyKey.substring(0, 4) + ")");
    } else {
        console.log("❌ VITE_TAVILY_API_KEY is MISSING or default");
        console.log("   -> This will cause the Chatbot to work without web search context, reducing accuracy significantly.");
    }
}

checkKeys();
