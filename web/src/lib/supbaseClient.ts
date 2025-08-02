import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrzljtoctzpvrkbckthr.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyemxqdG9jdHpwdnJrYmNrdGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjc3MzksImV4cCI6MjA2OTcwMzczOX0.PWkiEi2Q18-11AXIO_hcKCAZR3JPQkp-fEEvrAzUbKY';

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
