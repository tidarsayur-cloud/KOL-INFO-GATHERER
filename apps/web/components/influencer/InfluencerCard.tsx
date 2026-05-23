'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, Heart, Play, TrendingUp } from 'lucide-react';
import { TierBadge } from '@/components/dashboard/TierBadge';
import type { Influencer } from '@/types';

interface InfluencerCardProps {
  influencer: Influencer;
  index?: number;
}

export function InfluencerCard({ influencer, index = 0 }: InfluencerCardProps) {
  const router = useRouter();

  const fmtNum = (n?: number | null) => {
    if (!n) return '-';
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/influencers/${influencer.id}`)}
      className="glass rounded-2xl p-5 cursor-pointer group transition-all hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white">
          {influencer.username?.[0]?.toUpperCase()}
        </div>
        <TierBadge tier={influencer.tier} size="sm" />
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
          {influencer.display_name || influencer.username}
        </h3>
        <p className="text-sm text-gray-400">@{influencer.username}</p>
        <p className="text-xs text-gray-500 mt-1">
          {influencer.platform}{influencer.niche ? ` - ${influencer.niche}` : ''}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Users, label: 'Followers', value: fmtNum(influencer.followers_count), color: 'text-white' },
          { icon: Heart, label: 'Engagement', value: influencer.engagement_rate ? `${influencer.engagement_rate.toFixed(1)}%` : '-', color: 'text-white' },
          { icon: Play, label: 'Avg Views', value: fmtNum(influencer.avg_views), color: 'text-white' },
          { icon: TrendingUp, label: 'Growth', value: influencer.growth_rate ? `+${influencer.growth_rate.toFixed(1)}%` : '-', color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
              <stat.icon className="w-3 h-3" />
              {stat.label}
            </div>
            <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
