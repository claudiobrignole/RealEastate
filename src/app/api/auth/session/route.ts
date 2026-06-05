import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, getFirebaseAdminStatus } from '@/lib/firebase-admin';
import { ensureUserProfile } from '@/lib/ensure-user-profile';

export const dynamic = 'force-dynamic';

const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(req: NextRequest) {
  try {
    const adminStatus = getFirebaseAdminStatus();
    if (!adminStatus.ok) {
      return NextResponse.json(
        { success: false, error: `Server non configurato: ${adminStatus.message}` },
        { status: 503 }
      );
    }

    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ success: false, error: 'Token mancante' }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    try {
      await ensureUserProfile(decoded.uid);
    } catch (e) {
      console.warn('ensureUserProfile skipped:', e);
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const cookieStore = await cookies();
    cookieStore.delete('__explicit_logout');
    cookieStore.set('__session', sessionCookie, {
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Session cookie error:', error);
    const message = error instanceof Error ? error.message : 'Errore sessione';
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (session) {
    try {
      const decoded = await adminAuth.verifySessionCookie(session, true);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // ignore invalid session on logout
    }
  }
  cookieStore.delete('__session');
  cookieStore.delete('__active_tenant');
  cookieStore.set('__explicit_logout', 'true', {
    path: '/',
    maxAge: 86400,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return NextResponse.json({ success: true });
}
