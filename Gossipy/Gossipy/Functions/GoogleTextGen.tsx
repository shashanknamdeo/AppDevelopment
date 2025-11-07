// Functions/GoogleTextGen.tsx
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GENAI_API_KEY } from "@env";

const genAI = new GoogleGenerativeAI(GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateText(prompt: string): Promise<string> {
  try {
    if (!prompt.trim()) return "";
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "⚠️ Error: Failed to fetch AI response.";
  }
}
