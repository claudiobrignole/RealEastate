export async function translateContent(text: string, targetLanguage: string): Promise<string> {
  if (!text) return '';

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLanguage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to translate via API');
    }

    const data = await response.json();
    return data.translatedText || '';
  } catch (error) {
    console.error(`Error translating to ${targetLanguage} via API route:`, error);
    throw new Error('Failed to translate content');
  }
}
