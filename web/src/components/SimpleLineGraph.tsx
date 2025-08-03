'use client';
import React from 'react';

interface SimpleLineGraphProps {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
}

export function SimpleLineGraph({
  title,
  labels,
  data,
  color,
}: SimpleLineGraphProps) {
  // Render a simple SVG line graph (no external dependencies)
  // This is a minimal placeholder for demonstration
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 280},${140 - (v / max) * 120}`)
    .join(' ');

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-xl">
      <div className="text-lg font-bold mb-2 text-gray-700">{title}</div>
      <svg width={280} height={140}>
        <polyline
          fill="none"
          stroke={color || '#2563eb'}
          strokeWidth="3"
          points={points}
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 280}
            cy={140 - (v / max) * 120}
            r={4}
            fill={color || '#2563eb'}
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}
