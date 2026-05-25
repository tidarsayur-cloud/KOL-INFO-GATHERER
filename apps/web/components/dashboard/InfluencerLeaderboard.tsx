'use client';

const MOCK_INFLUENCERS = [
  { id: '1', name: 'Awkarin', handle: '@awkarin', platform: 'TikTok', followers: 12500000, engagement: 8.2, tier: 'Mega', avatar: 'AW' },
  { id: '2', name: 'Ria Ricis', handle: '@riaricis', platform: 'YouTube', followers: 32000000, engagement: 5.4, tier: 'Mega', avatar: 'RR' },
  { id: '3', name: 'Rachel Vennya', handle: '@rachelvennya', platform: 'Instagram', followers: 8700000, engagement: 6.1, tier: 'Mega', avatar: 'RV' },
  { id: '4', name: 'Deddy Corbuzier', handle: '@deddycorbuzier', platform: 'YouTube', followers: 20000000, engagement: 4.8, tier: 'Mega', avatar: 'DC' },
  { id: '5', name: 'Raditya Dika', handle: '@radityadika', platform: 'TikTok', followers: 15000000, engagement: 7.3, tier: 'Mega', avatar: 'RD' },
  { id: '6', name: 'Awkarin2', handle: '@beutycreator', platform: 'Instagram', followers: 4200000, engagement: 9.1, tier: 'Macro', avatar: 'BC' },
  { id: '7', name: 'TechID', handle: '@techid', platform: 'YouTube', followers: 2800000, engagement: 5.9, tier: 'Macro', avatar: 'TI' },
  { id: '8', name: 'FoodieJKT', handle: '@foodiejkt', platform: 'TikTok', followers: 1600000, engagement: 11.2, tier: 'Macro', avatar: 'FJ' },
];

const platformColors: Record<string, string> = {
  TikTok: 'bg-black text-white',
  Instagram: 'bg-pink-600 text-white',
  YouTube: 'bg-red-600 text-white',
};

export function InfluencerLeaderboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Top Influencers</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_INFLUENCERS.map((inf) => (
          <div key={inf.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-700 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {inf.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{inf.name}</p>
                <p className="text-gray-500 text-xs truncate">{inf.handle}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${platformColors[inf.platform] || 'bg-gray-700 text-gray-300'}`}>
              {inf.platform}
            </span>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Followers</span>
                <span className="text-white font-medium">{(inf.followers / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Engagement</span>
                <span className="text-green-400 font-medium">{inf.engagement}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
