import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '@/lib/cloudinary';
import { runDifyWorkflow } from '@/lib/dify';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: '画像が提供されていません' }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataURI = `data:${image.type};base64,${buffer.toString('base64')}`;

    const coverUrl = await uploadToCloudinary(dataURI);

    try {
      const bookInfo = await runDifyWorkflow(coverUrl);

      // Difyからのレスポンスを受け取った後、Cloudinaryの画像を削除
      const publicId = getPublicIdFromUrl(coverUrl);
      await deleteFromCloudinary(publicId);

      return NextResponse.json({ bookInfo, coverUrl });
    } catch (difyError) {
      console.error('Dify APIエラー:', difyError);

      // Difyでエラーが発生した場合も、Cloudinaryの画像を削除
      const publicId = getPublicIdFromUrl(coverUrl);
      await deleteFromCloudinary(publicId);

      return NextResponse.json({ error: 'Dify APIエラー' }, { status: 500 });
    }
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json({ error: 'アップロードエラー' }, { status: 500 });
  }
}