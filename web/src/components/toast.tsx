'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export const Toast = () => {
  const { theme } = useTheme();
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
