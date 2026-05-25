'use client';
import { useState } from 'react';
import { TierBadge } from '@/components/dashboard/TierBadge';

const MOCK_INFLUENCERS = [
  { id: '1', name: 'Awkarin', handle: '@awkarin', platform: 'TikTok', followers: 12500000, engagement: 8.2, tier: 'mega', niche: 'Lifestyle' },
  { id: '2', name: 'Ria Ricis', handle: '@riaricis', platform: 'YouTube', followers: 32000000, engagement: 5.4, tier: 'mega', niche: 'Entertainment' },
  { id: '3', name: 'Rachel Vennya', handle: '@rachelvennya', platform: 'Instagram', followers: 8700000, engagement: 6.1, tier: 'mega', niche: 'Fashion' },
  { id: '4', name: 'Deddy Corbuzier', handle: '@deddycorbuzier', platform: 'YouTube', followers: 20000000, engagement: 4.8, tier: 'mega', niche: 'Talk Show' },
  { id: '5', name: 'Raditya Dika', handle: '@radityadika', platform: 'TikTok', followers: 15000000, engagement: 7.3, tier: 'mega', niche: 'Comedy' },
  { id: '6', name: 'BeautyCreator', handle: '@beutycreator', platform: 'Instagram', followers: 4200000, engagement: 9.1, tier: 'macro', niche: 'Beauty' },
  { id: '7', name: 'TechID', handle: '@techid', platform: 'YouTube', followers: 2800000, engagement: 5.9, tier: 'macro', niche: 'Tech' },
  { id: '8', name: 'FoodieJKT', handle: '@foodiejkt', platform: 'TikTok', followers: 1600000, engagement: 11.2, tier: 'macro', niche: 'Food' },
];

const METRICS = [
  { key: 'followers', label: 'Followers', fmt: (v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K` },
  { key: 'engagement', label: 'Engagement Rate', fmt: (v: number) => `${v.toFixed(2)}%` },
];

export default function ComparePage() {
  const [selected, setSelected] = useState<typeof MOCK_INFLUENCERS>([]);
  const [search, setSearch] = useState('');

  const results = MOCK_INFLUENCERS.filter(inf =>
    inf.name.toLowerCase().includes(search.toLowerCase()) ||
    inf.handle.toLowerCase().includes(search.toLowerCase())
  );

  const addToCompare = (inf: typeof MOCK_INFLUENCERS[0]) => {
    if (selected.length >= 3 || selected.find(s => s.id === inf.id)) return;
    setSelected([...selected, inf]);
    setSearch('');
  };

  const remove = (id: string) => setSelected(selected.filter(s => s.id !== id));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Compare Influencers</h1>
        <p className="text-gray-400 mt-1">Select up to 3 influencers to compare side-by-side.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search influencers to compare..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
        />
        {search && (
          <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-xl mt-1 z-10 overflow-hidden">
            {results.slice(0, 5).map(inf => (
              <button
                key={inf.id}
                onClick={() => addToCompare(inf)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {inf.name[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{inf.name}</p>
                  <p className="text-gray-500 text-xs">{inf.handle} &middot; {inf.platform}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected + comparison */}
      {selected.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-gray-500 pb-3 pr-4">Metric</th>
                {selected.map(inf => (
                  <th key={inf.id} className="text-left pb-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {inf.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{inf.name}</p>
                        <p className="text-gray-500">{inf.platform}</p>
                      </div>
                      <button onClick={() => remove(inf.id)} className="ml-2 text-gray-600 hover:text-red-400 text-xs">×</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {METRICS.map(metric => (
                <tr key={metric.key}>
                  <td className="py-3 pr-4 text-gray-500">{metric.label}</td>
                  {selected.map(inf => (
                    <td key={inf.id} className="py-3 pr-4 text-white font-medium">
                      {metric.fmt((inf as any)[metric.key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-4 text-gray-500">Tier</td>
                {selected.map(inf => (
                  <td key={inf.id} className="py-3 pr-4">
                    <TierBadge tier={inf.tier} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Search for influencers above to start comparing</p>
        </div>
      )}
    </div>
  );
}
