import { NextApiRequest, NextApiResponse } from 'next';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types';

// Supabaseクライアントの型を定義
type SupabaseClient = ReturnType<typeof createRouteHandlerClient<Database>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // セッションチェック
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getTags(req, res, supabase, session.user.id);
    case 'POST':
      return createTag(req, res, supabase, session.user.id);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getTags = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({ error: 'An error occurred while fetching tags' });
  }
};

const createTag = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing tag name' });
  }

  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ user_id: userId, name }])
      .select();

    if (error) throw error;

    return res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(500).json({ error: 'An error occurred while creating the tag' });
  }
};