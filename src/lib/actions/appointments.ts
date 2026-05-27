'use server';

import { serverDb } from '@/lib/firebase-server';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore/lite';
import { getTenantId } from './auth';

export async function getAppointments(year: number, month: number) {
  try {
    const tenantId = await getTenantId();
    const q = query(
      collection(serverDb, 'appointments'),
      where('tenantId', '==', tenantId),
      where('year', '==', year),
      where('month', '==', month)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    
    return { success: true, data };
  } catch (error: any) {
    console.error('getAppointments error:', error);
    return { success: false, error: error.message || 'Errore nel recupero degli appuntamenti' };
  }
}

export async function getTodayAppointments() {
  try {
    const tenantId = await getTenantId();
    const todayStr = new Date().toISOString().split('T')[0];
    const q = query(
      collection(serverDb, 'appointments'),
      where('tenantId', '==', tenantId),
      where('dateStr', '==', todayStr)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as any[];

    // Sort in JS by startTime to be absolutely safe and index-independent
    data.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    return { success: true, data };
  } catch (error: any) {
    console.error('getTodayAppointments error:', error);
    return { success: false, error: error.message || 'Errore nel recupero degli appuntamenti di oggi' };
  }
}

export async function createAppointment(data: { 
  title: string; 
  description?: string; 
  dateStr: string; 
  startTime: string; 
  endTime: string; 
  leadId?: string; 
  leadName?: string; 
  type: string; 
}) {
  try {
    const tenantId = await getTenantId();
    const parts = data.dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    const docRef = await addDoc(collection(serverDb, 'appointments'), {
      ...data,
      tenantId,
      year,
      month,
      status: 'confirmed',
      createdAt: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('createAppointment error:', error);
    return { success: false, error: error.message || 'Errore durante la creazione dell\'appuntamento' };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string, 
  status: 'confirmed' | 'cancelled' | 'pending'
) {
  try {
    const docRef = doc(serverDb, 'appointments', appointmentId);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error: any) {
    console.error('updateAppointmentStatus error:', error);
    return { success: false, error: error.message || 'Errore durante l\'aggiornamento dello stato' };
  }
}
