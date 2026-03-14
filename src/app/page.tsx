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
    <div className="space-y-10 pb-4">
      <Hero />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="surface-card rounded-2xl p-5 soft-float">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Countries</p>
          <p className="mt-2 font-display text-4xl text-[color:var(--text-1)]">{countries.length}</p>
          <p className="mt-1 text-sm text-muted">Live monitored records</p>
        </article>
        <article className="surface-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Coverage</p>
          <p className="mt-2 font-display text-4xl text-[color:var(--text-1)]">{coveredCountries}</p>
          <p className="mt-1 text-sm text-muted">Countries with active role holders</p>
        </article>
        <article className="surface-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Open alerts</p>
          <p className="mt-2 font-display text-4xl" style={{ color: 'var(--accent-3)' }}>
            {conflicts.length}
          </p>
          <p className="mt-1 text-sm text-muted">Records requiring review</p>
        </article>
        <article className="surface-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Verification mode</p>
          <p className="mt-2 font-display text-4xl" style={{ color: 'var(--accent-2)' }}>
            Live
          </p>
          <p className="mt-1 text-sm text-muted">Realtime + persisted snapshots</p>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {highlights.map((highlight) => (
          <div key={highlight} className="surface-card rounded-2xl p-6 text-sm text-[color:var(--text-1)]">
            {highlight}
          </div>
        ))}
      </section>

      <WorldMap />
      <section className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <p className="text-lg font-medium text-[color:var(--text-1)]">Investigate country dossiers, timeline changes, and source-level evidence.</p>
        <Link
          href="/countries"
          className="rounded-full px-5 py-2 text-sm font-medium text-white"
          style={{ background: 'linear-gradient(120deg, var(--accent-1), var(--accent-3))' }}
        >
          Open Directory
        </Link>
      </section>
    </div>
  );
}
