'use server';

import { serverDb } from '@/lib/firebase-server';
import { collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore/lite';

export async function createProject(data: any) {
  try {
    const projectRef = doc(collection(serverDb, 'projects'));
    const projectData = {
      ...data,
      id: projectRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(projectRef, projectData);
    
    return { success: true, id: projectRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getProjects() {
  try {
    const q = query(collection(serverDb, 'projects'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: projects };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

