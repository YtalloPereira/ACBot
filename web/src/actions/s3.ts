'use server';

import { api } from '@/lib/api';
import { AxiosError } from 'axios';

export const getUploadAudioSignedUrl = async (filename: string) => {
  try {
    const response = await api.post<{ filename: string; url: string }>(
      '/audios/make-upload',
      { filename },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else {
        throw new Error('Failed to get signed url');
      }
    }
  }
};

export const getUploadImageSignedUrl = async (filename: string) => {
  try {
    const response = await api.post<{ filename: string; url: string }>(
      '/images/make-upload',
      { filename },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else {
        throw new Error('Failed to get signed url');
      }
    }
  }
};
