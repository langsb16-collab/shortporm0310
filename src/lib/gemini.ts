
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// Vite uses import.meta.env instead of process.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function generateShortsScripts(keyword: string, category: string, lang: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please set VITE_GEMINI_API_KEY in .env.local");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 viral short video scripts for "${keyword}" (${category}) in ${lang}. 
      Return JSON array: [{"title", "hook", "body", "cta", "hashtags"}]`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              cta: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["title", "hook", "body", "cta", "hashtags"],
          },
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating scripts:", error);
    throw new Error("Failed to generate scripts. Please check your API key and try again.");
  }
}

export async function generateThumbnailPrompt(scriptTitle: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Short image prompt for: "${scriptTitle}". Cinematic, 9:16.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    }
  });
  return response.text;
}

export async function generateThumbnailImage(prompt: string) {
  // Use gemini-2.5-flash-image for fastest image generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "9:16" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function askFAQ(question: string, lang: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Helpful answer for: "${question}" in ${lang}.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    }
  });
  return response.text;
}
