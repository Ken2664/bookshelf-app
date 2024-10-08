import axios, { AxiosError } from 'axios';

export interface BookInfo {
  title: string;
  author: string;
  publisher: string;
}

interface DifyResponse {
  workflow_run_id: string;
  task_id: string;
  data: {
    id: string;
    workflow_id: string;
    status: string;
    outputs: {
      text?: string;
    };
    error: string | null;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  };
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
    url: string;
  }>;
}

export const runDifyWorkflow = async (imageUrl: string): Promise<BookInfo> => {
  const url = 'https://api.dify.ai/v1/workflows/run';
  const headers = {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const payload: DifyPayload = {
      inputs: {},
      query: "",
      response_mode: "blocking",
      conversation_id: "",
      user: process.env.NEXT_PUBLIC_DIFY_USER_ID || '',
      files: [
        {
          type: "image",
          transfer_method: "remote_url",
          url: imageUrl
        }
      ]
    };

    console.log('Sending request to Dify API:', JSON.stringify(payload));
    const response = await axios.post<DifyResponse>(url, payload, { headers });
    console.log('Dify API response:', JSON.stringify(response.data, null, 2));
    
    // レスポンスの解析を改善
    let bookInfo: BookInfo;
    const outputText = response.data.data?.outputs?.text;
    if (outputText) {
      try {
        bookInfo = JSON.parse(outputText);
      } catch (parseError) {
        console.error('Failed to parse Dify response:', outputText);
        bookInfo = {
          title: outputText,
          author: '',
          publisher: ''
        };
      }
    } else {
      console.error('Unexpected Dify response format:', response.data);
      throw new Error('Dify APIからの応答が不正な形式です');
    }
    
    return bookInfo;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Dify API error:', axiosError.response?.status, axiosError.response?.data);
      throw new Error(`Dify API error: ${axiosError.response?.status} ${JSON.stringify(axiosError.response?.data)}`);
    }
    console.error('Unexpected error:', error);
    if (error instanceof Error) {
      throw new Error(`本の情報の処理中に予期せぬエラーが発生しました: ${error.message}`);
    }
    throw new Error('本の情報の処理中に予期せぬエラーが発生しました');
  }
};