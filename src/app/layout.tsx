import type { Metadata } from 'next';
import './globals.css';
import { NavShell } from '@/components/nav-shell';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'World Leaders Atlas',
  description: 'Verified leadership intelligence, source credibility, and historical snapshots for every sovereign nation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NavShell />
          <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
