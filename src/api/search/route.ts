import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const title = url.searchParams.get('title') || '';
  const author = url.searchParams.get('author') || '';

  let query = supabase
    .from('books')
    .select('*')
    .eq('user_id', session.user.id);

  if (title) {
    query = query.ilike('title', `%${title}%`);
  }

  if (author) {
    query = query.ilike('author', `%${author}%`);
  }

  try {
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching books:', error);
      return NextResponse.json({ error: 'An error occurred while fetching books' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}