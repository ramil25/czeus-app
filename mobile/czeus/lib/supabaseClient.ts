import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get environment variables from Expo's public environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Enhanced client with authentication support
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      // Enable session persistence for mobile
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
  }
);

// Authentication functions using real Supabase
export const supabaseAuth = {
  // Real login function
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    // Fetch user profile data from profiles table
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', data.user.email)
        .single();
      
      if (profileError) {
        console.warn('Could not fetch user profile:', profileError);
        // Return user without profile data
        return {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            first_name: '',
            last_name: '',
            role: 'user',
            created_at: data.user.created_at || new Date().toISOString(),
          },
          error: null
        };
      }
      
      return {
        user: {
          id: data.user.id,
          email: profile.email,
          first_name: profile.first_name,
          middle_name: profile.middle_name,
          last_name: profile.last_name,
          birth_day: profile.birth_day,
          profile_picture: profile.profile_picture,
          role: profile.role,
          phone: profile.phone,
          position: profile.position,
          address: profile.address,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
        error: null
      };
    }
    
    return { user: null, error: new Error('No user data returned') };
  },

  // Real signup function
  signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    // Create profile entry if user was created
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            email: data.user.email,
            first_name: firstName || 'New',
            last_name: lastName || 'User',
            role: 'user',
          }
        ]);
      
      if (profileError) {
        console.warn('Could not create user profile:', profileError);
      }
      
      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          first_name: firstName || 'New',
          last_name: lastName || 'User',
          role: 'user',
          created_at: data.user.created_at || new Date().toISOString(),
        },
        error: null
      };
    }
    
    return { user: null, error: new Error('No user data returned') };
  },

  // Real signout function
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  // Real reset password function
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }
  },

  // Real get session function
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { user: null, error };
      }
      
      if (session?.user) {
        // Fetch user profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (profileError) {
          console.warn('Could not fetch user profile:', profileError);
          // Return user without profile data
          return {
            user: {
              id: session.user.id,
              email: session.user.email || '',
              first_name: '',
              last_name: '',
              role: 'user',
              created_at: session.user.created_at || new Date().toISOString(),
            },
            error: null
          };
        }
        
        return {
          user: {
            id: session.user.id,
            email: profile.email,
            first_name: profile.first_name,
            middle_name: profile.middle_name,
            last_name: profile.last_name,
            birth_day: profile.birth_day,
            profile_picture: profile.profile_picture,
            role: profile.role,
            phone: profile.phone,
            position: profile.position,
            address: profile.address,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          },
          error: null
        };
      }
      
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
};