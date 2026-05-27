'use server';

import { serverDb } from '@/lib/firebase-server';
import { collection, collectionGroup, addDoc, getDocs, getDoc, doc, orderBy, query, where, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { getTenantId } from './auth';

export async function createLead(prevState: any, formData: FormData) {
  try {
    const projectId = formData.get('projectId') as string;
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';
    const name = formData.get('name') as string || ''; 
    const email = formData.get('email') as string || '';
    const phone = formData.get('phone') as string || '';
    const message = formData.get('message') as string || '';

    if (!projectId) {
      return { success: false, error: 'Progetto mancante' };
    }

    if (!email) {
      return { success: false, error: 'Email è obbligatoria' };
    }

    const projectDoc = await getDoc(doc(serverDb, 'projects', projectId));
    if (!projectDoc.exists()) {
      return { success: false, error: 'Progetto non trovato' };
    }
    const tenantId = projectDoc.data()?.tenantId;

    const leadsRef = collection(serverDb, 'leads');
    await addDoc(leadsRef, {
      firstName,
      lastName,
      name,
      email,
      phone,
      message,
      createdAt: serverTimestamp(),
      source: 'landing_page',
      projectId,
      tenantId
    });

    return { success: true, message: 'Richiesta inviata con successo!' };
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return { success: false, error: error.message || 'Errore durante l\'invio.' };
  }
}

export async function getLeads(projectId?: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Unauthorized' };
    
    let leads: any[] = [];
    if (projectId) {
      // Legacy path
      const qLegacy = query(
        collection(serverDb, 'projects', projectId, 'leads'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      // New root collection path
      const qRoot = query(
        collection(serverDb, 'leads'),
        where('tenantId', '==', tenantId),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      
      const [snapLegacy, snapRoot] = await Promise.all([
        getDocs(qLegacy),
        getDocs(qRoot)
      ]);
      
      const leadsMap = new Map();
      snapLegacy.docs.forEach(doc => leadsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      snapRoot.docs.forEach(doc => leadsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      
      leads = Array.from(leadsMap.values()).map(docData => {
        let createdAtStr = '';
        if (docData.createdAt) {
          if (typeof docData.createdAt.toDate === 'function') {
            createdAtStr = docData.createdAt.toDate().toISOString();
          } else if (docData.createdAt.seconds) {
            createdAtStr = new Date(docData.createdAt.seconds * 1000).toISOString();
          } else if (typeof docData.createdAt === 'string') {
            createdAtStr = docData.createdAt;
          } else {
            createdAtStr = new Date().toISOString();
          }
        }
        return {
          ...docData,
          createdAt: createdAtStr || null
        };
      });

      leads.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    } else {
      // Query collectionGroup for legacy project leads
      const qGroup = query(
        collectionGroup(serverDb, 'leads'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      // Query root collection for new unified leads (Meta & new landing page leads)
      const qRoot = query(
        collection(serverDb, 'leads'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      
      const [snapshotGroup, snapshotRoot] = await Promise.all([
        getDocs(qGroup).catch(() => ({ docs: [] })), // Fallback if index is missing
        getDocs(qRoot).catch(() => ({ docs: [] }))
      ]);

      const leadsMap = new Map();
      
      // Deduplicate merging
      snapshotGroup.docs.forEach(doc => leadsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      snapshotRoot.docs.forEach(doc => leadsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      
      leads = Array.from(leadsMap.values()).map(docData => {
        let createdAtStr = '';
        if (docData.createdAt) {
          if (typeof docData.createdAt.toDate === 'function') {
            createdAtStr = docData.createdAt.toDate().toISOString();
          } else if (docData.createdAt.seconds) {
            createdAtStr = new Date(docData.createdAt.seconds * 1000).toISOString();
          } else if (typeof docData.createdAt === 'string') {
            createdAtStr = docData.createdAt;
          } else {
            createdAtStr = new Date().toISOString();
          }
        }
        return {
          ...docData,
          createdAt: createdAtStr || null
        };
      });
      
      // Sort descending by createdAt
      leads.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return { success: true, data: leads };
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    if (error.message && error.message.includes('index')) {
       console.error("Needs Firestore composite index for collectionGroup query");
    }
    return { success: false, error: error.message || 'Errore recupero leads' };
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
    const projectDoc = await getDoc(doc(serverDb, 'projects', data.projectId));
    if (!projectDoc.exists()) throw new Error('Project not found');
    const tenantId = projectDoc.data()?.tenantId;

    await addDoc(collection(serverDb, 'leads'), {
      ...data,
      source: 'landing_form',
      status: 'new',
      createdAt: serverTimestamp(),
      tenantId
    });
    return { success: true };
  } catch (error: any) {
    console.error('submitLead error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) {
      return { success: false, error: 'Non autorizzato' };
    }
    
    const leadRef = doc(serverDb, 'leads', leadId);
    await updateDoc(leadRef, { status });
    
    return { success: true };
  } catch (error: any) {
    console.error('updateLeadStatus error:', error);
    return { success: false, error: error.message || 'Errore durante l\'aggiornamento dello stato.' };
  }
}

export async function getLeadStats() {
  try {
    const res = await getLeads();
    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Impossibile caricare i lead' };
    }
    
    const leads = res.data;
    const total = leads.length;

    const bySource = {
      landing_page: 0,
      meta_ads: 0,
      landing_form: 0,
      other: 0,
    };

    const byStatus = {
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0,
    };

    let thisMonth = 0;

    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    for (const lead of leads) {
      const src = lead.source;
      if (src === 'landing_page') {
        bySource.landing_page++;
      } else if (src === 'meta_ads') {
        bySource.meta_ads++;
      } else if (src === 'landing_form') {
        bySource.landing_form++;
      } else {
        bySource.other++;
      }

      const stat = lead.status || 'new';
      if (stat === 'new') {
        byStatus.new++;
      } else if (stat === 'contacted') {
        byStatus.contacted++;
      } else if (stat === 'qualified') {
        byStatus.qualified++;
      } else if (stat === 'lost') {
        byStatus.lost++;
      } else {
        byStatus.new++;
      }

      if (lead.createdAt) {
        const leadDate = new Date(lead.createdAt);
        if (leadDate >= startOfCurrentMonth) {
          thisMonth++;
        }
      }
    }

    return {
      success: true,
      data: {
        total,
        bySource,
        byStatus,
        thisMonth
      }
    };
  } catch (error: any) {
    console.error('getLeadStats error:', error);
    return { success: false, error: error.message || 'Errore durante il calcolo delle statistiche.' };
  }
}

