import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || '';
  const author = url.searchParams.get('author') || '';

  const user = supabase.auth.user();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = supabase
    .from<Book>('books')
    .select('*')
    .eq('user_id', user.id);

  if (title) {
    query = query.ilike('title', `%${title}%`);
  }

  if (author) {
    query = query.ilike('author', `%${author}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}