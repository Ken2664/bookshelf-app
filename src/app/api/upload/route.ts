import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../lib/cloudinary';
import { runDifyWorkflow } from '../../../lib/dify';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64Image}`;

    console.log('Uploading to Cloudinary...');
    const cloudinaryUrl = await uploadToCloudinary(dataURI);
    console.log('Cloudinary URL:', cloudinaryUrl);  // ここでCloudinaryのURLをコンソールに表示

    console.log('Running Dify workflow...');
    const bookInfo = await runDifyWorkflow(cloudinaryUrl);
    console.log('Book info:', bookInfo);

    return NextResponse.json({ bookInfo, coverUrl: cloudinaryUrl });
  } catch (error) {
    console.error('Error processing image:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}