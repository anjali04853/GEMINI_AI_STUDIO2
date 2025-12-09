import { GoogleGenAI } from "@google/genai";

// Note: In a real app, do not expose API keys on the client if possible.
// For this demo structure, we use process.env.API_KEY as per instructions.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateResponse = async (prompt: string) => {
  if (!apiKey) {
    throw new Error("API Key not found. Please set process.env.API_KEY");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
