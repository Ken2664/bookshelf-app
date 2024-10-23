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

  return getFavoriteAuthors(supabase, session.user.id);
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  return createFavoriteAuthor(body, supabase, session.user.id);
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  return deleteFavoriteAuthor(body, supabase, session.user.id);
}

const getFavoriteAuthors = async (supabase: SupabaseClient, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('favorite_authors')
      .select('*')
      .eq('user_id', userId)
      .order('author_name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching favorite authors:', error);
    return NextResponse.json({ error: 'An error occurred while fetching favorite authors' }, { status: 500 });
  }
};

const createFavoriteAuthor = async (body: { author_name: string }, supabase: SupabaseClient, userId: string) => {
  const { author_name } = body;

  if (!author_name) {
    return NextResponse.json({ error: 'Missing author_name' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('favorite_authors')
      .insert([{ user_id: userId, author_name }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating favorite author:', error);
    return NextResponse.json({ error: 'An error occurred while creating favorite author' }, { status: 500 });
  }
};

const deleteFavoriteAuthor = async (body: { id: number }, supabase: SupabaseClient, userId: string) => {
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('favorite_authors')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    if (data === null) {
      return NextResponse.json({ error: 'Favorite author not found or you do not have permission to delete it' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting favorite author:', error);
    return NextResponse.json({ error: 'An error occurred while deleting favorite author' }, { status: 500 });
  }
};
