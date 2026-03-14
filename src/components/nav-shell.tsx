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
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-midnight/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
          <Globe className="h-4 w-4 text-aurora-2" />
          World Leaders Atlas
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition ${pathname === link.href ? 'text-aurora-1' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="toggle-theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="glass rounded-full p-2"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
