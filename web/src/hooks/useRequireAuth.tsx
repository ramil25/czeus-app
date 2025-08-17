import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we're in demo mode (when Supabase is not accessible)
        const { error: testError } = await supabase.from('products').select('id').limit(1);
        
        // If Supabase is not accessible (demo mode), skip authentication
        if (testError) {
          console.log('Demo mode detected - skipping authentication');
          return;
        }
        
        // If Supabase is accessible, check for valid session
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace('/'); // Redirect to login page
        }
      } catch (error) {
        // If any error occurs (including network issues), assume demo mode
        console.log('Demo mode detected due to error - skipping authentication');
        return;
      }
    };
    checkSession();
  }, [router]);
}
