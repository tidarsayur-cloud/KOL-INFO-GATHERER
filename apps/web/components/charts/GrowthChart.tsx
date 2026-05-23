'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';

interface GrowthChartProps {
  influencerId: string;
}

export function GrowthChart({ influencerId }: GrowthChartProps) {
  const [data, setData] = useState<{ date: string; followers: number }[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/${influencerId}/analytics`)
      .then((r) => r.json())
      .then((json) => {
        if (json.followers_history) setData(json.followers_history);
      })
      .catch(() => {
        let base = 50000;
        const mock = Array.from({ length: 30 }, (_, i) => {
          base += Math.floor(Math.random() * 500 - 100);
          return {
            date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            followers: base,
          };
        });
        setData(mock);
      });
  }, [influencerId]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          formatter={(value: number) => [value.toLocaleString(), 'Followers']}
        />
        <Area
          type="monotone"
          dataKey="followers"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#colorFollowers)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
