import { CountryCard } from '@/components/country-card';
import { getCountries } from '@/lib/data';

export default async function CountriesPage({
  searchParams
}: {
  searchParams: { q?: string; region?: string };
}) {
  const countries = await getCountries(searchParams.q, searchParams.region);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Country directory</h1>
        <p className="text-slate-500 dark:text-slate-300">Searchable directory with current leadership, confidence scores, and verification recency.</p>
      </header>
      <form className="glass grid gap-4 rounded-2xl p-4 md:grid-cols-[1fr_220px_auto]">
        <input name="q" placeholder="Search country or leader..." className="rounded-xl border border-slate-300 bg-transparent px-3 py-2" />
        <select name="region" className="rounded-xl border border-slate-300 bg-transparent px-3 py-2">
          <option value="">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Americas">Americas</option>
          <option value="Oceania">Oceania</option>
        </select>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-white dark:text-slate-900">Search</button>
      </form>
      {countries.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-500">No matching country records yet.</div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {countries.map((country) => {
            const confidence = country.verificationSnapshots[0]?.confidenceScore ?? 0;
            const leaders = country.leaderAssignments.map((assignment) => assignment.leader.fullName).join(' · ');
            return (
              <CountryCard
                key={country.id}
                slug={country.slug}
                name={country.name}
                flagEmoji={country.flagEmoji}
                region={country.region}
                confidence={confidence}
                leaders={leaders || 'Pending verification'}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
