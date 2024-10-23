import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types';

// Supabaseクライアントの型を定義
type SupabaseClient = ReturnType<typeof createRouteHandlerClient<Database>>;

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return getFavoriteBooks(supabase, session.user.id);
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  return createFavoriteBook(body, supabase, session.user.id);
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  return deleteFavoriteBook(body, supabase, session.user.id);
}

// getFavoriteBooks, createFavoriteBook, deleteFavoriteBook 関数の実装...

async function getFavoriteBooks(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('favorite_books')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// createFavoriteBook と deleteFavoriteBook 関数も同様に実装してください

async function createFavoriteBook(body: { book_id: string }, supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('favorite_books')
    .insert({ user_id: userId, book_id: body.book_id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// deleteFavoriteBook 関数も同様に実装してください

async function deleteFavoriteBook(body: { book_id: string }, supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from('favorite_books')
    .delete()
    .eq('user_id', userId)
    .eq('book_id', body.book_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
