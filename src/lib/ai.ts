import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function translateContent(text: string, targetLanguage: string): Promise<string> {
  if (!text) return '';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Translate the following HTML content or text to ${targetLanguage}. Maintain all HTML tags, structure, and formatting exactly as they are. Only translate the textual content. Here is the text:\n\n${text}`,
      config: {
        systemInstruction: "You are an expert real estate copywriter and translator. Your goal is to translate text accurately while preserving HTML formatting. Only return the translated text/HTML, no markdown formatting blocks around it.",
        temperature: 0.2,
      }
    });

    let translatedText = response.text || '';
    
    if (translatedText.startsWith("```html")) {
      translatedText = translatedText.replace(/^```html\n/, '').replace(/\n```$/, '');
    } else if (translatedText.startsWith("```")) {
      translatedText = translatedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return translatedText.trim();
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    throw new Error('Failed to translate content');
  }
}
