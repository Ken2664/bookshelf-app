import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { FavoriteAuthor } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getFavoriteAuthors(req, res);
    case 'POST':
      return createFavoriteAuthor(req, res);
    case 'DELETE':
      return deleteFavoriteAuthor(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getFavoriteAuthors = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id } = req.query;

  if (typeof user_id !== 'string') {
    return res.status(400).json({ error: 'Invalid user_id' });
  }

  const { data, error } = await supabase
    .from<FavoriteAuthor>('FavoriteAuthor')
    .select('*')
    .eq('user_id', user_id)
    .order('author_name', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};

const createFavoriteAuthor = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id, author_name } = req.body;

  if (!user_id || !author_name) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { data, error } = await supabase
    .from<FavoriteAuthor>('FavoriteAuthor')
    .insert([{ user_id, author_name }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data[0]);
};

const deleteFavoriteAuthor = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  const { error } = await supabase
    .from<FavoriteAuthor>('FavoriteAuthor')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).end();
};