'use client';
import { useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { TrendCard } from '@/components/TrendCard';
import { FaUsers } from 'react-icons/fa';
import { MdInventory, MdLeaderboard } from 'react-icons/md';
import { SimpleLineGraph } from '@/components/SimpleLineGraph';

export default function DashboardPage() {
  // Filter state
  const [range, setRange] = useState<'week' | 'month' | 'year'>('month');

  // Dummy data for different ranges
  const ranges = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      inventory: [70, 72, 71, 73, 74, 75, 76],
      sales: [5, 8, 6, 7, 9, 10, 12],
      users: 120,
      inventoryCount: 76,
      highestPoints: 9500,
      trends: {
        users: 2.5,
        inventory: 1.3,
        points: 0.8,
      },
    },
    month: {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      inventory: [50, 52, 48, 55, 60, 62, 58, 65, 70, 68, 72, 75],
      sales: [10, 15, 12, 18, 20, 22, 19, 25, 28, 26, 30, 32],
      users: 128,
      inventoryCount: 75,
      highestPoints: 9999,
      trends: {
        users: 5.2,
        inventory: 3.7,
        points: 2.1,
      },
    },
    year: {
      labels: ['2022', '2023', '2024', '2025'],
      inventory: [600, 650, 700, 750],
      sales: [120, 150, 180, 200],
      users: 200,
      inventoryCount: 750,
      highestPoints: 12000,
      trends: {
        users: 12.8,
        inventory: 8.5,
        points: 4.3,
      },
    },
  };

  const current = ranges[range];

  return (
    <div className="p-3 sm:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 sm:mb-8">Dashboard</h1>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
        <span className="font-semibold text-gray-700">Data Range:</span>
        <div className="flex gap-2 flex-wrap">
          <button className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border ${range === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setRange('week')}>Weekly</button>
          <button className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border ${range === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setRange('month')}>Monthly</button>
          <button className={`px-3 sm:px-4 py-2 rounded-lg font-semibold border ${range === 'year' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setRange('year')}>Annually</button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 flex-wrap mb-6 sm:mb-10">
        <StatCard title="Number of Users" value={current.users} icon={<FaUsers />} color="#2563eb" />
        <StatCard title="Number of Items on Inventory" value={current.inventoryCount} icon={<MdInventory />} color="#059669" />
        <StatCard title="Highest Points Earned" value={current.highestPoints} icon={<MdLeaderboard />} color="#f59e42" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 flex-wrap mb-6 sm:mb-10">
        <TrendCard title="Users Trend" value={current.users} trend={current.trends.users} />
        <TrendCard title="Inventory Trend" value={current.inventoryCount} trend={current.trends.inventory} />
        <TrendCard title="Points Trend" value={current.highestPoints} trend={current.trends.points} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 flex-wrap">
        <SimpleLineGraph title="Inventory" labels={current.labels} data={current.inventory} color="#059669" />
        <SimpleLineGraph title="Sales" labels={current.labels} data={current.sales} color="#2563eb" />
      </div>
    </div>
  );
}
