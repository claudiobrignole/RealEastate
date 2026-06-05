'use server';

import {
  addDocData,
  getDocData,
  normalizeTimestamp,
  queryCollection,
  queryCollectionGroup,
  serverTimestamp,
  updateDocData,
} from '@/lib/server-db';
import { getTenantId } from './auth';

function mapLead(docData: Record<string, unknown> & { id: string }): Record<string, unknown> & { id: string; createdAt: string | null } {
  return {
    ...docData,
    id: docData.id,
    createdAt: normalizeTimestamp(docData.createdAt),
  };
}

function mergeLeads(rows: Array<Record<string, unknown> & { id: string }>) {
  const map = new Map<string, ReturnType<typeof mapLead>>();
  for (const row of rows) {
    map.set(row.id, mapLead(row));
  }
  const leads = Array.from(map.values());
  leads.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
    return timeB - timeA;
  });
  return leads;
}

export async function createLead(prevState: unknown, formData: FormData) {
  try {
    const projectId = formData.get('projectId') as string;
    const firstName = (formData.get('firstName') as string) || '';
    const lastName = (formData.get('lastName') as string) || '';
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const phone = (formData.get('phone') as string) || '';
    const message = (formData.get('message') as string) || '';

    if (!projectId) return { success: false, error: 'Progetto mancante' };
    if (!email) return { success: false, error: 'Email è obbligatoria' };

    const project = await getDocData('projects', projectId);
    if (!project) return { success: false, error: 'Progetto non trovato' };

    await addDocData('leads', {
      firstName,
      lastName,
      name,
      email,
      phone,
      message,
      createdAt: serverTimestamp(),
      source: 'landing_page',
      status: 'new',
      projectId,
      tenantId: project.tenantId,
    });

    return { success: true, message: 'Richiesta inviata con successo!' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore durante l\'invio.';
    return { success: false, error: message };
  }
}

export async function getLeads(projectId?: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Unauthorized' };

    let rows: Array<Record<string, unknown> & { id: string }> = [];

    if (projectId) {
      const [legacy, root] = await Promise.all([
        queryCollectionGroup('leads', [
          ['tenantId', '==', tenantId],
        ]).catch(() => []),
        queryCollection('leads', [
          ['tenantId', '==', tenantId],
          ['projectId', '==', projectId],
        ], 'createdAt', 'desc').catch(() => []),
      ]);
      rows = [...legacy.filter((l) => l.projectId === projectId), ...root];
    } else {
      const [group, root] = await Promise.all([
        queryCollectionGroup('leads', [['tenantId', '==', tenantId]], 'createdAt', 'desc').catch(() => []),
        queryCollection('leads', [['tenantId', '==', tenantId]], 'createdAt', 'desc').catch(() => []),
      ]);
      rows = [...group, ...root];
    }

    return { success: true, data: mergeLeads(rows) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore recupero leads';
    return { success: false, error: message };
  }
}

export async function getLeadById(leadId: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Non autorizzato' };

    const lead = await getDocData('leads', leadId);
    if (!lead || lead.tenantId !== tenantId) {
      return { success: false, error: 'Lead non trovato' };
    }
    return { success: true, data: mapLead(lead as Record<string, unknown> & { id: string }) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore';
    return { success: false, error: message };
  }
}

export async function submitLead(data: {
  projectId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  try {
    const project = await getDocData('projects', data.projectId);
    if (!project) throw new Error('Project not found');

    await addDocData('leads', {
      ...data,
      source: 'landing_form',
      status: 'new',
      createdAt: serverTimestamp(),
      tenantId: project.tenantId,
    });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore';
    return { success: false, error: message };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Non autorizzato' };

    const lead = await getDocData('leads', leadId);
    if (!lead || lead.tenantId !== tenantId) {
      return { success: false, error: 'Lead non trovato' };
    }

    await updateDocData('leads', leadId, { status });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore aggiornamento stato';
    return { success: false, error: message };
  }
}

export async function getLeadStats() {
  const res = await getLeads();
  if (!res.success || !res.data) {
    return { success: false, error: res.error || 'Impossibile caricare i lead' };
  }

  const leads = res.data;
  const bySource = { landing_page: 0, meta_ads: 0, landing_form: 0, other: 0 };
  const byStatus = { new: 0, contacted: 0, qualified: 0, lost: 0 };
  let thisMonth = 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  for (const lead of leads) {
    const src = lead.source as string;
    if (src === 'landing_page') bySource.landing_page++;
    else if (src === 'meta_ads') bySource.meta_ads++;
    else if (src === 'landing_form') bySource.landing_form++;
    else bySource.other++;

    const stat = (lead.status as string) || 'new';
    if (stat in byStatus) byStatus[stat as keyof typeof byStatus]++;
    else byStatus.new++;

    if (lead.createdAt && new Date(lead.createdAt as string) >= startOfMonth) {
      thisMonth++;
    }
  }

  return {
    success: true,
    data: { total: leads.length, bySource, byStatus, thisMonth },
  };
}

export async function getLeadCountsByProject() {
  const res = await getLeads();
  if (!res.success || !res.data) return {} as Record<string, number>;

  const counts: Record<string, number> = {};
  for (const lead of res.data) {
    const pid = lead.projectId as string | undefined;
    if (pid) counts[pid] = (counts[pid] || 0) + 1;
  }
  return counts;
}
