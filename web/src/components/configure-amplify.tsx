'use client';

import { Amplify } from 'aws-amplify';
import { ReactNode } from 'react';

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
        identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID as string,
        allowGuestAccess: false,
        userAttributes: {
          name: { required: true },
        },
      },
    },
    Storage: {
      S3: {
        bucket: process.env.NEXT_PUBLIC_BUCKET_NAME as string,
        region: process.env.NEXT_PUBLIC_REGION as string,
      },
    },
    Interactions: {
      LexV2: {
        [process.env.NEXT_PUBLIC_BOT_NAME as string]: {
          aliasId: process.env.NEXT_PUBLIC_BOT_ALIAS_ID as string,
          botId: process.env.NEXT_PUBLIC_BOT_ID as string,
          localeId: 'pt_BR',
          region: process.env.NEXT_PUBLIC_REGION as string,
        },
      },
    },
  },
  { ssr: true },
);

export const ConfigureAmplify = ({ children }: { children: ReactNode }) => {
  return children;
};
