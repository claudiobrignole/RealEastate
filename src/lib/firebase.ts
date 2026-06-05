import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseClientConfig, firestoreDatabaseId } from '@/lib/firebase-config';

const app = getApps().length === 0 ? initializeApp(firebaseClientConfig) : getApps()[0];

export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
