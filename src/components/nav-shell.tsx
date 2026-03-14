'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const links: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/countries', label: 'Countries' },
  { href: '/tracker', label: 'Change Tracker' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/admin/conflicts', label: 'Admin' }
];

export function NavShell() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-stonewash/60 bg-[color:var(--surface)]/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-midnight/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.22em] text-ink dark:text-slate-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass/20 text-brass dark:bg-brass/25">
            <Globe className="h-4 w-4" />
          </span>
          Atlas
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                pathname === link.href
                  ? 'bg-ink text-white dark:bg-brass dark:text-midnight'
                  : 'text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="toggle-theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="glass rounded-full border border-stonewash/70 p-2"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
