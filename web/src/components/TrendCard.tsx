"use client"
import React from 'react';

interface TrendCardProps {
  title: string;
  value: number | string;
  trend: number; // percent change
  color?: string;
}

export function TrendCard({ title, value, trend }: TrendCardProps) {
  const isPositive = trend >= 0;
  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-xl shadow p-6 min-w-[220px]`}
    >
      <div>
        <div className="text-lg font-semibold text-gray-700">{title}</div>
        <div className="text-2xl font-bold text-blue-700">{value}</div>
        <div
          className={`text-sm font-semibold mt-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? '+' : ''}
          {trend}% {isPositive ? '▲' : '▼'}
        </div>
      </div>
    </div>
  );
}
