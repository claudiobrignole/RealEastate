import { adminDb } from '@/lib/firebase-admin';
import {
  FieldValue,
  Timestamp,
  type Query,
  type WhereFilterOp,
} from 'firebase-admin/firestore';

export { adminDb };

export function serverTimestamp() {
  return FieldValue.serverTimestamp();
}

export function normalizeTimestamp(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString();
  }
  if (typeof value === 'string') return value;
  return null;
}

export async function getDocData(
  collectionId: string,
  docId: string
): Promise<(Record<string, unknown> & { id: string }) | null> {
  const snap = await adminDb.collection(collectionId).doc(docId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as Record<string, unknown> & { id: string };
}

export async function setDocData(
  collectionId: string,
  docId: string,
  data: Record<string, unknown>,
  merge = false
) {
  await adminDb.collection(collectionId).doc(docId).set(data, { merge });
}

export async function addDocData(collectionId: string, data: Record<string, unknown>) {
  const ref = await adminDb.collection(collectionId).add(data);
  return ref.id;
}

export async function updateDocData(collectionId: string, docId: string, data: Record<string, unknown>) {
  await adminDb.collection(collectionId).doc(docId).update(data);
}

export async function deleteDocData(collectionId: string, docId: string) {
  await adminDb.collection(collectionId).doc(docId).delete();
}

export async function incrementField(
  collectionId: string,
  docId: string,
  field: string,
  delta: number
) {
  await adminDb.collection(collectionId).doc(docId).update({
    [field]: FieldValue.increment(delta),
  });
}

type WhereClause = [string, WhereFilterOp, unknown];

export async function queryCollection(
  collectionId: string,
  filters: WhereClause[] = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc'
) {
  let q: Query = adminDb.collection(collectionId);
  for (const [field, op, value] of filters) {
    q = q.where(field, op, value);
  }
  if (orderByField) {
    q = q.orderBy(orderByField, orderDirection);
  }
  const snap = await q.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown> & { id: string }));
}

export async function queryCollectionGroup(
  collectionId: string,
  filters: WhereClause[] = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc'
) {
  let q: Query = adminDb.collectionGroup(collectionId);
  for (const [field, op, value] of filters) {
    q = q.where(field, op, value);
  }
  if (orderByField) {
    q = q.orderBy(orderByField, orderDirection);
  }
  const snap = await q.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown> & { id: string }));
}
