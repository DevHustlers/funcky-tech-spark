import { createClient } from '@supabase/supabase-js';

// Get these from your environment or .env file
// Vite uses import.meta.env for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uugqmtrorjripkwjphlq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z3FtdHJvcmpyaXBrd2pwaGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTk1NjYsImV4cCI6MjA4ODYzNTU2Nn0.XR1d-sudSxM7Xd97EW4q4PIvmfTvsUf1_9pQk7Jming';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
