'use server';

import { cookies } from 'next/headers';

const AUTH_TOKEN = 'accessToken';

// Check if the cookies has a auth token
export const hasAuthToken = async () => {
  const allCookies = cookies().getAll();
  return allCookies.some((cookie) => cookie.name.endsWith(AUTH_TOKEN));
};

// Get the auth token from the cookies
export const getAuthToken = async () => {
  const allCookies = cookies().getAll();
  const token = allCookies.find((cookie) => cookie.name.endsWith(AUTH_TOKEN));

  return token?.value;
};
