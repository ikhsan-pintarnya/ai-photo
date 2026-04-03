import { SavedProject } from '../types';
import { getClientId } from './clientId';

const API_BASE = '/api';

export async function fetchProjects(): Promise<SavedProject[]> {
  const clientId = getClientId();
  const res = await fetch(`${API_BASE}/projects?clientId=${clientId}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function saveProject(
  project: Omit<SavedProject, 'id'>
): Promise<SavedProject> {
  const clientId = getClientId();
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...project, clientId }),
  });
  if (!res.ok) throw new Error('Failed to save project');
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const clientId = getClientId();
  const res = await fetch(`${API_BASE}/projects/${id}?clientId=${clientId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete project');
}
