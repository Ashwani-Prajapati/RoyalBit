// Supabase & Cloud Storage Integration Service
import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

let supabaseClient = null;

export const initSupabase = (url, anonKey) => {
  if (!url || !anonKey) {
    supabaseClient = null;
    return null;
  }
  try {
    supabaseClient = createClient(url, anonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabaseClient = null;
    return null;
  }
};

// Check if Supabase client is initialized from stored configuration or env variables
export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const storedConfig = storage.getSupabaseConfig();

  const url = storedConfig.url || envUrl;
  const key = storedConfig.anonKey || envKey;

  if (url && key) {
    return initSupabase(url, key);
  }

  return null;
};

// Test connection
export const testSupabaseConnection = async (url, anonKey) => {
  try {
    const tempClient = createClient(url, anonKey);
    const { error } = await tempClient.from('users').select('count', { count: 'exact', head: true });
    // If table doesn't exist yet, it's still a valid connected API key
    if (error && error.code !== '42P01' && !error.message.includes('relation "public.users" does not exist')) {
      throw error;
    }
    return { success: true, message: 'Successfully connected to Supabase backend!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
};

// SQL Schema script for developers setting up Supabase
export const SUPABASE_SQL_SCHEMA = `-- ROYALBIT Supabase Schema
-- Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  member_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  wallet_balance NUMERIC DEFAULT 0.00,
  total_investment NUMERIC DEFAULT 0.00,
  total_earnings NUMERIC DEFAULT 0.00,
  total_withdrawn NUMERIC DEFAULT 0.00,
  sponsor_id TEXT,
  kyc_status TEXT DEFAULT 'UNVERIFIED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Investment Packages Table ($5 base multiples, 2% daily ROI, 80 days)
CREATE TABLE IF NOT EXISTS public.investment_packages (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  package_amount NUMERIC NOT NULL,
  units INTEGER NOT NULL,
  daily_roi_percent NUMERIC DEFAULT 0.02,
  daily_roi_amount NUMERIC NOT NULL,
  days_total INTEGER DEFAULT 80,
  days_elapsed INTEGER DEFAULT 0,
  total_roi_earned NUMERIC DEFAULT 0.00,
  max_return NUMERIC NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Transactions Table (Isolated per user, 15-level income, 5% fee)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  fee NUMERIC DEFAULT 0.00,
  net_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'COMPLETED',
  level INTEGER,
  from_member_id TEXT,
  tx_hash TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

