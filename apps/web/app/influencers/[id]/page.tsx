import { TierBadge } from '@/components/dashboard/TierBadge';
import { EngagementChart } from '@/components/charts/EngagementChart';
import { GrowthChart } from '@/components/charts/GrowthChart';

const MOCK_INFLUENCERS = [
  { id: '1', name: 'Awkarin', handle: '@awkarin', platform: 'TikTok', followers: 12500000, engagement: 8.2, tier: 'mega', niche: 'Lifestyle', bio: 'Content creator & entrepreneur from Indonesia.' },
  { id: '2', name: 'Ria Ricis', handle: '@riaricis', platform: 'YouTube', followers: 32000000, engagement: 5.4, tier: 'mega', niche: 'Entertainment', bio: 'Top YouTube creator in Indonesia.' },
  { id: '3', name: 'Rachel Vennya', handle: '@rachelvennya', platform: 'Instagram', followers: 8700000, engagement: 6.1, tier: 'mega', niche: 'Fashion', bio: 'Fashion influencer & entrepreneur.' },
  { id: '4', name: 'Deddy Corbuzier', handle: '@deddycorbuzier', platform: 'YouTube', followers: 20000000, engagement: 4.8, tier: 'mega', niche: 'Talk Show', bio: 'Podcast & YouTube creator.' },
  { id: '5', name: 'Raditya Dika', handle: '@radityadika', platform: 'TikTok', followers: 15000000, engagement: 7.3, tier: 'mega', niche: 'Comedy', bio: 'Comedian, author, and filmmaker.' },
];

export async function generateStaticParams() {
  return MOCK_INFLUENCERS.map((inf) => ({ id: inf.id }));
}

export default function InfluencerDetailPage({ params }: { params: { id: string } }) {
  const influencer = MOCK_INFLUENCERS.find((i) => i.id === params.id) || MOCK_INFLUENCERS[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
          {influencer.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{influencer.name}</h1>
          <p className="text-gray-400">{influencer.handle} &middot; {influencer.platform}</p>
          <TierBadge tier={influencer.tier} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-500 text-sm">Followers</p>
          <p className="text-white text-xl font-bold">{(influencer.followers / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-500 text-sm">Engagement</p>
          <p className="text-green-400 text-xl font-bold">{influencer.engagement}%</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-500 text-sm">Niche</p>
          <p className="text-white text-xl font-bold">{influencer.niche}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h2 className="text-white font-semibold mb-2">About</h2>
        <p className="text-gray-400">{influencer.bio}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart influencerId={influencer.id} />
        <GrowthChart influencerId={influencer.id} />
      </div>
    </div>
  );
}
