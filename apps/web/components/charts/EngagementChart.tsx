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
  influencerId: string;
}

interface DataPoint {
  date: string;
  rate: number;
}

export function EngagementChart({ influencerId }: EngagementChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Fetch engagement history from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/influencers/${influencerId}/analytics`)
      .then((r) => r.json())
      .then((json) => {
        if (json.engagement_history) {
          setData(json.engagement_history);
        }
      })
      .catch(() => {
        // fallback mock data
        const mock = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rate: parseFloat((Math.random() * 5 + 2).toFixed(2)),
        }));
        setData(mock);
      });
  }, [influencerId]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          formatter={(value: number) => [`${value}%`, 'Engagement']}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#a855f7"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#a855f7' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
