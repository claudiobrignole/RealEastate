import { NextResponse } from 'next/server';
import { establishDevBypassSession } from '@/lib/actions/auth';
import { allowDevAuthBypass } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!allowDevAuthBypass()) {
    return NextResponse.json({ success: false, error: 'Non disponibile' }, { status: 403 });
  }
  const result = await establishDevBypassSession();
  return NextResponse.json(result);
}
