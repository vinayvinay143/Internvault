import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  console.log('⚠️  [BUILD LOG] Checking API Keys...');
  console.log(`⚠️  [BUILD LOG] VITE_GROQ_API_KEY exists: ${!!env.VITE_GROQ_API_KEY}`);
  console.log(`⚠️  [BUILD LOG] VITE_GEMINI_API_KEY exists: ${!!env.VITE_GEMINI_API_KEY}`);

  return {
    plugins: [react()],
    css: {
      devSourcemap: true
    },
    build: {
      sourcemap: true
    }
  };
});
