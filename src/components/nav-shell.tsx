'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Globe } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

const links: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/countries', label: 'Countries' },
  { href: '/tracker', label: 'Change Tracker' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/admin/conflicts', label: 'Admin' }
];

export function NavShell() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--panel-border)] bg-[color:var(--panel)]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--text-1)]">
          <span className="brand-pill flex h-8 w-8 items-center justify-center rounded-full">
            <Globe className="h-4 w-4" />
          </span>
          Command Atlas
        </Link>
        <nav className="order-3 flex w-full items-center gap-2 overflow-x-auto pb-1 md:order-2 md:w-auto md:pb-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                pathname === link.href
                  ? 'brand-pill'
                  : 'text-[color:var(--text-2)] hover:bg-white/30 hover:text-[color:var(--text-1)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="order-2 md:order-3">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
