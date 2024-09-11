'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ITheme>('system');

  const loadTheme = useCallback(async () => {
    const savedTheme = localStorage.getItem('theme') as ITheme | null;

    localStorage.setItem('theme', savedTheme ?? theme);

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme, theme]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  return (
    <NextThemesProvider attribute="class" enableSystem defaultTheme={theme}>
      {children}
    </NextThemesProvider>
  );
};
