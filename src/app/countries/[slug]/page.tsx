import { notFound } from 'next/navigation';
import { SourcePanel } from '@/components/source-panel';
import { Timeline } from '@/components/timeline';
import { getCountries, getCountryBySlug } from '@/lib/data';
import { formatConfidence } from '@/lib/utils';


export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((country) => ({ slug: country.slug }));
}

export const dynamicParams = false;

export default async function CountryPage({ params }: { params: { slug: string } }) {
  const country = await getCountryBySlug(params.slug);

  if (!country) {
    notFound();
  }

  const currentLeaders = country.leaderAssignments.filter((assignment) => assignment.isCurrent);
  const citations = currentLeaders.flatMap((assignment) =>
    assignment.citations.map((citation) => ({
      id: citation.id,
      url: citation.url,
      sourceName: citation.source.name,
      trustScore: citation.trustScore,
      retrievedAt: citation.retrievedAt.toISOString()
    }))
  );

  const timeline = country.leaderAssignments.map((assignment) => ({
    leader: assignment.leader.fullName,
    role: assignment.role,
    start: assignment.assumedOfficeAt.toISOString().slice(0, 10),
    end: assignment.isCurrent ? undefined : assignment.updatedAt.toISOString().slice(0, 10)
  }));

  return (
    <div className="space-y-8">
      <header className="glass rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{country.region}</p>
        <h1 className="mt-2 text-4xl font-semibold">
          {country.flagEmoji} {country.name}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{country.profile}</p>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Government overview</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt>Government type</dt><dd>{country.governmentType}</dd></div>
            <div className="flex justify-between gap-4"><dt>Last verified</dt><dd>{country.verificationSnapshots[0]?.capturedAt.toLocaleString() ?? 'Pending'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Confidence</dt><dd>{formatConfidence(country.verificationSnapshots[0]?.confidenceScore ?? 0)}</dd></div>
          </dl>
        </article>

        <article className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Current leaders by role</h2>
          <div className="mt-4 space-y-4 text-sm">
            {currentLeaders.map((assignment) => (
              <div key={assignment.id} className="rounded-xl border border-slate-200/20 p-4">
                <p className="font-semibold">{assignment.role}</p>
                <p>{assignment.officialTitle}: {assignment.leader.fullName}</p>
                <p>Assumed office: {assignment.assumedOfficeAt.toISOString().slice(0, 10)}</p>
                <p>Predecessor: {assignment.predecessor ?? 'N/A'}</p>
                <p>Affiliation: {assignment.leader.party ?? 'Independent / not declared'}</p>
                <p className="text-slate-500">{assignment.leader.profile}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <SourcePanel citations={citations} />
      <Timeline items={timeline} />
    </div>
  );
}
