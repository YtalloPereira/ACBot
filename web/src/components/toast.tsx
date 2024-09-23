'use client';

import { ITheme } from '@/contexts/theme';
import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export const Toast = () => {
  const { theme } = useTheme();
  // Toast component to give messages with the theme from the context
  return (
    <Toaster
      richColors
      expand
      closeButton
      theme={(theme as ITheme | null) ?? 'system'}
      toastOptions={{
        style: {
          willChange: 'unset',
        },
      }}
    />
  );
};
