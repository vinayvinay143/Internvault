# Vercel Deployment Checklist

If your API keys are not working in deployment, it is likely because they are not set in the Vercel Environment Variables.

## 1. Required Variables

You must add the following variables to your Vercel Project Settings:

| Variable Name | Description | Required? |
|--------------|-------------|-----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API Key for Chatbot & Scam Detection | **YES** |
| `VITE_GROQ_API_KEY` | Groq API Key for alternative AI/Llama models | **YES** |
| `VITE_JOOBLE_API_KEY` | For internship search (if using Jooble) | Optional |
| `VITE_FINDWORK_API_KEY` | For internship search (if using Findwork) | Optional |
| `VITE_INDIANAPI_API_KEY` | For internship search (if using IndianAPI) | Optional |

## 2. How to Add in Vercel

1.  Go to your **Vercel Dashboard**.
2.  Select your project (**InternVault**).
3.  Click on the **Settings** tab.
4.  Click on **Environment Variables** in the left sidebar.
5.  Add each variable:
    *   **Key**: `VITE_GEMINI_API_KEY`
    *   **Value**: (Paste your actual key starting with `AIza...`)
    *   **Environments**: Select Production, Preview, and Development.
6.  Click **Save**.
7.  **IMPORTANT**: You must **Redeploy** your application for these changes to take effect!
    *   Go to **Deployments**.
    *   Click the three dots on the latest deployment -> **Redeploy**.
