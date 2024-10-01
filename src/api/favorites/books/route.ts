import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { Book } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return updateFavoriteStatus(req, res);
    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const updateFavoriteStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, favorite } = req.body;

  if (!id || typeof favorite !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const { data, error } = await supabase
    .from<Book>('Book')
    .update({ favorite })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data[0]);
};