'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';

interface EngagementChartProps {
  influencerId?: string;
}

interface DataPoint {
  date: string;
  rate: number;
}

export function EngagementChart({ influencerId }: EngagementChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (influencerId) {
        try {
          const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/${influencerId}/analytics`);
          const json = await r.json();
          if (json.engagement_history) {
            setData(json.engagement_history);
            return;
          }
        } catch {}
      }
      // Fallback mock data
      const mock = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rate: parseFloat((Math.random() * 5 + 2).toFixed(2)),
      }));
      setData(mock);
    };
    fetchData();
  }, [influencerId]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-4">Engagement Rate (30 days)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} interval={6} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#9CA3AF' }}
            itemStyle={{ color: '#A855F7' }}
          />
          <Line type="monotone" dataKey="rate" stroke="#A855F7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
