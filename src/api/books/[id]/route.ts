import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = supabase.auth.user();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from<Book>('books')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}