import { getSuperAdminAllTenants } from '@/lib/actions/users';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await getSuperAdminAllTenants();
    return NextResponse.json(res);
  } catch (error: any) {
    console.error('Error fetching tenants in API route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
