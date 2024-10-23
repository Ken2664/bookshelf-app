import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types';

// Supabaseクライアントの型を定義
//type SupabaseClient = ReturnType<typeof createRouteHandlerClient<Database>>;

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 動的なサーバーレンダリングを使用
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('search_results')
      .select('*')
      .ilike('name', `%${query}%`);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'An error occurred while fetching search results' }, { status: 500 });
  }
}
