const STORAGE_KEY = 'pintarnya_auth';

export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1';
}

export async function verifyPassword(password: string): Promise<boolean> {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.ok) {
    const data = await res.json();
    if (data.valid) {
      localStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
  }
  return false;
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}
