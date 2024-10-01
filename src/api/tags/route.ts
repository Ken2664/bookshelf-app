import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { Tag } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getTags(req, res);
    case 'POST':
      return createTag(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase.from<Tag>('Tag').select('*').order('name', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};

const createTag = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id, name } = req.body;

  const { data, error } = await supabase.from<Tag>('Tag').insert([{ user_id, name }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data[0]);
};