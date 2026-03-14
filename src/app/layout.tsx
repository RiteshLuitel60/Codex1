import type { Metadata } from 'next';
import { DM_Serif_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { NavShell } from '@/components/nav-shell';
import { ThemeProvider } from '@/components/theme-provider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif'
});

export const metadata: Metadata = {
  title: 'World Leaders Atlas',
  description: 'Verified leadership intelligence, source credibility, and historical snapshots for every sovereign nation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${dmSerif.variable} font-sans`}>
        <ThemeProvider>
          <NavShell />
          <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
