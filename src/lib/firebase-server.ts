import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const serverDb = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
