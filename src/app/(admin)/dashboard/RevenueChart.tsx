'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 32 },
  { name: 'Thu', revenue: 4500, orders: 28 },
  { name: 'Fri', revenue: 6000, orders: 38 },
  { name: 'Sat', revenue: 8000, orders: 52 },
  { name: 'Sun', revenue: 7000, orders: 45 },
];

export function RevenueChart() {
  return (
    <div className="bg-luxury-dark border border-white/5 rounded-lg p-6">
      <h3 className="font-serif text-xl text-luxury-light mb-6">Revenue (Last 7 Days)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#A89F91" fontSize={12} />
            <YAxis stroke="#A89F91" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111111',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D4AF37"
              strokeWidth={2}
              dot={{ fill: '#D4AF37' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
