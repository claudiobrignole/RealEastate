export async function translateContent(text: string, targetLanguage: string): Promise<string> {
  if (!text) return '';
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });
  if (!response.ok) throw new Error('Translation failed');
  const data = await response.json();
  return data.translatedText || '';
}
