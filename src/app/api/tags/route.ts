import { NextRequest, NextResponse } from 'next/server';
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

  return getTags(supabase, session.user.id);
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  return createTag(body, supabase, session.user.id);
}

const getTags = async (supabase: SupabaseClient, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'An error occurred while fetching tags' }, { status: 500 });
  }
};

const createTag = async (body: { name: string }, supabase: SupabaseClient, userId: string) => {
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: 'Missing tag name' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ user_id: userId, name }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'An error occurred while creating the tag' }, { status: 500 });
  }
};
