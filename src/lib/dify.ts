import axios from 'axios';

export interface BookInfo {
  title: string;
  author: string;
  publisher: string;
}

export const recognizeBook = async (imageBase64: string): Promise<BookInfo> => {
  const url = '/api/books/recognize';
  
  try {
    const response = await axios.post(url, { image: imageBase64 });
    return response.data;
  } catch (error) {
    console.error('本の認識に失敗しました:', error);
    throw error;
  }
};

export const runDifyWorkflow = async (imageBase64: string): Promise<BookInfo> => {
  const url = 'https://api.dify.ai/v1';
  const headers = {
    'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const payload = {
    response_mode: 'blocking',
    user: process.env.DIFY_USER_ID,
    files: [
      {
        type: 'image',
        transfer_method: 'base64',
        data: imageBase64.split(',')[1], // base64データのみを送信
      },
    ],
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const data = response.data;

    // ここで必要に応じてデータを解析
    const bookInfo: BookInfo = {
      title: data.outputs.title,
      author: data.outputs.author,
      publisher: data.outputs.publisher,
    };

    return bookInfo;
  } catch (error) {
    console.error('Dify Workflowの実行に失敗しました:', error);
    throw error;
  }
};