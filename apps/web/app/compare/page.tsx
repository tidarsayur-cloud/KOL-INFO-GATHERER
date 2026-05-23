'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, BarChart2 } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { TierBadge } from '@/components/dashboard/TierBadge';
import { fetchInfluencers } from '@/lib/api';
import type { Influencer } from '@/types';

export default function ComparePage() {
  const [selected, setSelected] = useState<Influencer[]>([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Influencer[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const data = await fetchInfluencers({ search: q, limit: 5 });
      setResults(data.influencers || []);
    } finally {
      setSearching(false);
    }
  };

  const addToCompare = (inf: Influencer) => {
    if (selected.length >= 3 || selected.find((s) => s.id === inf.id)) return;
    setSelected([...selected, inf]);
    setSearch('');
    setResults([]);
  };

  const removeFromCompare = (id: string) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const METRICS = [
    { key: 'followers_count', label: 'Followers', fmt: (v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K` },
    { key: 'engagement_rate', label: 'Engagement Rate', fmt: (v: number) => `${v.toFixed(2)}%` },
    { key: 'avg_views', label: 'Avg Views', fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v.toString() },
    { key: 'growth_rate', label: 'Growth Rate', fmt: (v: number) => `+${v.toFixed(1)}%` },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Compare Influencers</h1>
          </div>
          <p className="text-gray-400">Select up to 3 influencers to compare side by side</p>
        </motion.div>

        {/* Search */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="relative max-w-md">
            <SearchBar value={search} onChange={handleSearch} placeholder="Search to add influencer..." />
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl overflow-hidden z-10">
                {results.map((inf) => (
                  <button
                    key={inf.id}
                    onClick={() => addToCompare(inf)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-sm font-bold text-white">
                      {inf.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{inf.display_name || inf.username}</div>
                      <div className="text-xs text-gray-400">{inf.platform}</div>
                    </div>
                    <TierBadge tier={inf.tier} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Grid */}
        {selected.length > 0 && (
          <div className="glass rounded-2xl overflow-hidden">
            {/* Header Row */}
            <div className={`grid grid-cols-${selected.length + 1} border-b border-white/10`}>
              <div className="p-4 text-gray-400 text-sm font-medium">Metric</div>
              {selected.map((inf) => (
                <div key={inf.id} className="p-4 relative">
                  <button
                    onClick={() => removeFromCompare(inf.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="text-sm font-semibold text-white">{inf.display_name || inf.username}</div>
                  <div className="text-xs text-gray-400">{inf.platform}</div>
                  <TierBadge tier={inf.tier} size="sm" />
                </div>
              ))}
            </div>

            {/* Metric Rows */}
            {METRICS.map((metric) => (
              <div key={metric.key} className={`grid grid-cols-${selected.length + 1} border-b border-white/5 hover:bg-white/2 transition-colors`}>
                <div className="p-4 text-sm text-gray-400">{metric.label}</div>
                {selected.map((inf) => {
                  const val = (inf as any)[metric.key];
                  return (
                    <div key={inf.id} className="p-4 text-sm font-semibold text-white">
                      {val != null ? metric.fmt(val) : '-'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {selected.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Search and add influencers to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}
