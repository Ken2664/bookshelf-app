import axios, { AxiosError } from 'axios';

export interface BookInfo {
  title: string;
  author: string;
  publisher: string;
}

interface DifyResponse {
  answer: string;
  // 他の必要なレスポンスフィールドがあれば追加してください
}

interface DifyPayload {
  inputs: Record<string, unknown>;
  query: string;
  response_mode: 'blocking' | 'streaming';
  conversation_id: string;
  user: string;
  files: Array<{
    type: string;
    transfer_method: string;
    url?: string;
    data?: string;
  }>;
}

export const runDifyWorkflow = async (imageBase64: string): Promise<BookInfo> => {
  const url = 'https://api.dify.ai/v1/chat-messages';
  const headers = {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
    'Content-Type': 'application/json'
  };

  const payload: DifyPayload = {
    inputs: {},
    query: "",  // クエリは空
    response_mode: "blocking",
    conversation_id: "",
    user: process.env.NEXT_PUBLIC_DIFY_USER_ID || '',
    files: [
      {
        type: "image",
        transfer_method: "base64",
        data: imageBase64
      }
    ]
  };

  console.log('Dify API Request Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post<DifyResponse>(url, payload, { headers });
    console.log('Dify API Response:', response.data);
    const bookInfo: BookInfo = JSON.parse(response.data.answer);
    return bookInfo;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Dify API error:', axiosError.response?.status, axiosError.response?.data);
      throw new Error(`Dify API error: ${axiosError.response?.status} ${JSON.stringify(axiosError.response?.data)}`);
    }
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred while processing the book information');
  }
};