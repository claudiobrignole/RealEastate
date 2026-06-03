import { getCurrentUser } from '@/lib/actions/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error fetching session in API route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
