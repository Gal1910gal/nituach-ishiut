import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash";

export function getGeminiModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });
}

export async function callGemini(parts: Part[]): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent(parts);
  return result.response.text();
}
