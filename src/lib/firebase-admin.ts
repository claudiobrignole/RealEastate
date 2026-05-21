import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../../firebase-applet-config.json';

let app: admin.app.App | null = null;

function getApp(): admin.app.App {
  if (app) return app;
  
  if (admin.apps.length > 0) {
    app = admin.apps[0]!;
    return app;
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: config.projectId,
    });
  } catch (error) {
    console.log('Firebase admin initialization with applicationDefault failed, trying dynamic projectId only fallback:', error);
    try {
      app = admin.initializeApp({
        projectId: config.projectId,
      });
    } catch (fallbackError) {
      console.error('Firebase admin fallback initialization failed:', fallbackError);
      throw fallbackError;
    }
  }
  return app;
}

// Use ES6 Proxies to lazily fetch and invoke properties on Firestore and Auth instances ONLY when they are called at runtime (preventing build-time crashes)
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop, receiver) {
    const db = getFirestore(getApp(), (config as any).firestoreDatabaseId);
    const value = Reflect.get(db, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  }
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(target, prop, receiver) {
    const auth = admin.auth(getApp());
    const value = Reflect.get(auth, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(auth);
    }
    return value;
  }
});
