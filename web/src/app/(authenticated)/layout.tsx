'use client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Toaster } from 'react-hot-toast';
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();
  return (
    <>
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 w-full bg-gray-200">
          <Header />
        </div>
        <div className="flex w-full pt-20 min-h-screen">
          <Sidebar />

          <main className="flex-1 bg-gray-200">
            <Toaster />
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
