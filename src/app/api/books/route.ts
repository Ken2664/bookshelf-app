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
      return getBooks(req, res, supabase, session.user.id);
    case 'POST':
      return createBook(req, res, supabase, session.user.id);
    case 'PUT':
      return updateBook(req, res, supabase, session.user.id);
    case 'DELETE':
      return deleteBook(req, res, supabase, session.user.id);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getBooks = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};

const createBook = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { title, author, publisher, rating, comment, status, favorite } = req.body;

  const { data, error } = await supabase
    .from('books')
    .insert([
      { user_id: userId, title, author, publisher, rating, comment, status, favorite },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data[0]);
};

const updateBook = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { id, rating, comment } = req.body;

  const { data, error } = await supabase
    .from('books')
    .update({ rating, comment })
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

const deleteBook = async (req: NextApiRequest, res: NextApiResponse, supabase: SupabaseClient, userId: string) => {
  const { id } = req.body;

  const { data, error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data === null) {
    return res.status(404).json({ error: 'Book not found or you do not have permission to delete it' });
  }

  return res.status(204).end();
};