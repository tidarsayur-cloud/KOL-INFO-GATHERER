'use client';
import { useState } from 'react';

const tiers = [
  { id: 'all', label: 'All Tiers', color: 'gray' },
  { id: 'mega', label: 'Mega (>1M)', color: 'purple' },
  { id: 'macro', label: 'Macro (100K-1M)', color: 'blue' },
  { id: 'mid', label: 'Mid (10K-100K)', color: 'green' },
  { id: 'micro', label: 'Micro (<10K)', color: 'yellow' },
];

export function TierSelector() {
  const [selected, setSelected] = useState('all');
  return (
    <div className="flex flex-wrap gap-2">
      {tiers.map((tier) => (
        <button
          key={tier.id}
          onClick={() => setSelected(tier.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === tier.id
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {tier.label}
        </button>
      ))}
    </div>
  );
}
