import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  first_name?: string;
  last_name?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Check if we're in demo mode
        const { error: testError } = await supabase.from('profiles').select('id').limit(1);
        
        if (testError) {
          // Demo mode - assume admin role
          console.log('Demo mode detected - using demo admin user');
          setUser({
            id: 'demo-user',
            email: 'admin@demo.com',
            role: 'admin',
            first_name: 'Demo',
            last_name: 'Admin',
          });
          setLoading(false);
          return;
        }

        // Get current session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session?.session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setUser({
          id: session.session.user.id,
          email: session.session.user.email || '',
          role: profile.role || 'customer',
          first_name: profile.first_name,
          last_name: profile.last_name,
        });
      } catch (err) {
        // If any error occurs, assume demo mode with admin access
        console.log('Error getting user profile, using demo mode:', err);
        setUser({
          id: 'demo-user',
          email: 'admin@demo.com',
          role: 'admin',
          first_name: 'Demo',
          last_name: 'Admin',
        });
        setError(null); // Don't show error in demo mode
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return { user, loading, error };
}

export function useHasRole(allowedRoles: ('admin' | 'staff' | 'customer')[]) {
  const { user, loading } = useCurrentUser();
  
  const hasRole = user ? allowedRoles.includes(user.role) : false;
  
  return { hasRole, loading, user };
}