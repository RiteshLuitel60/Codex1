'use client';

import { useMemo, useState } from 'react';
import { CountryCard } from '@/components/country-card';

type CountryDirectoryItem = {
  id: string;
  slug: string;
  name: string;
  flagEmoji: string;
  region: string;
  leaders: string;
  confidence: number;
};

const regions = ['All regions', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];

export function CountriesDirectory({ countries }: { countries: CountryDirectoryItem[] }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const byRegion = region === 'All regions' || country.region === region;
      const q = query.toLowerCase();
      const byQuery =
        q.length === 0 || country.name.toLowerCase().includes(q) || country.leaders.toLowerCase().includes(q);

      return byRegion && byQuery;
    });
  }, [countries, query, region]);

  return (
    <>
      <div className="surface-card grid gap-4 rounded-2xl p-4 md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search country or leader..."
          className="rounded-xl border border-[var(--panel-border)] bg-[color:var(--panel)] px-3 py-2 text-[color:var(--text-1)] placeholder:text-[color:var(--text-2)] focus-visible:theme-focus"
        />
        <select
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className="rounded-xl border border-[var(--panel-border)] bg-[color:var(--panel)] px-3 py-2 text-[color:var(--text-1)] focus-visible:theme-focus"
        >
          {regions.map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName}
            </option>
          ))}
        </select>
      </div>

      {filteredCountries.length === 0 ? (
        <div className="surface-card rounded-2xl p-10 text-center text-muted">No matching country records yet.</div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.id}
              slug={country.slug}
              name={country.name}
              flagEmoji={country.flagEmoji}
              region={country.region}
              confidence={country.confidence}
              leaders={country.leaders}
            />
          ))}
        </section>
      )}
    </>
  );
}
