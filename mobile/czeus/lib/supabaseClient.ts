import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For now, using placeholder values. In a real app, these would come from environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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

// Demo authentication functions for development
export const demoAuth = {
  // Demo login function that simulates authentication
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo validation
    if (email === 'demo@czeus.com' && password === 'demo123') {
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@czeus.com',
        full_name: 'Demo User',
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      
      // Store demo session
      await AsyncStorage.setItem('demo_session', JSON.stringify(demoUser));
      return { user: demoUser, error: null };
    }
    
    throw new Error('Invalid email or password');
  },

  // Demo signup function
  signUp: async (email: string, password: string, fullName?: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoUser = {
      id: `demo-${Date.now()}`,
      email,
      full_name: fullName || 'New User',
      avatar_url: null,
      created_at: new Date().toISOString(),
    };
    
    // Store demo session
    await AsyncStorage.setItem('demo_session', JSON.stringify(demoUser));
    return { user: demoUser, error: null };
  },

  // Demo signout function
  signOut: async () => {
    await AsyncStorage.removeItem('demo_session');
  },

  // Demo reset password function
  resetPassword: async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In demo, always succeeds
  },

  // Demo get session function
  getSession: async () => {
    try {
      const sessionData = await AsyncStorage.getItem('demo_session');
      if (sessionData) {
        const user = JSON.parse(sessionData);
        return { user, error: null };
      }
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
};

// Note: In a production app, you would:
// 1. Set up proper environment variables
// 2. Configure Supabase properly with real credentials
// 3. Remove demo functions and use actual Supabase auth
// 4. This is for demo/development purposes