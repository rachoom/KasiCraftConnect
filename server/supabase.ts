import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Replit Secrets.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseProjectRef = supabaseUrl.replace('https://', '').split('.')[0];
const databaseUrl = `postgresql://postgres.${supabaseProjectRef}:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

export const pgPool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});
