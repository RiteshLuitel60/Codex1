'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

const themeOptions = [
  { value: 'light', label: 'Light Blueprint' },
  { value: 'dark', label: 'Dark Command' },
  { value: 'aurora', label: 'Aurora Grid' },
  { value: 'sunset', label: 'Sunset Paper' },
  { value: 'forest', label: 'Forest Signal' }
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <label className="group relative inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[color:var(--panel)] px-3 py-1.5 text-sm backdrop-blur-md">
      <Palette className="h-4 w-4 text-[color:var(--accent-2)]" />
      <span className="sr-only">Color scheme</span>
      <select
        aria-label="Choose color scheme"
        value={mounted ? theme : 'dark'}
        onChange={(event) => setTheme(event.target.value)}
        className="bg-transparent pr-6 text-[color:var(--text-1)] focus-visible:theme-focus"
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
