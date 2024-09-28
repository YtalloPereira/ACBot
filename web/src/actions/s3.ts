import { api } from '@/lib/api';

export const getUploadAudioSignedUrl = async (filename: string) => {
  const response = await api.post<{ filename: string; url: string }>(
    '/audios/make-upload',
    { filename },
  );

  return response.data;
};

export const getUploadImageSignedUrl = async (filename: string) => {
  const response = await api.post<{ filename: string; url: string }>(
    '/images/make-upload',
    { filename },
  );

  return response.data;
};
