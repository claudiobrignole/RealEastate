import { NextResponse } from 'next/server';
import { getFirebaseAdminStatus } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = getFirebaseAdminStatus();
  return NextResponse.json({
    ok: admin.ok,
    firebaseAdmin: admin.message,
    nodeEnv: process.env.NODE_ENV || 'development',
    devBypass: process.env.ALLOW_DEV_AUTH_BYPASS === 'true',
    hasPublicFirebaseConfig: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  });
}
