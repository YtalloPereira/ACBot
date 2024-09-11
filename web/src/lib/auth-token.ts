'use server';

import { cookies } from 'next/headers';

const AUTH_TOKEN = 'accessToken';

export const hasAuthToken = async () => {
  const allCookies = cookies().getAll();
  return allCookies.some((cookie) => cookie.name.endsWith(AUTH_TOKEN));
};

export const getAuthToken = async () => {
  const allCookies = cookies().getAll();
  const token = allCookies.find((cookie) => cookie.name.endsWith(AUTH_TOKEN));

  return token?.value;
};
