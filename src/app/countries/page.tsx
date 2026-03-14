import { CountriesDirectory } from '@/components/countries-directory';
import { getCountries } from '@/lib/data';

export default async function CountriesPage() {
  const countries = await getCountries();

  const directoryItems = countries.map((country) => {
    const confidence = country.verificationSnapshots[0]?.confidenceScore ?? 0;
    const leaders = country.leaderAssignments.map((assignment) => assignment.leader.fullName).join(' · ');

    return {
      id: country.id,
      slug: country.slug,
      name: country.name,
      flagEmoji: country.flagEmoji,
      region: country.region,
      confidence,
      leaders: leaders || 'Pending verification'
    };
  });

  return (
    <div className="space-y-8">
      <header className="surface-card rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-muted">Global Registry</p>
        <h1 className="mt-2 font-display text-4xl text-[color:var(--text-1)] md:text-5xl">Country Directory</h1>
        <p className="mt-3 text-muted">
          Searchable directory with current leadership, confidence scores, and verification recency.
        </p>
      </header>
      <CountriesDirectory countries={directoryItems} />
    </div>
  );
}
