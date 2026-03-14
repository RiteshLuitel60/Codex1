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
  { label: 'North America', x: 130, y: 90, slug: 'north-america' },
  { label: 'South America', x: 210, y: 190, slug: 'south-america' },
  { label: 'Europe', x: 360, y: 70, slug: 'europe' },
  { label: 'Africa', x: 370, y: 160, slug: 'africa' },
  { label: 'Asia', x: 520, y: 100, slug: 'asia' },
  { label: 'Oceania', x: 640, y: 200, slug: 'oceania' }
];

export function WorldMap() {
  return (
    <section className="glass rounded-3xl p-8">
      <h2 className="mb-6 text-2xl font-semibold">Interactive global map</h2>
      <svg viewBox="0 0 760 320" className="w-full rounded-2xl bg-slate-950/90 p-4">
        <rect x="20" y="30" width="700" height="250" rx="20" fill="url(#ocean)" />
        <defs>
          <linearGradient id="ocean" x1="0" x2="1">
            <stop offset="0%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        {regions.map((region) => (
          <foreignObject key={region.label} x={region.x} y={region.y} width="140" height="50">
            <motion.div whileHover={{ scale: 1.04 }} className="rounded-full bg-white/10 px-3 py-1.5 text-center text-xs text-white">
              <Link href={`/countries?region=${region.slug}`}>{region.label}</Link>
            </motion.div>
          </foreignObject>
        ))}
      </svg>
    </section>
  );
}
