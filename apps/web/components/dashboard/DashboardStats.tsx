'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Star, Activity } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalInfluencers: number;
    avgEngagement: number;
    topTierCount: number;
    syncedToday: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
          <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
            <div className="text-sm text-gray-400 mb-2">{item.label}</div>
            <div className="text-xs text-green-400 font-medium">{item.change} this week</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
