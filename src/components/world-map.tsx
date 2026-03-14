'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type Region = {
  label: string;
  cx: number;
  cy: number;
  slug: string;
  to: { x: number; y: number };
};

const regions: Region[] = [
  { label: 'North America', cx: 160, cy: 116, slug: 'Americas', to: { x: 94, y: 76 } },
  { label: 'South America', cx: 238, cy: 214, slug: 'Americas', to: { x: 192, y: 250 } },
  { label: 'Europe', cx: 390, cy: 98, slug: 'Europe', to: { x: 356, y: 54 } },
  { label: 'Africa', cx: 402, cy: 185, slug: 'Africa', to: { x: 392, y: 245 } },
  { label: 'Asia', cx: 544, cy: 132, slug: 'Asia', to: { x: 616, y: 84 } },
  { label: 'Oceania', cx: 676, cy: 238, slug: 'Oceania', to: { x: 728, y: 270 } }
];

export function WorldMap() {
  return (
    <section className="glass rounded-3xl p-8">
      <h2 className="mb-2 font-display text-3xl text-[color:var(--text-1)]">Interactive Global Map</h2>
      <p className="mb-6 text-sm text-muted">Browse region-filtered country records from a cartographic control surface.</p>

      <div className="relative overflow-hidden rounded-2xl border border-[var(--panel-border)] p-3 md:p-4">
        <svg viewBox="0 0 780 360" className="w-full" role="img" aria-label="World regions map">
          <defs>
            <linearGradient id="mapOcean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--map-ocean-1)" />
              <stop offset="100%" stopColor="var(--map-ocean-2)" />
            </linearGradient>
          </defs>

          <rect x="8" y="8" width="764" height="344" rx="28" fill="url(#mapOcean)" />

          <g fill="var(--map-land)" stroke="var(--map-land-stroke)" strokeWidth="2.2">
            <path d="M86 96l45-24 64 2 30 25-6 29-41 16-38 6-23-9-18-29z" />
            <path d="M193 191l31 10 17 27-8 52-19 28-18-12 2-39-16-25z" />
            <path d="M343 99l35-17 27 9-3 23-36 18-25-10z" />
            <path d="M377 155l32-12 33 22-6 69-29 43-24-7-12-39 11-35z" />
            <path d="M445 96l88-17 90 27 49 35-17 47-90 16-58-13-46-27z" />
            <path d="M628 235l36-9 32 18-6 33-34 8-30-22z" />
          </g>

          <g>
            {regions.map((region) => (
              <g key={region.label}>
                <circle cx={region.cx} cy={region.cy} r="4.8" fill="var(--map-dot)" />
                <path
                  d={`M${region.cx} ${region.cy} C ${region.cx + 14} ${region.cy - 12}, ${region.to.x - 14} ${region.to.y + 10}, ${region.to.x} ${region.to.y}`}
                  stroke="var(--map-dot)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.78"
                />
              </g>
            ))}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {regions.map((region, index) => (
            <motion.div
              key={region.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.45 }}
              className="pointer-events-auto absolute"
              style={{ left: `${(region.to.x / 780) * 100}%`, top: `${(region.to.y / 360) * 100}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Link
                href={`/countries?region=${region.slug}`}
                className="inline-flex rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition hover:-translate-y-0.5"
                style={{
                  background: 'var(--map-link-bg)',
                  borderColor: 'var(--map-link-border)',
                  color: 'var(--map-link-text)'
                }}
              >
                {region.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
