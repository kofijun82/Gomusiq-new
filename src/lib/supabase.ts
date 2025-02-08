import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In development, if env vars are missing, use mock data instead of throwing error
const isMockMode = !supabaseUrl || !supabaseKey;

export const supabase = isMockMode 
  ? null 
  : createClient<Database>(supabaseUrl, supabaseKey);

// Helper to check if we're in mock mode
export const isMockDatabase = () => isMockMode;