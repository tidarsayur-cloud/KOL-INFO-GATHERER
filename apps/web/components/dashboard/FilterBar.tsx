'use client';
import { useState } from 'react';

export function FilterBar() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('followers');

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800">
      <input
        type="text"
        placeholder="Search influencers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
      />
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
      >
        <option value="all">All Platforms</option>
        <option value="tiktok">TikTok</option>
        <option value="instagram">Instagram</option>
        <option value="youtube">YouTube</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
      >
        <option value="followers">Sort by Followers</option>
        <option value="engagement">Sort by Engagement</option>
        <option value="growth">Sort by Growth</option>
      </select>
    </div>
  );
}
