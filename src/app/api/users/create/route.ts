import { createTenantUser } from '@/lib/actions/users';
import { NextRequest, NextResponse } from 'next/server';
import type { UserRole } from '@/types/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await createTenantUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role as UserRole | undefined,
      tenantId: body.tenantId,
    });
    return NextResponse.json(res, { status: res.success ? 200 : 400 });
  } catch (error: unknown) {
    console.error('Error creating user in API route:', error);
    const message = error instanceof Error ? error.message : 'Errore';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
