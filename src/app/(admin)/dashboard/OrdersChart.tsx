'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', orders: 24 },
  { name: 'Tue', orders: 18 },
  { name: 'Wed', orders: 32 },
  { name: 'Thu', orders: 28 },
  { name: 'Fri', orders: 38 },
  { name: 'Sat', orders: 52 },
  { name: 'Sun', orders: 45 },
];

export function OrdersChart() {
  return (
    <div className="bg-luxury-dark border border-white/5 rounded-lg p-6">
      <h3 className="font-serif text-xl text-luxury-light mb-6">Orders (Last 7 Days)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <Bar dataKey="orders" fill="#D4AF37" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
