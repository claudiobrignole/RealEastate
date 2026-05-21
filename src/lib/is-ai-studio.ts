import { headers } from 'next/headers';

export async function isAiStudio(): Promise<boolean> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    // Google AI Studio previews run on Cloud Run (*.run.app) and local is localhost
    return (
      host.includes('run.app') || 
      host.includes('localhost') || 
      host.includes('127.0.0.1')
    );
  } catch (error) {
    // Safe fallback to avoid breaking local / server-side builds
    return false;
  }
}
