import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create a real client if we have valid credentials
let supabase: any = null;

if (supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && 
    supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
    supabase = null;
  }
} else {
  console.warn('Supabase credentials not configured, using mock data');
}

export { supabase };
