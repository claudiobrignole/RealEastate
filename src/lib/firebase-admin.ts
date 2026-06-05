import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../../firebase-applet-config.json';

let app: admin.app.App | null = null;
let credentialsWarningLogged = false;

function getPrivateKey(): string | null {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return null;
  return raw.replace(/\\n/g, '\n');
}

export function hasFirebaseAdminCredentials(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    getPrivateKey()
  );
}

export function getFirebaseAdminStatus(): {
  ok: boolean;
  message: string;
} {
  if (!process.env.FIREBASE_PROJECT_ID) {
    return { ok: false, message: 'FIREBASE_PROJECT_ID mancante' };
  }
  const email = process.env.FIREBASE_CLIENT_EMAIL;
  if (!email) {
    return { ok: false, message: 'FIREBASE_CLIENT_EMAIL mancante o malformato (controlla le virgolette in .env)' };
  }
  if (email.startsWith('=') || !email.includes('@')) {
    return { ok: false, message: 'FIREBASE_CLIENT_EMAIL non valido: verifica virgolette e formato email' };
  }
  if (!getPrivateKey()) {
    return { ok: false, message: 'FIREBASE_PRIVATE_KEY mancante' };
  }
  if (!getPrivateKey()?.includes('BEGIN PRIVATE KEY')) {
    return { ok: false, message: 'FIREBASE_PRIVATE_KEY non valida: deve includere BEGIN PRIVATE KEY' };
  }
  return { ok: true, message: 'Firebase Admin configurato' };
}

function getApp(): admin.app.App {
  if (app) return app;

  if (admin.apps.length > 0) {
    app = admin.apps[0]!;
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || config.projectId;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (clientEmail && privateKey) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
    return app;
  }

  if (!credentialsWarningLogged) {
    credentialsWarningLogged = true;
    console.error(
      '[Firebase Admin] Credenziali mancanti. Imposta FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY in .env.local (locale) o nelle variabili Hostinger (produzione).'
    );
  }

  throw new Error(
    'Firebase Admin non configurato. Controlla FIREBASE_CLIENT_EMAIL (virgolette) e FIREBASE_PRIVATE_KEY.'
  );
}

const firestoreDatabaseId =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ||
  (config as { firestoreDatabaseId?: string }).firestoreDatabaseId;

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop, receiver) {
    const db = firestoreDatabaseId
      ? getFirestore(getApp(), firestoreDatabaseId)
      : getFirestore(getApp());
    const value = Reflect.get(db, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  },
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(target, prop, receiver) {
    const auth = admin.auth(getApp());
    const value = Reflect.get(auth, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(auth);
    }
    return value;
  },
});
