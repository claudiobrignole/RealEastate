'use server';

import {
  addDocData,
  queryCollection,
  serverTimestamp,
  updateDocData,
} from '@/lib/server-db';
import { getTenantId } from './auth';

export async function getAppointments(year: number, month: number) {
  try {
    const tenantId = await getTenantId();
    const data = await queryCollection('appointments', [
      ['tenantId', '==', tenantId],
      ['year', '==', year],
      ['month', '==', month],
    ]);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore nel recupero degli appuntamenti';
    return { success: false, error: message };
  }
}

export async function getTodayAppointments() {
  try {
    const tenantId = await getTenantId();
    const todayStr = new Date().toISOString().split('T')[0];
    const data = await queryCollection('appointments', [
      ['tenantId', '==', tenantId],
      ['dateStr', '==', todayStr],
    ]);

    data.sort((a, b) =>
      String(a.startTime || '').localeCompare(String(b.startTime || ''))
    );

    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore appuntamenti di oggi';
    return { success: false, error: message };
  }
}

export async function createAppointment(data: {
  title: string;
  dateStr: string;
  startTime: string;
  endTime?: string;
  type?: string;
  leadName?: string;
  description?: string;
  projectId?: string;
  leadId?: string;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Non autorizzato' };

    const [y, m] = data.dateStr.split('-').map(Number);
    const id = await addDocData('appointments', {
      ...data,
      tenantId,
      year: y,
      month: m,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { success: true, id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore creazione appuntamento';
    return { success: false, error: message };
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Non autorizzato' };

    await updateDocData('appointments', appointmentId, { status });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore aggiornamento';
    return { success: false, error: message };
  }
}
