'use server';

import { serverDb } from '../firebase-server';
import { collection, collectionGroup, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore/lite';

export async function createLead(prevState: any, formData: FormData) {
  try {
    const projectId = formData.get('projectId') as string;
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';
    const name = formData.get('name') as string || ''; // fallback if single name field
    const email = formData.get('email') as string || '';
    const phone = formData.get('phone') as string || '';
    const message = formData.get('message') as string || '';

    if (!projectId) {
      return { success: false, error: 'Progetto mancante' };
    }

    if (!email) {
      return { success: false, error: 'Email è obbligatoria' };
    }

    const leadsRef = collection(serverDb, 'projects', projectId, 'leads');
    await addDoc(leadsRef, {
      firstName,
      lastName,
      name,
      email,
      phone,
      message,
      createdAt: serverTimestamp(),
      source: 'landing_page',
      projectId
    });

    return { success: true, message: 'Richiesta inviata con successo!' };
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return { success: false, error: error.message || 'Errore durante l\'invio.' };
  }
}

export async function getLeads(projectId?: string) {
  try {
    let q;
    if (projectId) {
      const leadsRef = collection(serverDb, 'projects', projectId, 'leads');
      q = query(leadsRef, orderBy('createdAt', 'desc'));
    } else {
      const leadsGroupRef = collectionGroup(serverDb, 'leads');
      q = query(leadsGroupRef, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    
    const leads = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

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
    await addDoc(collection(serverDb, 'leads'), {
      ...data,
      source: 'landing_form',
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('submitLead error:', error);
    return { success: false, error: error.message };
  }
}
