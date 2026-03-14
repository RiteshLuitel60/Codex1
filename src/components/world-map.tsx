'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type Region = {
  label: string;
  x: number;
  y: number;
  slug: string;
};

const regions: Region[] = [
  { label: 'North America', x: 130, y: 90, slug: 'Americas' },
  { label: 'South America', x: 210, y: 190, slug: 'Americas' },
  { label: 'Europe', x: 360, y: 70, slug: 'Europe' },
  { label: 'Africa', x: 370, y: 160, slug: 'Africa' },
  { label: 'Asia', x: 520, y: 100, slug: 'Asia' },
  { label: 'Oceania', x: 640, y: 200, slug: 'Oceania' }
];

export function WorldMap() {
  return (
    <section className="glass rounded-3xl p-8">
      <h2 className="mb-2 font-display text-3xl text-ink dark:text-slate-100">Interactive Global Map</h2>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">Jump into region-filtered country records with live confidence snapshots.</p>
      <svg viewBox="0 0 760 320" className="w-full rounded-2xl bg-slate-950/95 p-4">
        <rect x="20" y="30" width="700" height="250" rx="20" fill="url(#ocean)" />
        <g opacity="0.55">
          <circle cx="150" cy="120" r="3" fill="#f59e0b" />
          <circle cx="220" cy="170" r="2.4" fill="#14b8a6" />
          <circle cx="360" cy="100" r="2.6" fill="#fb7185" />
          <circle cx="500" cy="130" r="2.4" fill="#f59e0b" />
          <circle cx="640" cy="220" r="2.8" fill="#14b8a6" />
        </g>
        <defs>
          <linearGradient id="ocean" x1="0" x2="1">
            <stop offset="0%" stopColor="#10243a" />
            <stop offset="55%" stopColor="#111827" />
            <stop offset="100%" stopColor="#05222b" />
          </linearGradient>
        </defs>
        {regions.map((region) => (
          <foreignObject key={region.label} x={region.x} y={region.y} width="140" height="50">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-center text-xs text-white"
            >
              <Link href={`/countries?region=${region.slug}`}>{region.label}</Link>
            </motion.div>
          </foreignObject>
        ))}
      </svg>
    </section>
  );
}
