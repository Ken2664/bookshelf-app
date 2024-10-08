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

// 新しい関数を追加
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinaryからの画像削除に失敗しました:', error);
    if (error instanceof Error) {
      throw new Error(`Cloudinaryからの画像削除に失敗しました: ${error.message}`);
    }
    throw new Error('Cloudinaryからの画像削除に失敗しました');
  }
};

// Cloudinary URLからpublic IDを抽出する関数
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return `book_covers/${filename.split('.')[0]}`;
};