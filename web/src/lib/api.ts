import { getAuthToken } from '@/actions/headers';
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.API_URL}/v1`,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export { api };
