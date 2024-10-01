import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { Book } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getBooks(req, res);
    case 'POST':
      return createBook(req, res);
    case 'PUT':
      return updateBook(req, res);
    case 'DELETE':
      return deleteBook(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getBooks = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase.from<Book>('Book').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};

const createBook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id, title, author, publisher, rating, comment, status, favorite } = req.body;

  const { data, error } = await supabase.from<Book>('Book').insert([
    { user_id, title, author, publisher, rating, comment, status, favorite },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data[0]);
};

const updateBook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, rating, comment } = req.body;

  const { data, error } = await supabase.from<Book>('Book').update({ rating, comment }).eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data[0]);
};

const deleteBook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  const { error } = await supabase.from<Book>('Book').delete().eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(204).end();
};