import { Suspense } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { EngagementChart } from '@/components/charts/EngagementChart';
import { InfluencerLeaderboard } from '@/components/dashboard/InfluencerLeaderboard';
import { TrendingSection } from '@/components/dashboard/TrendingSection';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { TierSelector } from '@/components/dashboard/TierSelector';
import { SyncStatus } from '@/components/dashboard/SyncStatus';

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Influencer Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Real-time analytics powered by KaloData & KOL.ID</p>
        </div>
        <Suspense fallback={null}>
          <SyncStatus />
        </Suspense>
      </div>

      {/* Summary Stat Cards */}
      <Suspense fallback={<div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => (
        <div key={i} className="h-28 bg-gray-900 rounded-xl animate-pulse" />
      ))}</div>}>
        <DashboardStats />
      </Suspense>

      {/* Tier Filter */}
      <TierSelector />

      {/* Filter Bar */}
      <FilterBar />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="h-64 bg-gray-900 rounded-xl animate-pulse" />}>
          <EngagementChart />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-900 rounded-xl animate-pulse" />}>
          <TrendingSection />
        </Suspense>
      </div>

      {/* Leaderboard */}
      <Suspense fallback={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-72 bg-gray-900 rounded-xl animate-pulse" />
          ))}
        </div>
      }>
        <InfluencerLeaderboard />
      </Suspense>
    </div>
  );
}
