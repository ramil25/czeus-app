'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLogout } from '@/hooks/useLogout';
import toast from 'react-hot-toast';

export function Header() {
  const router = useRouter();

  const { mutate, isPending } = useLogout();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.replace('/');
      },
      onError: () => {
        toast.error('Failed to log out', { position: 'top-center' });
      },
    });
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-none shadow-none">
      <div className="flex items-center ml-10 sm:ml-0">
        <Image src="/logo.svg" alt="Logo" width={140} height={140} />
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
        disabled={isPending}
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    </header>
  );
}
