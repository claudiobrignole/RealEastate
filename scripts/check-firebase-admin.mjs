#!/usr/bin/env node
/**
 * Verifica credenziali Firebase Admin (Auth + Firestore).
 * Uso: node scripts/check-firebase-admin.mjs
 * Richiede .env.local nella root del progetto.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const envPath = resolve(process.cwd(), '.env.local');
if (!existsSync(envPath)) {
  console.error('❌ File .env.local non trovato');
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      const k = l.slice(0, i);
      let v = l.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      return [k, v];
    })
);

const email = env.FIREBASE_CLIENT_EMAIL;
if (!email || !email.includes('@') || email.startsWith('=')) {
  console.error('❌ FIREBASE_CLIENT_EMAIL malformato (controlla virgolette iniziali/finali)');
  process.exit(1);
}

if (!env.FIREBASE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY')) {
  console.error('❌ FIREBASE_PRIVATE_KEY mancante o non valida');
  process.exit(1);
}

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: email,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  projectId: env.FIREBASE_PROJECT_ID,
});

const dbId = env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;
const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

let ok = true;

try {
  await admin.auth(app).listUsers(1);
  console.log('✅ Firebase Auth Admin: OK');
} catch (e) {
  ok = false;
  console.error('❌ Firebase Auth Admin:', e.message);
  console.error('   → Google Cloud IAM: aggiungi ruolo "Firebase Authentication Admin" al service account');
}

try {
  await db.collection('_healthcheck').doc('ping').set({ at: new Date().toISOString() }, { merge: true });
  console.log('✅ Firestore write:', dbId || '(default)');
} catch (e) {
  ok = false;
  console.error('❌ Firestore:', e.message);
  console.error('   → Google Cloud IAM: aggiungi "Cloud Datastore User" al service account');
  console.error('   → https://console.cloud.google.com/iam-admin/iam?project=' + env.FIREBASE_PROJECT_ID);
}

process.exit(ok ? 0 : 1);
