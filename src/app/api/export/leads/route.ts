import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/actions/leads';
import { getCurrentUser } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

function escapeCsv(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  const res = await getLeads();
  if (!res.success || !res.data) {
    return NextResponse.json({ error: res.error || 'Errore export' }, { status: 500 });
  }

  const headers = ['id', 'name', 'email', 'phone', 'source', 'status', 'projectId', 'createdAt'];
  const rows = res.data.map((lead) =>
    headers.map((h) => escapeCsv(lead[h as keyof typeof lead])).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
