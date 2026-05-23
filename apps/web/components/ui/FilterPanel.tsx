'use client';

import { Filter } from 'lucide-react';

const PLATFORMS = ['All', 'TikTok', 'Instagram', 'YouTube', 'Twitter'];
const TIERS = ['All', 'Mega', 'Macro', 'Micro', 'Nano'];
const SORT_OPTIONS = [
  { value: 'followers_count', label: 'Followers' },
  { value: 'engagement_rate', label: 'Engagement' },
  { value: 'avg_views', label: 'Avg Views' },
  { value: 'growth_rate', label: 'Growth Rate' },
];

interface FilterPanelProps {
  filters: {
    platform: string;
    tier: string;
    sortBy: string;
    order: 'asc' | 'desc';
  };
  onUpdate: (key: string, value: string) => void;
}

export function FilterPanel({ filters, onUpdate }: FilterPanelProps) {
  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
        <Filter className="w-4 h-4" />
        Filters
      </div>

      {/* Platform */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Platform</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => onUpdate('platform', p === 'All' ? '' : p.toLowerCase())}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                (p === 'All' && !filters.platform) || filters.platform === p.toLowerCase()
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tier */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Tier</label>
        <div className="flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => onUpdate('tier', t === 'All' ? '' : t.toLowerCase())}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                (t === 'All' && !filters.tier) || filters.tier === t.toLowerCase()
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Sort By</label>
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onUpdate('sortBy', e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => onUpdate('order', filters.order === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
          >
            {filters.order === 'desc' ? 'DESC' : 'ASC'}
          </button>
        </div>
      </div>
    </div>
  );
}
