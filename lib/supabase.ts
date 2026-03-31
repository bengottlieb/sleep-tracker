import { createClient } from '@supabase/supabase-js';

// Fallback placeholder values allow the build to complete without env vars set;
// all runtime API calls will fail gracefully until real credentials are provided.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
