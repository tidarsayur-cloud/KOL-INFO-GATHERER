'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Star, Activity } from 'lucide-react';

const DEFAULT_STATS = {
  totalInfluencers: 1284,
  avgEngagement: 6.8,
  topTierCount: 47,
  syncedToday: 312,
};

interface DashboardStatsProps {
  stats?: {
    totalInfluencers: number;
    avgEngagement: number;
    topTierCount: number;
    syncedToday: number;
  };
}

export function DashboardStats({ stats = DEFAULT_STATS }: DashboardStatsProps) {
  const items = [
    {
      label: 'Total Influencers',
      value: stats.totalInfluencers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-700',
      change: '+12%',
    },
    {
      label: 'Avg Engagement',
      value: `${stats.avgEngagement.toFixed(2)}%`,
      icon: Activity,
      color: 'from-pink-500 to-rose-700',
      change: '+0.3%',
    },
    {
      label: 'Top Tier KOLs',
      value: stats.topTierCount.toLocaleString(),
      icon: Star,
      color: 'from-yellow-500 to-orange-600',
      change: '+5',
    },
    {
      label: 'Synced Today',
      value: stats.syncedToday.toLocaleString(),
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-700',
      change: 'Live',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-green-400 font-medium">{item.change}</span>
          </div>
          <p className="text-2xl font-bold text-white">{item.value}</p>
          <p className="text-gray-500 text-sm mt-1">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
