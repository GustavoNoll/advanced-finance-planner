import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wyjmgvqmnnynwtmpxgvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5am1ndnFtbm55bnd0bXB4Z3Z6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODc3MDM2NCwiZXhwIjoyMDU0MzQ2MzY0fQ.ZeZ4NNJGpj5gagI1D7jcnIXe8iIV2oC8_5XuiB0qDzU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);