import { createClient } from '@supabase/supabase-js';

// For now, using placeholder values. In a real app, these would come from environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Fallback client for development/demo purposes
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // Disable for demo
    }
  }
);

// Note: In a production app, you would:
// 1. Set up proper environment variables
// 2. Configure Supabase properly 
// 3. Handle authentication flows
// 4. This is just for demo/development purposes