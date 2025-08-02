'use client';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-black">{children}</main>
      </div>
    </>
  );
}
