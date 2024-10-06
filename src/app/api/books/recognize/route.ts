import { NextRequest, NextResponse } from 'next/server';
import { runDifyWorkflow } from '@/lib/dify';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: '画像が提供されていません。' }, { status: 400 });
    }

    const bookInfo = await runDifyWorkflow(image);

    return NextResponse.json(bookInfo);
  } catch (error) {
    console.error('Dify APIとの連携に失敗しました:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: '画像認識に失敗しました。', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: '不明なエラーが発生しました。' }, { status: 500 });
    }
  }
}