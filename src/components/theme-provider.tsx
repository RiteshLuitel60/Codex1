'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={['light', 'dark', 'aurora', 'sunset', 'forest']}
      value={{
        light: 'light',
        dark: 'dark',
        aurora: 'dark aurora',
        sunset: 'sunset',
        forest: 'dark forest'
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
