import { getClientId } from './clientId';

const API_BASE = '/api';

export async function getUsageCount(): Promise<number> {
  const clientId = getClientId();
  const res = await fetch(`${API_BASE}/usage?clientId=${clientId}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count ?? 0;
}

export async function incrementUsage(): Promise<number> {
  const clientId = getClientId();
  const res = await fetch(`${API_BASE}/usage/increment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  });
  if (!res.ok) throw new Error('Failed to increment usage');
  const data = await res.json();
  return data.count;
}
