import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../../firebase-applet-config.json';

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: config.projectId,
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error);
    app = admin.app();
  }
} else {
  app = admin.app();
}

export const adminDb = getFirestore(app, (config as any).firestoreDatabaseId);
export const adminAuth = admin.auth(app);
