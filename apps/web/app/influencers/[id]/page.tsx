'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, TrendingUp, Heart, Play, ExternalLink } from 'lucide-react';
import { EngagementChart } from '@/components/charts/EngagementChart';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { SocialEmbed } from '@/components/embeds/SocialEmbed';
import { TierBadge } from '@/components/dashboard/TierBadge';
import { fetchInfluencer } from '@/lib/api';
import type { Influencer } from '@/types';

export default function InfluencerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'posts'>('overview');

  useEffect(() => {
    if (params.id) {
      fetchInfluencer(params.id as string)
        .then(setInfluencer)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Influencer Not Found</h2>
          <button onClick={() => router.back()} className="btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Followers', value: influencer.followers_count?.toLocaleString(), icon: Users, color: 'text-blue-400' },
    { label: 'Avg Views', value: influencer.avg_views?.toLocaleString(), icon: Play, color: 'text-green-400' },
    { label: 'Engagement', value: `${influencer.engagement_rate?.toFixed(2)}%`, icon: Heart, color: 'text-pink-400' },
    { label: 'Growth', value: `+${influencer.growth_rate?.toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="relative h-64 bg-gradient-to-br from-purple-900/50 to-blue-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
        <div className="absolute top-6 left-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors glass px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-6 mb-8"
        >
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-gray-950">
            {influencer.username?.[0]?.toUpperCase()}
          </div>
          <div className="pb-2">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{influencer.display_name || influencer.username}</h1>
              <TierBadge tier={influencer.tier} />
            </div>
            <p className="text-gray-400">@{influencer.username} · {influencer.platform}</p>
            {influencer.niche && (
              <span className="mt-2 inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {influencer.niche}
              </span>
            )}
          </div>
          {influencer.profile_url && (
            <a
              href={influencer.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 glass px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Profile
            </a>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value ?? '—'}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1 w-fit">
          {(['overview', 'analytics', 'posts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-12"
        >
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Engagement Rate</h3>
                <EngagementChart influencerId={influencer.id} />
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Follower Growth</h3>
                <GrowthChart influencerId={influencer.id} />
              </div>
              {influencer.bio && (
                <div className="glass rounded-xl p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-gray-400">{influencer.bio}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Analytics</h3>
                <GrowthChart influencerId={influencer.id} />
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Posts</h3>
              {influencer.embed_url ? (
                <SocialEmbed url={influencer.embed_url} platform={influencer.platform} />
              ) : (
                <p className="text-gray-400">No embedded content available.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
