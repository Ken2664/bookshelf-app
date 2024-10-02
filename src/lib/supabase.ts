import { createClient } from '@supabase/supabase-js';
import { Database } from '../types'; // データベース型定義をインポート

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

let supabase: ReturnType<typeof createClient<Database>>;

if (typeof window !== 'undefined') {
  // クライアントサイドの初期化
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // サーバーサイドの初期化
  if (!(global as any).supabase) {
    (global as any).supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  supabase = (global as any).supabase;
}

export { supabase };

// 型チェックのためのヘルパー関数
export function getSupabase(): ReturnType<typeof createClient<Database>> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  return supabase;
}