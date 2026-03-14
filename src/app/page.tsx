import Link from 'next/link';
import { Hero } from '@/components/hero';
import { WorldMap } from '@/components/world-map';
import { getCountries, getOpenConflicts } from '@/lib/data';

const highlights = [
  'Cross-source validation (Wikidata + independent editorial listing)',
  'Conflict detection when role-holder records disagree',
  'Persisted verification snapshots for historical auditability',
  'Transparency-first citations with confidence scoring'
];

export default async function HomePage() {
  const [countries, conflicts] = await Promise.all([getCountries(), getOpenConflicts()]);
  const coveredCountries = countries.filter((country) => country.leaderAssignments.length > 0).length;

  return (
    <div className="space-y-10">
      <Hero />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="glass rounded-2xl p-5 soft-float">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Countries</p>
          <p className="mt-2 font-display text-4xl text-ink dark:text-slate-100">{countries.length}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Live monitored records</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Coverage</p>
          <p className="mt-2 font-display text-4xl text-ink dark:text-slate-100">{coveredCountries}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Countries with active role holders</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Open alerts</p>
          <p className="mt-2 font-display text-4xl text-ember dark:text-amber-300">{conflicts.length}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Records requiring review</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Verification mode</p>
          <p className="mt-2 font-display text-4xl text-lagoon dark:text-teal-300">Live</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Realtime + persisted snapshots</p>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {highlights.map((highlight) => (
          <div key={highlight} className="glass rounded-2xl p-6 text-sm text-slate-700 dark:text-slate-200">
            {highlight}
          </div>
        ))}
      </section>

      <WorldMap />
      <section className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <p className="text-lg font-medium">Investigate country dossiers, timeline changes, and source-level evidence.</p>
        <Link href="/countries" className="rounded-full bg-ink px-5 py-2 text-sm text-white dark:bg-brass dark:text-midnight">
          Open Directory
        </Link>
      </section>
    </div>
  );
}
