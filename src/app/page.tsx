import Link from 'next/link';
import { Hero } from '@/components/hero';
import { WorldMap } from '@/components/world-map';

const highlights = [
  'Source credibility scoring engine with tiered trust labels',
  'Conflict detection across official and independent records',
  'Historical snapshots with verification timestamps',
  'Editorial country dossiers with transparent citations'
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <section className="grid gap-6 md:grid-cols-2">
        {highlights.map((highlight) => (
          <div key={highlight} className="glass rounded-2xl p-6 text-sm">
            {highlight}
          </div>
        ))}
      </section>
      <WorldMap />
      <section className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <p className="text-lg font-medium">Explore 190+ country profiles and leadership timelines.</p>
        <Link href="/countries" className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
          Open Directory
        </Link>
      </section>
    </div>
  );
}
