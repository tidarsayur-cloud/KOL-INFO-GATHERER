'use client';

const TRENDING = [
  { name: 'Ria Ricis', growth: '+18.2%', platform: 'YouTube', category: 'Entertainment' },
  { name: 'Awkarin', growth: '+14.7%', platform: 'TikTok', category: 'Lifestyle' },
  { name: 'Raditya Dika', growth: '+11.3%', platform: 'TikTok', category: 'Comedy' },
  { name: 'Rachel Vennya', growth: '+9.8%', platform: 'Instagram', category: 'Fashion' },
  { name: 'FoodieJKT', growth: '+8.5%', platform: 'TikTok', category: 'Food' },
];

export function TrendingSection() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-4">Trending This Week</h2>
      <div className="space-y-3">
        {TRENDING.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="text-gray-600 text-sm w-5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{item.name}</p>
              <p className="text-gray-500 text-xs">{item.platform} &middot; {item.category}</p>
            </div>
            <span className="text-green-400 text-sm font-semibold">{item.growth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
