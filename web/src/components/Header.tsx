'use client';
import { supabase } from '@/lib/supbaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-none shadow-none">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={140} height={140} />
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
