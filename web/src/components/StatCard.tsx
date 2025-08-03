'use client';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-xl shadow p-6 min-w-[220px]`}
    >
      <div className={`text-3xl`} style={{ color: color || '#2563eb' }}>
        {icon}
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-700">{title}</div>
        <div className="text-2xl font-bold text-blue-700">{value}</div>
      </div>
    </div>
  );
}
