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
      return getFavoriteAuthors(req, res, supabase, session.user.id);
    case 'POST':
      return createFavoriteAuthor(req, res, supabase, session.user.id);
    case 'DELETE':
      return deleteFavoriteAuthor(req, res, supabase, session.user.id);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getFavoriteAuthors = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('favorite_authors')
      .select('*')
      .eq('user_id', userId)
      .order('author_name', { ascending: true });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching favorite authors:', error);
    return res.status(500).json({ error: 'An error occurred while fetching favorite authors' });
  }
};

const createFavoriteAuthor = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { author_name } = req.body;

  if (!author_name) {
    return res.status(400).json({ error: 'Missing author_name' });
  }

  try {
    const { data, error } = await supabase
      .from('favorite_authors')
      .insert([{ user_id: userId, author_name }])
      .select();

    if (error) throw error;

    return res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating favorite author:', error);
    return res.status(500).json({ error: 'An error occurred while creating favorite author' });
  }
};

const deleteFavoriteAuthor = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  try {
    const { data, error } = await supabase
      .from('favorite_authors')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    if (data === null) {
      return res.status(404).json({ error: 'Favorite author not found or you do not have permission to delete it' });
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting favorite author:', error);
    return res.status(500).json({ error: 'An error occurred while deleting favorite author' });
  }
};