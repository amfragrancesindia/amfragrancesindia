'use client';

import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentOrders } from './RecentOrders';
import { TopProducts } from './TopProducts';
import { RevenueChart } from './RevenueChart';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-luxury-light">Dashboard</h1>
        <p className="text-luxury-muted mt-1">Welcome to your admin dashboard</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <TopProducts />
      </div>

      <RecentOrders />
    </div>
  );
}
