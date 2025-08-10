'use client';
import { Header } from '@/components/Header';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import React from 'react';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  useRequireAuth();
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="fixed top-0 left-0 w-full z-10 bg-blue-50">
        <Header />
      </div>
      <main className="flex-1 flex flex-col px-0 pt-20">{/* pt-20 for header space */}
        {children}
      </main>
    </div>
  );
}
