import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbaseClient';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Allow access in development when Supabase is not configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        return; // Skip authentication check
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace('/'); // Redirect to login page
        }
      } catch (error) {
        console.warn('Authentication check failed, allowing access for development:', error);
        // Allow access when Supabase fails
      }
    };
    checkSession();
  }, [router]);
}
