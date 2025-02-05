import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wyjmgvqmnnynwtmpxgvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5am1ndnFtbm55bnd0bXB4Z3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NzAzNjQsImV4cCI6MjA1NDM0NjM2NH0.1g7URqNj46kvAKZoqyd5Y4DR1T-Tk2fJwc3jaxpzVDg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);