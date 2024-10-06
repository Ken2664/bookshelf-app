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
    case 'PUT':
      return updateFavoriteStatus(req, res, supabase, session.user.id);
    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const updateFavoriteStatus = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { id, favorite } = req.body;

  if (!id || typeof favorite !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const { data, error } = await supabase
    .from('books')
    .update({ favorite })
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Book not found or you do not have permission to update it' });
  }

  return res.status(200).json(data[0]);
};