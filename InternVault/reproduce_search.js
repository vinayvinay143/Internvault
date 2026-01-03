import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to read .env manually since we can't rely on dotenv
function getEnvVar(key) {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(new RegExp(`${key}=(.*)`));
            if (match) return match[1].trim();
        }
    } catch (e) { console.error("Error reading .env:", e); }
    return process.env[key];
}

const apiKey = getEnvVar('VITE_TAVILY_API_KEY');

if (!apiKey) {
    console.error("Missing VITE_TAVILY_API_KEY. Set it in your .env or export it.");
    process.exit(1);
}

async function search(query) {
    console.log(`\n--- Testing Query: [${query}] ---`);
    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: apiKey,
                query: query,
                search_depth: "basic",
                max_results: 5,
                include_answer: true,
            }),
        });
        const data = await response.json();
        if (data.results) {
            data.results.forEach((res, i) => {
                console.log(`${i + 1}. ${res.title} (${res.url})`);
                console.log(`   Snippet: ${res.content.substring(0, 150)}...`);
            });
            console.log(`\nAI Answer: ${data.answer}`);
        } else {
            console.log("No results found.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

// 1. Current Logic
const input = "talentshine internship";
// The logic in InternChat.jsx uses quotes around the input
const currentQuery = `"${input}" company internship reviews scam check`;

// 2. Proposed "Relaxed" Logic
const relaxedQuery = `${input} company reviews official site`;

async function main() {
    await search(currentQuery);
    await search(relaxedQuery);
}

main();
