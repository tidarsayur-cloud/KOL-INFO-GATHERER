const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Influencers
export interface FetchInfluencersParams {
  search?: string;
  platform?: string;
  tier?: string;
  niche?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export function fetchInfluencers(params: FetchInfluencersParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') query.set(k, String(v));
  });
  return request<{ influencers: any[]; total: number }>(`/influencers?${query}`);
}

export function fetchInfluencer(id: string) {
  return request<any>(`/influencers/${id}`);
}

export function fetchInfluencerAnalytics(id: string) {
  return request<any>(`/influencers/${id}/analytics`);
}

// Dashboard stats
export function fetchDashboardStats() {
  return request<{
    totalInfluencers: number;
    avgEngagement: number;
    topTierCount: number;
    syncedToday: number;
  }>('/stats');
}

// Search
export function searchInfluencers(q: string) {
  return request<{ results: any[] }>(`/search?q=${encodeURIComponent(q)}`);
}

// Compare
export function compareInfluencers(ids: string[]) {
  return request<{ influencers: any[] }>('/compare', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

// Sync
export function triggerSync() {
  return request<{ message: string }>('/sync', { method: 'POST' });
}
