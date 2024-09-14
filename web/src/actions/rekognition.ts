'use server';

import { api } from '@/lib/api';
import { AxiosError } from 'axios';

export const detectText = async (filename: string) => {
  try {
    const response = await api.post('/images/detect-text', { filename });
  
    return response.data.text;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else {
        throw new Error('Failed to detect text in image');
      }
    }
  }
};
