import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Runtime check for environment variables
const checkEnvVars = () => {
  const missingKeys = [];
  if (!import.meta.env.VITE_GEMINI_API_KEY) missingKeys.push("VITE_GEMINI_API_KEY");
  if (!import.meta.env.VITE_GROQ_API_KEY) missingKeys.push("VITE_GROQ_API_KEY");

  if (missingKeys.length > 0) {
    /*
    console.warn(
      "%c⚠️ MISSING API KEYS:",
      "background: #ff0000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px;"
    );
    console.warn(
      `The following environment variables are missing: ${missingKeys.join(", ")}.\n` +
      "Functionality like the Chatbot will NOT work.\n" +
      "Please add them in your Vercel Project Settings -> Environment Variables."
    );
    */
  } else {
    console.log(
      "%c✅ API KEYS FOUND",
      "background: #00aa00; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px;",
      "Gemini and Groq keys are present."
    );
  }
};

checkEnvVars();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
