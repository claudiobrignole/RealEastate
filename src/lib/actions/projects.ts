'use server';

import { adminDb } from '@/lib/firebase-admin';
import {
  getDocData,
  queryCollection,
  setDocData,
} from '@/lib/server-db';
import { getTenantId } from './auth';

export async function createProject(data: Record<string, unknown>) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error('Unauthorized');

    const ref = adminDb.collection('projects').doc();
    await ref.set({
      ...data,
      id: ref.id,
      tenantId,
      status: data.status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, id: ref.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateProject(projectId: string, data: Record<string, unknown>) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error('Unauthorized');

    const existing = await getDocData('projects', projectId);
    if (!existing || existing.tenantId !== tenantId) {
      return { success: false, error: 'Progetto non trovato' };
    }

    await setDocData('projects', projectId, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, true);

    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getProject(projectId: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Unauthorized' };

    const project = await getDocData('projects', projectId);
    if (!project || project.tenantId !== tenantId) {
      return { success: false, error: 'Progetto non trovato' };
    }
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getProjects() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: false, error: 'Unauthorized' };

    const projects = await queryCollection(
      'projects',
      [['tenantId', '==', tenantId]],
      'createdAt',
      'desc'
    );

    return { success: true, data: projects };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getPublicProject(slugOrId: string): Promise<Record<string, unknown> | null> {
  try {
    const bySlug = await queryCollection('projects', [['slug', '==', slugOrId]]);
    if (bySlug.length > 0) {
      return bySlug[0] as Record<string, unknown>;
    }
    const doc = await getDocData('projects', slugOrId);
    return doc as Record<string, unknown> | null;
  } catch {
    return null;
  }
}
