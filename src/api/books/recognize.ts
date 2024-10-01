import type { NextApiRequest, NextApiResponse } from 'next';
import { runDifyWorkflow } from '../../lib/dify';

interface DifyResponse {
  title: string;
  author: string;
  publisher: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: '画像が提供されていません。' });
      }

      const result = await runDifyWorkflow(image);
      const bookInfo: DifyResponse = {
        title: result.title,
        author: result.author,
        publisher: result.publisher,
      };

      res.status(200).json(bookInfo);
    } catch (error) {
      console.error('Dify APIとの連携に失敗しました:', error);
      res.status(500).json({ error: '画像認識に失敗しました。' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}