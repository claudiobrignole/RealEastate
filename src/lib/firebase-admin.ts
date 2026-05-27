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

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
        projectId: projectId,
      });
    } catch (error) {
      console.log('Firebase admin cert initialization failed, falling back to projectId only:', error);
      try {
        app = admin.initializeApp({
          projectId: projectId || config.projectId,
        });
      } catch (fallbackError) {
        console.error('Firebase admin fallback initialization failed:', fallbackError);
        throw fallbackError;
      }
    }
  } else {
    try {
      app = admin.initializeApp({
        projectId: projectId || config.projectId,
      });
    } catch (fallbackError) {
      console.error('Firebase admin fallback initialization with projectId only failed:', fallbackError);
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
