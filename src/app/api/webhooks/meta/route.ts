import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const VERIFY_TOKEN = 'unitleads_meta_secure_webhook_2026';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Store the raw webhook event
    await adminDb.collection('webhook_events').add({
      payload: body,
      createdAt: new Date().toISOString(),
      source: 'meta'
    });

    // Acknowledge receipt to Meta quickly to avoid timeouts
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Meta webhook:', error);
    // Still return 200 so Meta doesn't keep retrying malformed payloads
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
