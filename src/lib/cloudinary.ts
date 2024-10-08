import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (dataURI: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'book_covers' });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinaryへのアップロードに失敗しました:', error);
    if (error instanceof Error) {
      throw new Error(`Cloudinaryへのアップロードに失敗しました: ${error.message}`);
    }
    throw new Error('Cloudinaryへのアップロードに失敗しました');
  }
};