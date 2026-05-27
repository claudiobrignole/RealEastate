import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();
    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: `Translate the following HTML content or text to ${targetLanguage}. Maintain all HTML tags, structure, and formatting exactly as they are. Only translate the textual content. Here is the text:\n\n${text}`,
      config: {
        systemInstruction: 'You are an expert real estate copywriter and translator. Your goal is to translate text accurately while preserving HTML formatting. Only return the translated text/HTML, no markdown formatting blocks around it.',
        temperature: 0.2,
      },
    });
    let translatedText = response.text || '';
    if (translatedText.startsWith('```html')) {
      translatedText = translatedText.replace(/^```html\n/, '').replace(/\n```$/, '');
    } else if (translatedText.startsWith('```')) {
      translatedText = translatedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    return NextResponse.json({ translatedText: translatedText.trim() });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
