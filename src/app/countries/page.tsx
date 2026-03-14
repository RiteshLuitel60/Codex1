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
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Country directory</h1>
        <p className="text-slate-500 dark:text-slate-300">
          Searchable directory with current leadership, confidence scores, and verification recency.
        </p>
      </header>
      <CountriesDirectory countries={directoryItems} />
    </div>
  );
}
