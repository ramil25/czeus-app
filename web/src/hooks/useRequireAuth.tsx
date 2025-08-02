import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbaseClient';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/'); // Redirect to login page
      }
    };
    checkSession();
  }, [router]);
}
